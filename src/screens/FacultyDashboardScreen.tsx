import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { MOCK_FACULTY, MOCK_TIMETABLE, MOCK_OD_REQUESTS } from '../data/mockData';
import { GeoFenceCard } from '../components/GeoFenceCard';

interface FacultyDashboardScreenProps {
  onNavigateToMarking: (slotId: string) => void;
}

export const FacultyDashboardScreen: React.FC<FacultyDashboardScreenProps> = ({
  onNavigateToMarking,
}) => {
  const [requests, setRequests] = useState(MOCK_OD_REQUESTS);

  const handleApproveOD = (id: string, name: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approvalStatus: 'HOD_APPROVED' } : r))
    );
    Alert.alert('OD Approved', `Approved On-Duty request for ${name}. Attendance credit flagged for exam condonation.`);
  };

  const handleHelpdeskTicket = () => {
    Alert.alert(
      'Raise Campus Facility / IT Ticket',
      'Select issue category:\n• Projector / Smart Board in SOET-L302\n• Campus Wi-Fi / LAN in Basement Lab\n• Biomass / Lab Chemical Request',
      [{ text: 'Submit Request', onPress: () => Alert.alert('Ticket #SNPSU-IT-482 raised successfully.') }, { text: 'Cancel', style: 'cancel' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Faculty Profile Card */}
      <View style={styles.facultyHeaderCard}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>RK</Text>
          </View>
          <View style={styles.facultyDetails}>
            <Text style={styles.facultyName}>{MOCK_FACULTY.name}</Text>
            <Text style={styles.designation}>{MOCK_FACULTY.designation}</Text>
            <Text style={styles.schoolText}>{MOCK_FACULTY.school}</Text>
            <Text style={styles.emailText}>{MOCK_FACULTY.email}</Text>
          </View>
        </View>

        {/* Quick Helpdesk Pill */}
        <TouchableOpacity style={styles.helpdeskBtn} onPress={handleHelpdeskTicket}>
          <Text style={styles.helpdeskBtnText}>🛠️ Raise Campus IT / Facility Ticket</Text>
        </TouchableOpacity>
      </View>

      {/* Geofence Smart Punch-In */}
      <GeoFenceCard />

      {/* Today's Timetable Roster */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Academic Timetable</Text>
          <Text style={styles.sectionDate}>Monday • 4 Sessions</Text>
        </View>

        {MOCK_TIMETABLE.map((slot) => (
          <View key={slot.id} style={styles.timetableCard}>
            <View style={styles.timeBadge}>
              <Text style={styles.timeStart}>{slot.startTime}</Text>
              <Text style={styles.timeEnd}>{slot.endTime}</Text>
              <View style={styles.weightBadge}>
                <Text style={styles.weightBadgeText}>{slot.periodWeight} Hr / Period</Text>
              </View>
            </View>

            <View style={styles.slotBody}>
              <View style={styles.slotTop}>
                <View style={styles.codePill}>
                  <Text style={styles.codePillText}>{slot.subjectCode}</Text>
                </View>
                <Text style={styles.roomText}>{slot.roomNo}</Text>
              </View>
              <Text style={styles.subjectName}>{slot.subjectName}</Text>
              <Text style={styles.metaText}>
                Sec {slot.section} • {slot.batch === 'ALL' ? 'Entire Class' : `Batch ${slot.batch}`}
              </Text>

              <TouchableOpacity
                style={styles.markBtn}
                onPress={() => onNavigateToMarking(slot.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.markBtnText}>Mark Attendance →</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Student OD / Medical Approvals */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Student OD & Gate Pass Requests</Text>
          <Text style={styles.pendingBadge}>{requests.filter(r => r.approvalStatus === 'PENDING').length} Pending</Text>
        </View>

        {requests.map((req) => (
          <View key={req.id} style={styles.odCard}>
            <View style={styles.odHeader}>
              <View>
                <Text style={styles.odStudentName}>{req.studentName}</Text>
                <Text style={styles.odUsn}>{req.usn}</Text>
              </View>
              <View style={[
                styles.odStatusTag,
                req.approvalStatus === 'HOD_APPROVED' ? styles.statusApproved : styles.statusPending,
              ]}>
                <Text style={styles.odStatusText}>{req.approvalStatus}</Text>
              </View>
            </View>

            <Text style={styles.odEventTitle}>{req.type.replace(/_/g, ' ')}</Text>
            <Text style={styles.odDesc}>{req.eventDescription}</Text>
            <Text style={styles.odDateRange}>Duration: {req.dateFrom} to {req.dateTo}</Text>

            {req.approvalStatus === 'PENDING' && (
              <View style={styles.odActionRow}>
                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={() => handleApproveOD(req.id, req.studentName)}
                >
                  <Text style={styles.approveBtnText}>Approve OD Waiver</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  facultyHeaderCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.accentGold,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  facultyDetails: {
    flex: 1,
  },
  facultyName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  designation: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  schoolText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  emailText: {
    fontSize: 10,
    color: colors.accentMaroon,
    fontWeight: '600',
    marginTop: 2,
  },
  helpdeskBtn: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  helpdeskBtnText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  sectionDate: {
    fontSize: 12,
    color: colors.textMuted,
  },
  pendingBadge: {
    backgroundColor: colors.condonationAmberLight,
    color: '#92400E',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timetableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  timeBadge: {
    width: 90,
    backgroundColor: colors.background,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  timeStart: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  timeEnd: {
    fontSize: 10,
    color: colors.textMuted,
  },
  weightBadge: {
    marginTop: 4,
    backgroundColor: colors.badgeBg,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  weightBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  slotBody: {
    flex: 1,
    padding: 12,
  },
  slotTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  codePill: {
    backgroundColor: colors.accentMaroon,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codePillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  roomText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  subjectName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: 4,
  },
  metaText: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 8,
  },
  markBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  markBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  odCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  odHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  odStudentName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  odUsn: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'monospace',
  },
  odStatusTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusPending: {
    backgroundColor: colors.condonationAmberLight,
  },
  statusApproved: {
    backgroundColor: colors.presentGreenLight,
  },
  odStatusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  odEventTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accentMaroon,
  },
  odDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginVertical: 4,
  },
  odDateRange: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 8,
  },
  odActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  approveBtn: {
    backgroundColor: colors.presentGreen,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
