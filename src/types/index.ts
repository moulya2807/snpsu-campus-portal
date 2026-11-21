// SNPSU University Academic Domain Model & Database Types

export type SchoolType = 
  | 'SOET'     // School of Engineering & Technology
  | 'SIMS_RC'  // School of Medicine & Allied Health Sciences (Sapthagiri Hospital)
  | 'SOMS'     // School of Management Studies
  | 'SOAS';    // School of Applied Sciences

export type ProgramType = 'B.Tech' | 'MBBS' | 'BCA' | 'MBA' | 'B.Sc' | 'Allied_Health';

export type CourseType = 'THEORY' | 'LAB' | 'CLINICAL_POSTING' | 'ELECTIVE_CBCS' | 'VALUE_ADDED';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'OD';

export interface Student {
  usn: string; // e.g. "1SN24CS001"
  name: string;
  email: string;
  schoolId: SchoolType;
  departmentId: string; // e.g. "CSE", "AI_DS", "MBBS_SURG"
  semester: number;
  section: string; // "A", "B", "C"
  labBatch?: 'B1' | 'B2' | 'B3' | 'CLINICAL_A' | 'CLINICAL_B';
  avatarUrl?: string;
  currentAttendanceRate: number; // e.g. 78.4
}

export interface SubjectCBCS {
  code: string; // e.g. "22CS501", "MBBS301"
  name: string;
  type: CourseType;
  credits: number;
  periodsPerWeek: number;
  departmentId: string;
  semester: number;
  isElective: boolean;
}

export interface TimetableSlot {
  id: string;
  subjectCode: string;
  subjectName: string;
  courseType: CourseType;
  facultyId: string;
  facultyName: string;
  roomNo: string;
  periodNumber: number; // Period 1, 2, 3...
  periodWeight: number; // 1 for regular lecture, 2 for 2-hr lab, 3 for 3-hr clinical ward
  startTime: string; // "09:00 AM"
  endTime: string;   // "11:00 AM"
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  section: string;
  batch?: 'ALL' | 'B1' | 'B2' | 'B3' | 'CLINICAL_A' | 'CLINICAL_B';
}

export interface AttendanceRecord {
  id: string;
  slotId: string;
  date: string; // "YYYY-MM-DD"
  usn: string;
  studentName: string;
  status: AttendanceStatus;
  periodWeight: number; // 1, 2, or 3 periods
  markedBy: string; // Faculty ID
  markedAt: string; // ISO Timestamp
  editWindowExpiry: string; // ISO Timestamp (24h lock)
  synced: boolean; // For offline-first sync engine
  notes?: string;
}

export interface AttendanceSummary {
  subjectCode: string;
  subjectName: string;
  totalConducted: number;
  totalAttended: number;
  percentage: number;
  statusCategory: 'ELIGIBLE' | 'CONDONATION' | 'DETAINED';
  classesNeededTo75: number;
  safeBunksRemaining: number;
}

export interface ODLeaveRequest {
  id: string;
  usn: string;
  studentName: string;
  type: 'OD_SPORTS' | 'OD_NCC' | 'OD_ISRO_WORKSHOP' | 'MEDICAL_LEAVE' | 'GATE_PASS';
  eventDescription: string;
  dateFrom: string;
  dateTo: string;
  documentUrl?: string;
  approvalStatus: 'PENDING' | 'HOD_APPROVED' | 'REJECTED';
  appliedAt: string;
}

export interface FacultyPunchLog {
  id: string;
  facultyId: string;
  facultyName: string;
  timestamp: string;
  type: 'PUNCH_IN' | 'PUNCH_OUT';
  latitude: number;
  longitude: number;
  distanceFromCampusMeters: number;
  isWithinGeoFence: boolean;
  campusVerificationStatus: 'VERIFIED_CAMPUS_WIFI_GPS' | 'OUTSIDE_PERIMETER';
}
