import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme/colors';
import { Student, AttendanceStatus, TimetableSlot } from '../types';
import { MOCK_STUDENTS, MOCK_TIMETABLE } from '../data/mockData';
import { AttendanceRow } from '../components/AttendanceRow';
import { OfflineSyncService } from '../services/offlineSyncService';

interface AttendanceStateMap {
  [usn: string]: AttendanceStatus;
}

export const FacultyAttendanceScreen: React.FC = () => {
  // Current Active Slot (Defaults to Computer Networks Lab: 2-hour duration block)
  const [selectedSlot, setSelectedSlot] = useState<TimetableSlot>(MOCK_TIMETABLE[1]);
  
  // Multi-Period Weight Selector: 1 (Theory), 2 (Lab Session), 3 (Clinical Hospital Posting)
  const [periodWeight, setPeriodWeight] = useState<number>(selectedSlot.periodWeight);
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('ALL');
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  
  // Attendance state map keyed by Student USN
  const [attendanceMap, setAttendanceMap] = useState<AttendanceStateMap>(() => {
    const initialMap: AttendanceStateMap = {};
    MOCK_STUDENTS.forEach((student) => {
      initialMap[student.usn] = 'PRESENT'; // Default to Present for high classroom speed
    });
    return initialMap;
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filter students based on Batch, Search Query (supports last 3 digits or full USN), and Sort
  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS
      .filter((student) => {
        // Batch filter
        if (selectedBatch !== 'ALL' && student.labBatch !== selectedBatch) {
          return false;
        }
        // Search filter: Matches last 3 digits or name or USN
        if (searchQuery.trim().length > 0) {
          const q = searchQuery.toLowerCase().trim();
          const matchesUSN = student.usn.toLowerCase().includes(q);
          const matchesName = student.name.toLowerCase().includes(q);
          const matchesLast3 = student.usn.slice(-3).includes(q);
          return matchesUSN || matchesName || matchesLast3;
        }
        return true;
      })
      .sort((a, b) => {
        return sortAscending
          ? a.usn.localeCompare(b.usn)
          : b.usn.localeCompare(a.usn);
      });
  }, [selectedBatch, searchQuery, sortAscending]);

  // Aggregate Counters
  const stats = useMemo(() => {
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let odCount = 0;

    filteredStudents.forEach((student) => {
      const status = attendanceMap[student.usn] || 'PRESENT';
      if (status === 'PRESENT') presentCount++;
      else if (status === 'ABSENT') absentCount++;
      else if (status === 'LATE') lateCount++;
      else if (status === 'OD') odCount++;
    });

    const total = filteredStudents.length;
    const percentage = total > 0 ? Math.round(((presentCount + odCount) / total) * 100) : 0;

    return { total, presentCount, absentCount, lateCount, odCount, percentage };
  }, [filteredStudents, attendanceMap]);

  // Handler for individual status toggle
  const handleStatusChange = (usn: string, newStatus: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [usn]: newStatus,
    }));
  };

  // Bulk action: Mark All Present
  const handleMarkAllPresent = () => {
    setAttendanceMap((prev) => {
      const updated = { ...prev };
      filteredStudents.forEach((s) => {
        updated[s.usn] = 'PRESENT';
      });
      return updated;
    });
  };

  // Save / Submit Attendance with Offline-First support
  const handleSubmitAttendance = async () => {
    setIsSubmitting(true);
    const today = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();
    
    // Construct database records
    const records = filteredStudents.map((s) => ({
      id: `${selectedSlot.id}_${s.usn}_${today}`,
      slotId: selectedSlot.id,
      date: today,
      usn: s.usn,
      studentName: s.name,
      status: attendanceMap[s.usn] || 'PRESENT',
      periodWeight: periodWeight,
      markedBy: selectedSlot.facultyId,
      markedAt: nowIso,
      editWindowExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      synced: OfflineSyncService.getIsOnline(),
    }));

    OfflineSyncService.enqueueAttendance(records);

    setTimeout(() => {
      setIsSubmitting(false);
      const isOnline = OfflineSyncService.getIsOnline();
      Alert.alert(
        isOnline ? 'Attendance Submitted Successfully' : 'Saved Locally (Offline Queue)',
        `Recorded ${records.length} students for ${selectedSlot.subjectCode} (${periodWeight} Period Weight).\n\n` +
        (isOnline 
          ? 'Data synced with SNPSU Central Academic ERP.' 
          : 'Network unavailable in laboratory/ward. Records queued for auto-sync upon campus Wi-Fi reconnection.'),
        [{ text: 'Done' }]
      );
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Class & Subject Selector Header */}
      <View style={styles.slotBanner}>
        <View style={styles.slotHeaderRow}>
          <View style={styles.courseTag}>
            <Text style={styles.courseTagText}>{selectedSlot.subjectCode}</Text>
          </View>
          <View style={styles.roomTag}>
            <Text style={styles.roomTagText}>{selectedSlot.roomNo}</Text>
          </View>
          <Text style={styles.slotTimeText}>{selectedSlot.startTime} - {selectedSlot.endTime}</Text>
        </View>

        <Text style={styles.subjectTitle} numberOfLines={1}>
          {selectedSlot.subjectName}
        </Text>
        <Text style={styles.sectionSubtitle}>
          Sem 5 • Section {selectedSlot.section} • {selectedSlot.courseType}
        </Text>

        {/* Multi-Period Weight Duration Selector */}
        <View style={styles.weightSelectorContainer}>
          <Text style={styles.weightLabel}>Period Weight (Credits):</Text>
          <View style={styles.weightPills}>
            <TouchableOpacity
              style={[styles.weightPill, periodWeight === 1 && styles.weightPillActive]}
              onPress={() => setPeriodWeight(1)}
            >
              <Text style={[styles.weightPillText, periodWeight === 1 && styles.weightTextActive]}>
                1 Period (1h Lecture)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.weightPill, periodWeight === 2 && styles.weightPillActive]}
              onPress={() => setPeriodWeight(2)}
            >
              <Text style={[styles.weightPillText, periodWeight === 2 && styles.weightTextActive]}>
                2 Periods (2h Lab)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.weightPill, periodWeight === 3 && styles.weightPillActive]}
              onPress={() => setPeriodWeight(3)}
            >
              <Text style={[styles.weightPillText, periodWeight === 3 && styles.weightTextActive]}>
                3 Periods (Clinical)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Roster Controls: Batch Filter, Search by USN Last 3 Digits, Sort & Bulk Action */}
      <View style={styles.controlsBar}>
        {/* USN Search Input */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by USN last 3 digits (e.g. 003) or name..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            keyboardType="default"
            autoCapitalize="characters"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterRow}>
          {/* Batch Selector */}
          <View style={styles.batchFilters}>
            {['ALL', 'B1', 'B2'].map((batch) => (
              <TouchableOpacity
                key={batch}
                style={[styles.batchBtn, selectedBatch === batch && styles.batchBtnActive]}
                onPress={() => setSelectedBatch(batch)}
              >
                <Text style={[styles.batchBtnText, selectedBatch === batch && styles.batchBtnTextActive]}>
                  {batch === 'ALL' ? 'All Batches' : `Batch ${batch}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.sortBtn}
              onPress={() => setSortAscending(!sortAscending)}
            >
              <Text style={styles.sortBtnText}>USN {sortAscending ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bulkBtn} onPress={handleMarkAllPresent}>
              <Text style={styles.bulkBtnText}>Mark All P</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Live Classroom Attendance Summary Gauge */}
      <View style={styles.statsSummaryBar}>
        <View style={styles.statItem}>
          <Text style={styles.statCount}>{stats.total}</Text>
          <Text style={styles.statLabel}>Enrolled</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statCount, { color: colors.presentGreen }]}>{stats.presentCount}</Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statCount, { color: colors.detainedRed }]}>{stats.absentCount}</Text>
          <Text style={styles.statLabel}>Absent</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statCount, { color: colors.lateYellow }]}>{stats.lateCount}</Text>
          <Text style={styles.statLabel}>Late</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statCount, { color: colors.onDutyBlue }]}>{stats.odCount}</Text>
          <Text style={styles.statLabel}>OD</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statCount, { color: stats.percentage >= 75 ? colors.presentGreen : colors.condonationAmber }]}>
            {stats.percentage}%
          </Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </View>
      </View>

      {/* Student USN Roster List */}
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.usn}
        renderItem={({ item, index }) => (
          <AttendanceRow
            student={item}
            status={attendanceMap[item.usn] || 'PRESENT'}
            onStatusChange={(newStatus) => handleStatusChange(item.usn, newStatus)}
            index={index}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No students found matching current filter.</Text>
          </View>
        }
      />

      {/* Bottom Sticky Action Footer */}
      <View style={styles.footerContainer}>
        <View style={styles.auditInfo}>
          <Text style={styles.auditText}>
            🔒 24-hr faculty edit lock applies after submission.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmitAttendance}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Locking Attendance...' : `Submit Attendance (${stats.total} Students)`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slotBanner: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  slotHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  courseTag: {
    backgroundColor: colors.accentMaroon,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  courseTagText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  roomTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  roomTagText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
  },
  slotTimeText: {
    color: colors.accentGold,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 'auto',
  },
  subjectTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 2,
  },
  sectionSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  weightSelectorContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: 8,
    borderRadius: 8,
  },
  weightLabel: {
    color: colors.accentGold,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  weightPills: {
    flexDirection: 'row',
    gap: 6,
  },
  weightPill: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  weightPillActive: {
    backgroundColor: colors.accentGold,
    borderColor: '#FFFFFF',
  },
  weightPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  weightTextActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  controlsBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: 38,
    fontSize: 13,
    color: colors.textPrimary,
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batchFilters: {
    flexDirection: 'row',
    gap: 6,
  },
  batchBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  batchBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  batchBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  batchBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sortBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  bulkBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: colors.presentGreenLight,
    borderWidth: 1,
    borderColor: colors.presentGreen,
  },
  bulkBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  statsSummaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 22,
    backgroundColor: colors.border,
  },
  statCount: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 8,
  },
  auditInfo: {
    marginBottom: 8,
    alignItems: 'center',
  },
  auditText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
