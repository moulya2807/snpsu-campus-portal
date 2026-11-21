-- ========================================================================
-- SAPTHAGIRI NPS UNIVERSITY (SNPSU) - RELATIONAL DATABASE SCHEMA & RLS POLICIES
-- Target: PostgreSQL / Supabase
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Schools (Multidisciplinary Structure)
CREATE TABLE schools (
    school_id VARCHAR(20) PRIMARY KEY, -- 'SOET', 'SIMS_RC', 'SOMS', 'SOAS'
    name VARCHAR(255) NOT NULL,
    dean_faculty_id VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Departments
CREATE TABLE departments (
    department_id VARCHAR(30) PRIMARY KEY, -- 'CSE', 'AI_DS', 'MBBS_SURGERY'
    school_id VARCHAR(20) REFERENCES schools(school_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    hod_faculty_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Programs
CREATE TABLE programs (
    program_id VARCHAR(30) PRIMARY KEY, -- 'BTECH_CSE', 'MBBS', 'BCA', 'MBA'
    department_id VARCHAR(30) REFERENCES departments(department_id) ON DELETE CASCADE,
    degree_level VARCHAR(20) NOT NULL, -- 'B.Tech', 'MBBS', 'BCA', 'MBA', 'B.Sc'
    duration_years INT NOT NULL,
    total_semesters INT NOT NULL
);

-- 4. Students (University Seat Number USN Tracking)
CREATE TABLE students (
    usn VARCHAR(15) PRIMARY KEY, -- e.g., '1SN24CS001'
    user_id UUID UNIQUE, -- Foreign key to auth.users in Supabase
    full_name VARCHAR(150) NOT NULL,
    institutional_email VARCHAR(150) UNIQUE NOT NULL,
    program_id VARCHAR(30) REFERENCES programs(program_id),
    current_semester INT NOT NULL,
    section CHAR(1) NOT NULL, -- 'A', 'B', 'C'
    lab_batch VARCHAR(10), -- 'B1', 'B2', 'CLINICAL_A'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on USN and batch for sub-millisecond lookups
CREATE INDEX idx_students_semester_sec ON students(program_id, current_semester, section);
CREATE INDEX idx_students_batch ON students(lab_batch);

-- 5. Subjects (CBCS Scheme: Theory, Lab, Clinical Posting)
CREATE TABLE subjects_cbcs (
    subject_code VARCHAR(20) PRIMARY KEY, -- '22CS501', '22CSL506', 'MBBS302'
    subject_name VARCHAR(255) NOT NULL,
    department_id VARCHAR(30) REFERENCES departments(department_id),
    semester INT NOT NULL,
    course_type VARCHAR(25) NOT NULL, -- 'THEORY', 'LAB', 'CLINICAL_POSTING', 'ELECTIVE_CBCS'
    credits INT NOT NULL,
    periods_per_week INT NOT NULL,
    is_elective BOOLEAN DEFAULT FALSE
);

-- 6. Timetable Slots
CREATE TABLE timetable_slots (
    slot_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_code VARCHAR(20) REFERENCES subjects_cbcs(subject_code),
    faculty_id UUID NOT NULL, -- References auth.users
    room_number VARCHAR(50) NOT NULL,
    day_of_week VARCHAR(15) NOT NULL,
    period_number INT NOT NULL,
    period_weight INT NOT NULL DEFAULT 1, -- 1 for 1-hr lecture, 2 for 2-hr lab, 3 for clinical
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    section CHAR(1) NOT NULL,
    lab_batch VARCHAR(10) DEFAULT 'ALL'
);

-- 7. Attendance Logs (Immutable Audit Trail)
CREATE TABLE attendance_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slot_id UUID REFERENCES timetable_slots(slot_id),
    attendance_date DATE NOT NULL,
    usn VARCHAR(15) REFERENCES students(usn),
    status VARCHAR(10) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'OD')),
    period_weight INT NOT NULL DEFAULT 1,
    marked_by UUID NOT NULL,
    slot_start_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_attendance_entry UNIQUE (slot_id, attendance_date, usn)
);

CREATE INDEX idx_attendance_usn_date ON attendance_logs(usn, attendance_date);
CREATE INDEX idx_attendance_slot ON attendance_logs(slot_id, attendance_date);

-- 8. OD & Leave Requests
CREATE TABLE od_leave_requests (
    request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usn VARCHAR(15) REFERENCES students(usn),
    category VARCHAR(30) NOT NULL, -- 'OD_ISRO_WORKSHOP', 'OD_SPORTS', 'OD_NCC', 'MEDICAL_LEAVE'
    description TEXT NOT NULL,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    document_proof_url TEXT,
    approval_status VARCHAR(20) DEFAULT 'PENDING' CHECK (approval_status IN ('PENDING', 'HOD_APPROVED', 'REJECTED')),
    approved_by UUID,
    applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Faculty Punch Logs (Campus Geo-Fence Verification)
CREATE TABLE faculty_punch_logs (
    punch_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID NOT NULL,
    punch_type VARCHAR(10) NOT NULL CHECK (punch_type IN ('PUNCH_IN', 'PUNCH_OUT')),
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    distance_meters NUMERIC(6,2) NOT NULL,
    is_within_geofence BOOLEAN NOT NULL,
    verification_status VARCHAR(30) NOT NULL,
    punched_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================================

ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE od_leave_requests ENABLE ROW LEVEL SECURITY;

-- Policy 1: Students can only SELECT their own attendance records
CREATE POLICY "Students view own attendance only"
ON attendance_logs
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM students s
        WHERE s.usn = attendance_logs.usn
        AND s.user_id = auth.uid()
    )
);

-- Policy 2: Faculty can SELECT attendance for their assigned slots
CREATE POLICY "Faculty view their assigned slot attendance"
ON attendance_logs
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM timetable_slots ts
        WHERE ts.slot_id = attendance_logs.slot_id
        AND ts.faculty_id = auth.uid()
    )
    OR (auth.jwt() ->> 'role') IN ('HOD', 'DEAN', 'ADMIN')
);

-- Policy 3: Faculty can INSERT attendance for their own slots
CREATE POLICY "Faculty insert attendance for allocated slots"
ON attendance_logs
FOR INSERT
WITH CHECK (
    marked_by = auth.uid()
    AND EXISTS (
        SELECT 1 FROM timetable_slots ts
        WHERE ts.slot_id = attendance_logs.slot_id
        AND ts.faculty_id = auth.uid()
    )
);

-- Policy 4: Strict 24-Hour Edit Window Policy (Faculty can only UPDATE within 24 hours)
CREATE POLICY "Faculty update within 24-hour edit window only"
ON attendance_logs
FOR UPDATE
USING (
    -- HOD or Dean has permanent override privilege
    (auth.jwt() ->> 'role') IN ('HOD', 'DEAN', 'ADMIN')
    OR (
        marked_by = auth.uid()
        AND NOW() < (slot_start_time + INTERVAL '24 hours')
    )
);
