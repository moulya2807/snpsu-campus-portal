import { Student, SubjectCBCS, TimetableSlot, AttendanceSummary, ODLeaveRequest, FacultyPunchLog } from '../types';

// SNPSU Chikkasandra Main Campus GPS Geofence (Latitude & Longitude)
export const SNPSU_CAMPUS_GEO = {
  latitude: 13.0645,
  longitude: 77.5028,
  radiusMeters: 300, // 300-meter campus perimeter
  name: 'SNPSU Main Campus, Chikkasandra, Hesarghatta Road, Bengaluru 560057',
};

export const MOCK_FACULTY = {
  id: 'FAC_CS_108',
  name: 'Dr. Ramesh Kumar, Ph.D.',
  designation: 'Associate Professor & CBCS Coordinator',
  school: 'School of Engineering & Technology (SOET)',
  department: 'Computer Science & Engineering',
  email: 'ramesh.kumar@sapthagiri.edu.in',
};

export const MOCK_STUDENTS: Student[] = [
  { usn: '1SN24CS001', name: 'Aarav Sharma', email: 'aarav.1sn24cs001@sapthagiri.edu.in', schoolId: 'SOET', departmentId: 'CSE', semester: 5, section: 'A', labBatch: 'B1', currentAttendanceRate: 88.5 },
  { usn: '1SN24CS002', name: 'Ananya Deshmukh', email: 'ananya.1sn24cs002@sapthagiri.edu.in', schoolId: 'SOET', departmentId: 'CSE', semester: 5, section: 'A', labBatch: 'B1', currentAttendanceRate: 91.0 },
  { usn: '1SN24CS003', name: 'Bhuvan Gowda', email: 'bhuvan.1sn24cs003@sapthagiri.edu.in', schoolId: 'SOET', departmentId: 'CSE', semester: 5, section: 'A', labBatch: 'B1', currentAttendanceRate: 71.4 }, // Condonation
  { usn: '1SN24CS004', name: 'Chaithra Hegde', email: 'chaithra.1sn24cs004@sapthagiri.edu.in', schoolId: 'SOET', departmentId: 'CSE', semester: 5, section: 'A', labBatch: 'B1', currentAttendanceRate: 84.0 },
  { usn: '1SN24CS005', name: 'Darshan Patel', email: 'darshan.1sn24cs005@sapthagiri.edu.in', schoolId: 'SOET', departmentId: 'CSE', semester: 5, section: 'A', labBatch: 'B1', currentAttendanceRate: 62.0 }, // Detained
  { usn: '1SN24CS006', name: 'Deepa Narayanan', email: 'deepa.1sn24cs006@sapthagiri.edu.in', schoolId: 'SOET', departmentId: 'CSE', semester: 5, section: 'A', labBatch: 'B1', currentAttendanceRate: 95.2 },
  { usn: '1SN24CS007', name: 'Gagan Kulkarni', email: 'gagan.1sn24cs007@sapthagiri.edu.in', schoolId: 'SOET', departmentId: 'CSE', semester: 5, section: 'A', labBatch: 'B2', currentAttendanceRate: 77.0 },
  { usn: '1SN24CS008', name: 'Harshitha Reddy', email: 'harshitha.1sn24cs008@sapthagiri.edu.in', schoolId: 'SOET', departmentId: 'CSE', semester: 5, section: 'A', labBatch: 'B2', currentAttendanceRate: 82.3 },
  { usn: '1SN24CS009', name: 'Irfan Pasha', email: 'irfan.1sn24cs009@sapthagiri.edu.in', schoolId: 'SOET', departmentId: 'CSE', semester: 5, section: 'A', labBatch: 'B2', currentAttendanceRate: 69.5 }, // Condonation
  { usn: '1SN24CS010', name: 'Kavya Suresh', email: 'kavya.1sn24cs010@sapthagiri.edu.in', schoolId: 'SOET', departmentId: 'CSE', semester: 5, section: 'A', labBatch: 'B2', currentAttendanceRate: 89.1 },
  { usn: '1SN24CS011', name: 'Manoj Kumar V', email: 'manoj.1sn24cs011@sapthagiri.edu.in', schoolId: 'SOET', departmentId: 'CSE', semester: 5, section: 'A', labBatch: 'B2', currentAttendanceRate: 58.0 }, // Detained
  { usn: '1SN24CS012', name: 'Nikhil R', email: 'nikhil.1sn24cs012@sapthagiri.edu.in', schoolId: 'SOET', departmentId: 'CSE', semester: 5, section: 'A', labBatch: 'B2', currentAttendanceRate: 78.5 },
];

