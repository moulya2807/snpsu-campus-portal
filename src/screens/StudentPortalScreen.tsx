import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { MOCK_STUDENT_ATTENDANCE, MOCK_TIMETABLE } from '../data/mockData';

export const StudentPortalScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ATTENDANCE' | 'TIMETABLE' | 'APPLY_OD'>('ATTENDANCE');
  
  // OD Form State
  const [odType, setOdType] = useState<string>('OD_ISRO_WORKSHOP');
  const [eventDesc, setEventDesc] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [hasUploadedDoc, setHasUploadedDoc] = useState<boolean>(false);

  const handleApplyOD = () => {
    if (!eventDesc.trim()) {
      Alert.alert('Required Field', 'Please provide event or medical justification details.');
      return;
    }
    Alert.alert(
      'Application Submitted',
      `Your ${odType} request has been routed to HOD (Computer Science) & Faculty Mentor for digital endorsement.\n\nNotification sent to registered parent mobile.`,
      [{ text: 'OK', onPress: () => {
        setEventDesc('');
        setDateRange('');
        setHasUploadedDoc(false);
      }}]
    );
  };

  const handleDocumentPick = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setHasUploadedDoc(true);
      Alert.alert('File Attached', 'Sanction_Letter_ISRO_Hackathon.pdf (420 KB) attached successfully.');
    }, 700);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Student Identity Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>AS</Text>
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.studentName}>Aarav Sharma</Text>
            <View style={styles.usnBadge}>
              <Text style={styles.usnText}>USN: 1SN24CS001</Text>
            </View>
            <Text style={styles.academicMeta}>
              B.Tech CSE • Sem 5 • Sec A • Batch B1
            </Text>
            <Text style={styles.schoolMeta}>School of Engineering & Technology (SOET)</Text>
          </View>
        </View>

        {/* Global Compliance Status Banner */}
        <View style={styles.complianceBanner}>
          <View style={styles.complianceLeft}>
            <Text style={styles.complianceTitle}>Overall Attendance</Text>
            <Text style={styles.compliancePercent}>78.4%</Text>
          </View>
          <View style={styles.eligibilityBadge}>
            <Text style={styles.eligibilityText}>Exam Eligible (&gt;=75%)</Text>
          </View>
        </View>
      </View>

      {/* Navigation Sub-Tabs */}
      <View style={styles.tabNav}>
        <TouchableOpacity
          style={[styles.tabNavItem, activeTab === 'ATTENDANCE' && styles.tabActive]}
          onPress={() => setActiveTab('ATTENDANCE')}
        >
          <Text style={[styles.tabNavText, activeTab === 'ATTENDANCE' && styles.tabTextActive]}>
            CBCS Attendance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabNavItem, activeTab === 'TIMETABLE' && styles.tabActive]}
          onPress={() => setActiveTab('TIMETABLE')}
        >
          <Text style={[styles.tabNavText, activeTab === 'TIMETABLE' && styles.tabTextActive]}>
            Daily Timetable
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabNavItem, activeTab === 'APPLY_OD' && styles.tabActive]}
          onPress={() => setActiveTab('APPLY_OD')}
        >
          <Text style={[styles.tabNavText, activeTab === 'APPLY_OD' && styles.tabTextActive]}>
            OD / Gate Pass
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab 1: Subject-Wise Attendance & Bunk / Needed Calculator */}
      {activeTab === 'ATTENDANCE' && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionHeading}>Current Semester Subject-Wise Status</Text>

          {MOCK_STUDENT_ATTENDANCE.map((sub) => {
            const isEligible = sub.percentage >= 75;
            const isCondonation = sub.percentage >= 65 && sub.percentage < 75;
            const isDetained = sub.percentage < 65;

            return (
              <View key={sub.subjectCode} style={styles.subjectCard}>
                <View style={styles.subTopRow}>
                  <View style={styles.codeTag}>
                    <Text style={styles.codeTagText}>{sub.subjectCode}</Text>
                  </View>
                  <Text style={[
                    styles.subPercentage,
                    isEligible && { color: colors.presentGreen },
                    isCondonation && { color: colors.condonationAmber },
                    isDetained && { color: colors.detainedRed },
                  ]}>
                    {sub.percentage}%
                  </Text>
                </View>

                <Text style={styles.subName}>{sub.subjectName}</Text>
                <Text style={styles.conductedText}>
                  Attended {sub.totalAttended} of {sub.totalConducted} classes
                </Text>

                {/* Visual Progress Bar */}
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${Math.min(sub.percentage, 100)}%` },
                      isEligible && { backgroundColor: colors.presentGreen },
                      isCondonation && { backgroundColor: colors.condonationAmber },
                      isDetained && { backgroundColor: colors.detainedRed },
                    ]}
                  />
                  {/* 75% Threshold Marker Line */}
                  <View style={styles.thresholdMarker} />
                </View>

                {/* Calculator Advice Box */}
                <View style={[
                  styles.calcAdviceBox,
                  isEligible ? styles.adviceSuccess : isCondonation ? styles.adviceWarning : styles.adviceDanger,
                ]}>
                  {isEligible ? (
                    <Text style={styles.adviceText}>
                      🎉 <Text style={styles.boldText}>{sub.safeBunksRemaining} Safe Bunks Remaining</Text> while staying above 75%.
                    </Text>
                  ) : (
                    <Text style={styles.adviceText}>
                      ⚠️ <Text style={styles.boldText}>Need {sub.classesNeededTo75} consecutive classes</Text> to reach 75% threshold!
                      {isDetained && ' (Currently barred from SEE)'}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Tab 2: Daily Timetable */}
      {activeTab === 'TIMETABLE' && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionHeading}>Today's Lectures & Laboratory Schedule</Text>
          {MOCK_TIMETABLE.map((slot) => (
            <View key={slot.id} style={styles.timetableCard}>
              <View style={styles.timeCol}>
                <Text style={styles.timeText}>{slot.startTime}</Text>
                <Text style={styles.timeSubText}>{slot.endTime}</Text>
                <View style={styles.periodWeightBadge}>
                  <Text style={styles.periodWeightText}>{slot.periodWeight} Period{slot.periodWeight > 1 ? 's' : ''}</Text>
                </View>
              </View>

              <View style={styles.slotDetails}>
                <View style={styles.slotRow}>
                  <Text style={styles.slotSubCode}>{slot.subjectCode}</Text>
                  <Text style={styles.slotRoom}>{slot.roomNo}</Text>
                </View>
                <Text style={styles.slotSubName}>{slot.subjectName}</Text>
                <Text style={styles.slotFaculty}>Faculty: {slot.facultyName}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Tab 3: Apply for OD / Gate Pass */}
      {activeTab === 'APPLY_OD' && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionHeading}>Digital On-Duty (OD) & Leave Application</Text>
          <Text style={styles.formHint}>
            Approved OD grants up to 10% attendance waiver for university-sponsored events.
          </Text>

          <View style={styles.formCard}>
            <Text style={styles.formLabel}>Request Category</Text>
            <View style={styles.odTypeOptions}>
              {[
                { label: 'ISRO / Technical Hackathon', val: 'OD_ISRO_WORKSHOP' },
                { label: 'Sports & Athletics', val: 'OD_SPORTS' },
                { label: 'NSS / NCC Camp', val: 'OD_NCC' },
                { label: 'Medical Emergency Leave', val: 'MEDICAL_LEAVE' },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.val}
                  style={[styles.radioBtn, odType === opt.val && styles.radioBtnActive]}
                  onPress={() => setOdType(opt.val)}
                >
                  <Text style={[styles.radioText, odType === opt.val && styles.radioTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.formLabel}>Event / Reason Description</Text>
            <TextInput
              style={styles.textInputArea}
              placeholder="Provide event details, dates, and venue..."
              value={eventDesc}
              onChangeText={setEventDesc}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.formLabel}>Date Duration (e.g., 2026-11-24 to 2026-11-26)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="YYYY-MM-DD to YYYY-MM-DD"
              value={dateRange}
              onChangeText={setDateRange}
            />

            {/* Document Upload Button */}
            <TouchableOpacity
              style={[styles.uploadButton, hasUploadedDoc && styles.uploadButtonSuccess]}
              onPress={handleDocumentPick}
              activeOpacity={0.8}
            >
              <Text style={styles.uploadText}>
                {isUploading
                  ? 'Verifying Document...'
                  : hasUploadedDoc
                  ? '✓ Sanction_Letter_ISRO.pdf Attached'
                  : '📎 Attach Invitation / Doctor Certificate (PDF/JPG)'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyBtn} onPress={handleApplyOD} activeOpacity={0.8}>
              <Text style={styles.applyBtnText}>Submit to HOD & Proctor</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: colors.accentGold,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  profileDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
  },
  usnBadge: {
    backgroundColor: colors.accentGoldLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginVertical: 3,
  },
  usnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
    fontFamily: 'monospace',
  },
  academicMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  schoolMeta: {
    fontSize: 11,
    color: colors.textMuted,
  },
  complianceBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  complianceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  complianceTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  compliancePercent: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.presentGreen,
  },
  eligibilityBadge: {
    backgroundColor: colors.presentGreenLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eligibilityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  tabNav: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    padding: 3,
    marginBottom: 16,
  },
  tabNavItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabNavText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  tabContent: {
    paddingHorizontal: 16,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  subjectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  codeTag: {
    backgroundColor: colors.badgeBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  subPercentage: {
    fontSize: 16,
    fontWeight: '800',
  },
  subName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  conductedText: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  thresholdMarker: {
    position: 'absolute',
    left: '75%',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#0F172A',
  },
  calcAdviceBox: {
    padding: 8,
    borderRadius: 6,
  },
  adviceSuccess: {
    backgroundColor: colors.presentGreenLight,
  },
  adviceWarning: {
    backgroundColor: colors.condonationAmberLight,
  },
  adviceDanger: {
    backgroundColor: colors.detainedRedLight,
  },
  adviceText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  boldText: {
    fontWeight: '700',
  },
  timetableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
  },
  timeCol: {
    width: 85,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  timeSubText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  periodWeightBadge: {
    marginTop: 4,
    backgroundColor: colors.badgeBg,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  periodWeightText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  slotDetails: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slotSubCode: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accentMaroon,
  },
  slotRoom: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  slotSubName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginVertical: 2,
  },
  slotFaculty: {
    fontSize: 11,
    color: colors.textMuted,
  },
  formHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
    marginTop: 10,
  },
  odTypeOptions: {
    gap: 6,
  },
  radioBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  radioBtnActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  radioText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  radioTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  textInputArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    textAlignVertical: 'top',
    height: 70,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
  },
  uploadButton: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#94A3B8',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 14,
  },
  uploadButtonSuccess: {
    backgroundColor: colors.presentGreenLight,
    borderColor: colors.presentGreen,
    borderStyle: 'solid',
  },
  uploadText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  applyBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
