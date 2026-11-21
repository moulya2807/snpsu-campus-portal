import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { MOCK_STUDENTS } from '../data/mockData';

export const DeanShortageScreen: React.FC = () => {
  const [filterThreshold, setFilterThreshold] = useState<'ALL' | 'CONDONATION' | 'DETAINED'>('ALL');

  const filteredShortageList = useMemo(() => {
    return MOCK_STUDENTS.filter((s) => {
      if (filterThreshold === 'CONDONATION') {
        return s.currentAttendanceRate >= 65 && s.currentAttendanceRate < 75;
      }
      if (filterThreshold === 'DETAINED') {
        return s.currentAttendanceRate < 65;
      }
      return s.currentAttendanceRate < 75; // All shortage (<75%)
    });
  }, [filterThreshold]);

  const handleExportCSV = () => {
    Alert.alert(
      'UGC/AICTE Shortage Report Exported',
      `Generated: SNPSU_CSE_Sem5_Attendance_Shortage_List.csv\n\nTotal Flagged: ${filteredShortageList.length} Students.\nNotification queued to Office of Dean (Academic Affairs) & Registrar.`,
      [{ text: 'Download / Share' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Overview Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderLeftColor: colors.presentGreen }]}>
          <Text style={styles.statNumber}>10</Text>
          <Text style={styles.statTitle}>Eligible (&gt;=75%)</Text>
          <Text style={styles.statSub}>Full SEE Clearance</Text>
        </View>

        <View style={[styles.statCard, { borderLeftColor: colors.condonationAmber }]}>
          <Text style={[styles.statNumber, { color: colors.condonationAmber }]}>2</Text>
          <Text style={styles.statTitle}>Condonation (65-74%)</Text>
          <Text style={styles.statSub}>Medical / OD Req.</Text>
        </View>

        <View style={[styles.statCard, { borderLeftColor: colors.detainedRed }]}>
          <Text style={[styles.statNumber, { color: colors.detainedRed }]}>2</Text>
          <Text style={styles.statTitle}>Detained (&lt;65%)</Text>
          <Text style={styles.statSub}>Ineligible for Exams</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterPills}>
        <TouchableOpacity
          style={[styles.pill, filterThreshold === 'ALL' && styles.pillActive]}
          onPress={() => setFilterThreshold('ALL')}
        >
          <Text style={[styles.pillText, filterThreshold === 'ALL' && styles.pillTextActive]}>
            All Shortage (&lt;75%)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pill, filterThreshold === 'CONDONATION' && styles.pillActive]}
          onPress={() => setFilterThreshold('CONDONATION')}
        >
          <Text style={[styles.pillText, filterThreshold === 'CONDONATION' && styles.pillTextActive]}>
            Condonation (65-74%)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pill, filterThreshold === 'DETAINED' && styles.pillActive]}
          onPress={() => setFilterThreshold('DETAINED')}
        >
          <Text style={[styles.pillText, filterThreshold === 'DETAINED' && styles.pillTextActive]}>
            Detained (&lt;65%)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Shortage List Roster */}
      <View style={styles.rosterCard}>
        <View style={styles.rosterHeader}>
          <View>
            <Text style={styles.rosterTitle}>
              Official SNPSU Semester Exam Eligibility Roster
            </Text>
            <Text style={styles.rosterSubtitle}>
              School of Engineering & Technology • CSE Dept (Sem 5)
            </Text>
          </View>

          <TouchableOpacity style={styles.exportBtn} onPress={handleExportCSV}>
            <Text style={styles.exportBtnText}>📄 Export CSV</Text>
          </TouchableOpacity>
        </View>

        {filteredShortageList.map((student) => {
          const isDetained = student.currentAttendanceRate < 65;
          return (
            <View key={student.usn} style={styles.studentItem}>
              <View style={styles.studentCol}>
                <Text style={styles.usnCode}>{student.usn}</Text>
                <Text style={styles.nameText}>{student.name}</Text>
                <Text style={styles.metaText}>Batch: {student.labBatch} • Section A</Text>
              </View>

              <View style={styles.statusCol}>
                <Text style={[
                  styles.rateText,
                  isDetained ? { color: colors.detainedRed } : { color: colors.condonationAmber },
                ]}>
                  {student.currentAttendanceRate}%
                </Text>
                <View style={[
                  styles.statusBadge,
                  isDetained ? styles.badgeDetained : styles.badgeCondonation,
                ]}>
                  <Text style={[
                    styles.statusBadgeText,
                    isDetained ? { color: '#991B1B' } : { color: '#92400E' },
                  ]}>
                    {isDetained ? 'DETAINED' : 'CONDONATION'}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* AICTE / UGC Statutory Regulatory Note */}
      <View style={styles.regulatoryNote}>
        <Text style={styles.regulatoryTitle}>Statutory Academic Compliance Note</Text>
        <Text style={styles.regulatoryBody}>
          In accordance with Sapthagiri NPS University Academic Regulations & UGC/AICTE minimum norms, a minimum of 75% attendance in each registered theory and laboratory course is mandatory to qualify for the Semester End Examinations (SEE). Condonation up to 10% is solely at the discretion of the Academic Council based on substantiated medical grounds or university-sponsored OD duties.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  statTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  statSub: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },
  filterPills: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  rosterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 16,
  },
  rosterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: 10,
  },
  rosterTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  rosterSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  exportBtn: {
    backgroundColor: colors.accentGoldLight,
    borderWidth: 1,
    borderColor: colors.accentGold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  exportBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  studentCol: {
    flex: 1,
  },
  usnCode: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: 'monospace',
  },
  nameText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: 1,
  },
  metaText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  statusCol: {
    alignItems: 'flex-end',
  },
  rateText: {
    fontSize: 15,
    fontWeight: '800',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  badgeDetained: {
    backgroundColor: colors.detainedRedLight,
  },
  badgeCondonation: {
    backgroundColor: colors.condonationAmberLight,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  regulatoryNote: {
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  regulatoryTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  regulatoryBody: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 15,
  },
});