export const MOCK_TIMETABLE: TimetableSlot[] = [
  {
    id: 'SLOT_001',
    subjectCode: '22CS501',
    subjectName: 'Computer Networks & Protocols',
    courseType: 'THEORY',
    facultyId: 'FAC_CS_108',
    facultyName: 'Dr. Ramesh Kumar',
    roomNo: 'SOET-L302',
    periodNumber: 1,
    periodWeight: 1,
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    dayOfWeek: 'Monday',
    section: 'A',
    batch: 'ALL',
  },
  {
    id: 'SLOT_002',
    subjectCode: '22CSL506',
    subjectName: 'Advanced Web & Cloud Lab',
    courseType: 'LAB',
    facultyId: 'FAC_CS_108',
    facultyName: 'Dr. Ramesh Kumar',
    roomNo: 'Turing Computing Lab - 2',
    periodNumber: 2,
    periodWeight: 2, // 2-Hour Lab Block = 2 Periods Count
    startTime: '10:15 AM',
    endTime: '12:15 PM',
    dayOfWeek: 'Monday',
    section: 'A',
    batch: 'B1',
  },
  {
    id: 'SLOT_003',
    subjectCode: '22CS503',
    subjectName: 'Design & Analysis of Algorithms',
    courseType: 'THEORY',
    facultyId: 'FAC_CS_108',
    facultyName: 'Dr. Ramesh Kumar',
    roomNo: 'SOET-L302',
    periodNumber: 4,
    periodWeight: 1,
    startTime: '01:30 PM',
    endTime: '02:30 PM',
    dayOfWeek: 'Monday',
    section: 'A',
    batch: 'ALL',
  },
  {
    id: 'SLOT_004',
    subjectCode: 'MBBS302',
    subjectName: 'Clinical Surgery & Hospital Posting',
    courseType: 'CLINICAL_POSTING',
    facultyId: 'FAC_MED_204',
    facultyName: 'Dr. Sunita Rao, MS',
    roomNo: 'Sapthagiri Hospital Ward 4-B',
    periodNumber: 5,
    periodWeight: 3, // 3-Hour Clinical Block
    startTime: '02:30 PM',
    endTime: '05:30 PM',
    dayOfWeek: 'Monday',
    section: 'A',
    batch: 'CLINICAL_A',
  },
];

// CBCS Subject Attendance for Student 1SN24CS001
export const MOCK_STUDENT_ATTENDANCE: AttendanceSummary[] = [
  {
    subjectCode: '22CS501',
    subjectName: 'Computer Networks & Protocols',
    totalConducted: 42,
    totalAttended: 38,
    percentage: 90.4,
    statusCategory: 'ELIGIBLE',
    classesNeededTo75: 0,
    safeBunksRemaining: 8,
  },
  {
    subjectCode: '22CS502',
    subjectName: 'Operating Systems & Virtualization',
    totalConducted: 40,
    totalAttended: 31,
    percentage: 77.5,
    statusCategory: 'ELIGIBLE',
    classesNeededTo75: 0,
    safeBunksRemaining: 1,
  },
  {
    subjectCode: '22CSL506',
    subjectName: 'Advanced Web & Cloud Lab (B1)',
    totalConducted: 20, // 10 labs x 2 periods
    totalAttended: 14,
    percentage: 70.0,
    statusCategory: 'CONDONATION', // 65-74% requires condonation
    classesNeededTo75: 4,
    safeBunksRemaining: 0,
  },
  {
    subjectCode: '22CSOE01',
    subjectName: 'Open Elective: Renewable Energy Systems',
    totalConducted: 32,
    totalAttended: 19,
    percentage: 59.3,
    statusCategory: 'DETAINED', // < 65% Detained
    classesNeededTo75: 19,
    safeBunksRemaining: 0,
  },
];

export const MOCK_OD_REQUESTS: ODLeaveRequest[] = [
  {
    id: 'OD_2026_01',
    usn: '1SN24CS003',
    studentName: 'Bhuvan Gowda',
    type: 'OD_ISRO_WORKSHOP',
    eventDescription: 'National Space Science Hackathon at ISRO HQ, Bengaluru',
    dateFrom: '2026-11-24',
    dateTo: '2026-11-26',
    approvalStatus: 'PENDING',
    appliedAt: '2026-11-21 14:30',
  },
  {
    id: 'OD_2026_02',
    usn: '1SN24CS005',
    studentName: 'Darshan Patel',
    type: 'MEDICAL_LEAVE',
    eventDescription: 'Viral Fever & Hospitalization at Sapthagiri Hospital',
    dateFrom: '2026-11-15',
    dateTo: '2026-11-19',
    approvalStatus: 'HOD_APPROVED',
    appliedAt: '2026-11-14 09:00',
  },
];

export const MOCK_PUNCH_LOGS: FacultyPunchLog[] = [
  {
    id: 'PUNCH_901',
    facultyId: 'FAC_CS_108',
    facultyName: 'Dr. Ramesh Kumar',
    timestamp: '2026-11-21 08:48 AM',
    type: 'PUNCH_IN',
    latitude: 13.0646,
    longitude: 77.5029,
    distanceFromCampusMeters: 24,
    isWithinGeoFence: true,
    campusVerificationStatus: 'VERIFIED_CAMPUS_WIFI_GPS',
  },
];
