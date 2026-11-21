import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme/colors';
import { Header } from './src/components/Header';
import { FacultyAttendanceScreen } from './src/screens/FacultyAttendanceScreen';
import { FacultyDashboardScreen } from './src/screens/FacultyDashboardScreen';
import { StudentPortalScreen } from './src/screens/StudentPortalScreen';
import { DeanShortageScreen } from './src/screens/DeanShortageScreen';
import { AIAssistantScreen } from './src/screens/AIAssistantScreen';

type PortalRole = 'FACULTY_DASHBOARD' | 'FACULTY_MARKING' | 'STUDENT_PORTAL' | 'DEAN_HOD' | 'AI_ADVISOR';

export default function App() {
  const [activeView, setActiveView] = useState<PortalRole>('FACULTY_MARKING');

  const getHeaderDetails = () => {
    switch (activeView) {
      case 'FACULTY_MARKING':
        return {
          title: 'Period Attendance Marking',
          subtitle: 'SOET • 5th Sem CSE • CBCS Period Roster',
          role: 'FACULTY',
        };
      case 'FACULTY_DASHBOARD':
        return {
          title: 'Faculty Smart Portal',
          subtitle: 'Dr. Ramesh Kumar • Chikkasandra Campus',
          role: 'FACULTY',
        };
      case 'STUDENT_PORTAL':
        return {
          title: 'Student Academic Portal',
          subtitle: 'Aarav Sharma • USN: 1SN24CS001',
          role: 'STUDENT',
        };
      case 'DEAN_HOD':
        return {
          title: 'Dean & HOD Compliance Roster',
          subtitle: 'UGC / AICTE / NMC Statutory Shortage',
          role: 'DEAN / HOD',
        };
      case 'AI_ADVISOR':
        return {
          title: 'SNPSU AI Academic Advisor',
          subtitle: 'Google AI Studio • Gemini 2.0 Flash',
          role: 'AI COPILOT',
        };
    }
  };

  const header = getHeaderDetails();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* SNPSU Institutional Academic Header */}
      <Header
        title={header.title}
        subtitle={header.subtitle}
        roleBadge={header.role}
      />

      {/* Primary Role & Screen Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.navItem, activeView === 'FACULTY_MARKING' && styles.navItemActive]}
          onPress={() => setActiveView('FACULTY_MARKING')}
        >
          <Text style={[styles.navText, activeView === 'FACULTY_MARKING' && styles.navTextActive]}>
            Mark Roster
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeView === 'FACULTY_DASHBOARD' && styles.navItemActive]}
          onPress={() => setActiveView('FACULTY_DASHBOARD')}
        >
          <Text style={[styles.navText, activeView === 'FACULTY_DASHBOARD' && styles.navTextActive]}>
            Faculty Hub
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeView === 'STUDENT_PORTAL' && styles.navItemActive]}
          onPress={() => setActiveView('STUDENT_PORTAL')}
        >
          <Text style={[styles.navText, activeView === 'STUDENT_PORTAL' && styles.navTextActive]}>
            Student (USN)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeView === 'DEAN_HOD' && styles.navItemActive]}
          onPress={() => setActiveView('DEAN_HOD')}
        >
          <Text style={[styles.navText, activeView === 'DEAN_HOD' && styles.navTextActive]}>
            Dean / Shortage
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeView === 'AI_ADVISOR' && styles.navItemActive]}
          onPress={() => setActiveView('AI_ADVISOR')}
        >
          <Text style={[styles.navText, activeView === 'AI_ADVISOR' && styles.navTextActive]}>
            AI Advisor ✨
          </Text>
        </TouchableOpacity>
      </View>

      {/* Screen Body */}
      <View style={styles.body}>
        {activeView === 'FACULTY_MARKING' && <FacultyAttendanceScreen />}
        {activeView === 'FACULTY_DASHBOARD' && (
          <FacultyDashboardScreen onNavigateToMarking={() => setActiveView('FACULTY_MARKING')} />
        )}
        {activeView === 'STUDENT_PORTAL' && <StudentPortalScreen />}
        {activeView === 'DEAN_HOD' && <DeanShortageScreen />}
        {activeView === 'AI_ADVISOR' && <AIAssistantScreen />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#071A31',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  navItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  navItemActive: {
    backgroundColor: colors.accentMaroon,
    borderBottomWidth: 2,
    borderBottomColor: colors.accentGold,
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  navTextActive: {
    color: '#FFFFFF',
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
