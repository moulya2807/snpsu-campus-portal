import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { SNPSU_CAMPUS_GEO } from '../data/mockData';

export const GeoFenceCard: React.FC = () => {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [lastPunchTime, setLastPunchTime] = useState<string | null>(null);
  const [distanceMeters, setDistanceMeters] = useState(38); // Simulated close distance inside campus
  const [verifying, setVerifying] = useState(false);

  const handlePunch = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const nextStatus = !isPunchedIn;
      setIsPunchedIn(nextStatus);
      setLastPunchTime(now);
      Alert.alert(
        nextStatus ? 'Punch-In Verified' : 'Punch-Out Verified',
        `SNPSU Chikkasandra Campus Geofence: ${distanceMeters}m from academic block. Time: ${now}`,
        [{ text: 'OK' }]
      );
    }, 600);
  };

  const isInside = distanceMeters <= SNPSU_CAMPUS_GEO.radiusMeters;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.cardTitle}>Faculty Smart Punch-In</Text>
          <Text style={styles.cardSubtitle}>SNPSU Chikkasandra Geofence Verification</Text>
        </View>
        <View style={[styles.statusBadge, isInside ? styles.badgeSuccess : styles.badgeDanger]}>
          <Text style={[styles.badgeText, isInside ? styles.textSuccess : styles.textDanger]}>
            {isInside ? 'Within Campus (38m)' : 'Out of Bounds'}
          </Text>
        </View>
      </View>

      <View style={styles.contentRow}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Campus Coords</Text>
          <Text style={styles.infoValue}>13.0645° N, 77.5028° E</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text style={[styles.infoValue, { color: isPunchedIn ? colors.presentGreen : colors.textSecondary }]}>
            {isPunchedIn ? `Active (${lastPunchTime})` : 'Not Punched In'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.actionButton,
          isPunchedIn ? styles.punchOutBtn : styles.punchInBtn,
          verifying && styles.btnDisabled,
        ]}
        onPress={handlePunch}
        disabled={verifying}
        activeOpacity={0.8}
      >
        <Text style={styles.actionBtnText}>
          {verifying ? 'Verifying GPS & Wi-Fi BSSID...' : isPunchedIn ? 'Punch-Out for Day' : 'Punch-In at Campus'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  cardSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeSuccess: {
    backgroundColor: colors.presentGreenLight,
    borderColor: colors.presentGreen,
  },
  badgeDanger: {
    backgroundColor: colors.detainedRedLight,
    borderColor: colors.detainedRed,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  textSuccess: {
    color: '#065F46',
  },
  textDanger: {
    color: '#991B1B',
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 8,
  },
  infoBox: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  punchInBtn: {
    backgroundColor: colors.primary,
  },
  punchOutBtn: {
    backgroundColor: colors.accentMaroon,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
