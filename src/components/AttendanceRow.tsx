import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Student, AttendanceStatus } from '../types';
import { colors } from '../theme/colors';

interface AttendanceRowProps {
  student: Student;
  status: AttendanceStatus;
  onStatusChange: (newStatus: AttendanceStatus) => void;
  index: number;
}

export const AttendanceRow: React.FC<AttendanceRowProps> = ({
  student,
  status,
  onStatusChange,
  index,
}) => {
  // Highlight last 3 digits of USN (e.g., "1SN24CS" + "001")
  const usnPrefix = student.usn.slice(0, -3);
  const usnSuffix = student.usn.slice(-3);

  return (
    <View style={[styles.container, index % 2 === 1 && styles.alternateBg]}>
      {/* Student Details Column */}
      <View style={styles.infoCol}>
        <View style={styles.usnRow}>
          <Text style={styles.usnPrefix}>{usnPrefix}</Text>
          <Text style={styles.usnHighlight}>{usnSuffix}</Text>
          {student.labBatch && (
            <View style={styles.batchTag}>
              <Text style={styles.batchText}>{student.labBatch}</Text>
            </View>
          )}
        </View>
        <Text style={styles.studentName} numberOfLines={1}>
          {student.name}
        </Text>
      </View>

      {/* 1-Tap Attendance Toggle Buttons */}
      <View style={styles.toggleGroup}>
        {/* Present (P) */}
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            status === 'PRESENT' ? styles.presentActive : styles.btnInactive,
          ]}
          onPress={() => onStatusChange('PRESENT')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              status === 'PRESENT' ? styles.textActive : styles.textInactive,
            ]}
          >
            P
          </Text>
        </TouchableOpacity>

        {/* Absent (A) */}
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            status === 'ABSENT' ? styles.absentActive : styles.btnInactive,
          ]}
          onPress={() => onStatusChange('ABSENT')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              status === 'ABSENT' ? styles.textActive : styles.textInactive,
            ]}
          >
            A
          </Text>
        </TouchableOpacity>

        {/* Late (L) */}
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            status === 'LATE' ? styles.lateActive : styles.btnInactive,
          ]}
          onPress={() => onStatusChange('LATE')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              status === 'LATE' ? styles.textActive : styles.textInactive,
            ]}
          >
            L
          </Text>
        </TouchableOpacity>

        {/* On-Duty (OD) */}
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            status === 'OD' ? styles.odActive : styles.btnInactive,
          ]}
          onPress={() => onStatusChange('OD')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              status === 'OD' ? styles.textActive : styles.textInactive,
            ]}
          >
            OD
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: '#FFFFFF',
  },
  alternateBg: {
    backgroundColor: '#FAFCFF',
  },
  infoCol: {
    flex: 1,
    paddingRight: 10,
  },
  usnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usnPrefix: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  usnHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    fontFamily: 'monospace',
    backgroundColor: colors.accentGoldLight,
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  batchTag: {
    backgroundColor: colors.badgeBg,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  batchText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  studentName: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
    marginTop: 2,
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  toggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  btnInactive: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  presentActive: {
    backgroundColor: colors.presentGreen,
    borderColor: '#059669',
  },
  absentActive: {
    backgroundColor: colors.detainedRed,
    borderColor: '#DC2626',
  },
  lateActive: {
    backgroundColor: colors.lateYellow,
    borderColor: '#CA8A04',
  },
  odActive: {
    backgroundColor: colors.onDutyBlue,
    borderColor: '#2563EB',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '800',
  },
  textActive: {
    color: '#FFFFFF',
  },
  textInactive: {
    color: colors.textSecondary,
  },
});
