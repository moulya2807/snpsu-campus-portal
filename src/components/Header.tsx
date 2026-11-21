import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { OfflineSyncService } from '../services/offlineSyncService';

interface HeaderProps {
  title: string;
  subtitle?: string;
  roleBadge?: string;
  onRefresh?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, roleBadge, onRefresh }) => {
  const [pendingSync, setPendingSync] = React.useState(0);
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    const handleSync = (count: number) => setPendingSync(count);
    OfflineSyncService.addListener(handleSync);
    return () => OfflineSyncService.removeListener(handleSync);
  }, []);

  const toggleNetworkSimulation = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    OfflineSyncService.setOnlineState(nextState);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>SNPSU</Text>
          </View>
          <View>
            <Text style={styles.univName}>SAPTHAGIRI NPS UNIVERSITY</Text>
            <Text style={styles.campusLocation}>Bengaluru • Chikkasandra Campus</Text>
          </View>
        </View>

        {roleBadge && (
          <View style={styles.roleTag}>
            <Text style={styles.roleTagText}>{roleBadge}</Text>
          </View>
        )}
      </View>

      <View style={styles.titleRow}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {/* Offline-First Network Status Pill */}
        <TouchableOpacity 
          style={[styles.networkPill, isOnline ? styles.onlinePill : styles.offlinePill]} 
          onPress={toggleNetworkSimulation}
          activeOpacity={0.7}
        >
          <View style={[styles.statusDot, { backgroundColor: isOnline ? '#10B981' : '#EF4444' }]} />
          <Text style={styles.networkText}>
            {isOnline ? (pendingSync > 0 ? `Syncing (${pendingSync})` : 'Online') : `Offline (${pendingSync} queued)`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderBottomColor: colors.accentGold,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    backgroundColor: colors.accentMaroon,
    borderWidth: 1.5,
    borderColor: colors.accentGold,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 10,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  },
  univName: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  campusLocation: {
    color: colors.accentGold,
    fontSize: 10,
    fontWeight: '500',
  },
  roleTag: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accentGold,
  },
  roleTagText: {
    color: colors.accentGold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  networkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  onlinePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
  },
  offlinePill: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#EF4444',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  networkText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});
