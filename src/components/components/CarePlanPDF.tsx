import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Montserrat',
  fonts: [
    { src: '/Montserrat-Light.ttf', fontWeight: 300 },
    { src: '/Montserrat-Regular.ttf', fontWeight: 400 },
    { src: '/Montserrat-SemiBold.ttf', fontWeight: 600 },
    { src: '/Montserrat-Bold.ttf', fontWeight: 700 },
  ],
});

// Define colors
const ORANGE = '#cd5828';
const BLUE = '#1b2d48';
const LIGHT_BLUE = '#e6eaf0';

// Create styles
const styles = StyleSheet.create({
  page: { 
    padding: 54,
    fontFamily: 'Montserrat',
    fontSize: 10,
    color: BLUE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 108,
    height: 58,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
  },
  orangeLine: {
    height: 3.6,
    backgroundColor: ORANGE,
    marginBottom: 20,
  },
  patientInfo: {
    marginBottom: 20,
  },
  patientInfoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  patientInfoLabel: {
    width: 108,
    fontWeight: 600,
  },
  table: {
    flexDirection: 'row',
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 20,
  },
  tableColumn: {
    flex: 1,
    borderRightColor: 'white',
    borderRightWidth: 1,
  },
  tableHeader: {
    backgroundColor: BLUE,
    color: 'white',
    padding: 10,
    fontWeight: 700,
  },
  tableCell: {
    backgroundColor: LIGHT_BLUE,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 10,
    marginTop: 20,
  },
  listItem: {
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 54,
    left: 54,
    right: 54,
  },
  footerText: {
    fontSize: 8,
    fontWeight: 300,
    textAlign: 'center',
  },
});

interface CarePlanPDFProps {
  patientData: {
    name: string;
    dob: string;
    service: string;
    goals: string[];
    objectives: string[];
  };
  plan: string[];
  healthySolutions: string[];
}

const CarePlanPDF: React.FC<CarePlanPDFProps> = ({ patientData, plan, healthySolutions }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src="/bubolo_logo.png" />
        <Text style={styles.title}>Your Personalized Care Plan</Text>
      </View>

      <View style={styles.orangeLine} />

      <View style={styles.patientInfo}>
        <View style={styles.patientInfoRow}>
          <Text style={styles.patientInfoLabel}>Name:</Text>
          <Text>{patientData.name}</Text>
        </View>
        <View style={styles.patientInfoRow}>
          <Text style={styles.patientInfoLabel}>Date of Birth:</Text>
          <Text>{patientData.dob}</Text>
        </View>
        <View style={styles.patientInfoRow}>
          <Text style={styles.patientInfoLabel}>Current Service:</Text>
          <Text>{patientData.service}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableColumn}>
          <Text style={styles.tableHeader}>Goals</Text>
          {patientData.goals.map((goal, index) => (
            <Text key={index} style={styles.tableCell}>{goal}</Text>
          ))}
        </View>
        <View style={styles.tableColumn}>
          <Text style={styles.tableHeader}>Objectives</Text>
          {patientData.objectives.map((objective, index) => (
            <Text key={index} style={styles.tableCell}>{objective}</Text>
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Personalized Plan</Text>
      {plan.map((item, index) => (
        <Text key={index} style={styles.listItem}>{index + 1}. {item}</Text>
      ))}

      <Text style={styles.sectionTitle}>Healthy Solutions</Text>
      {healthySolutions.map((item, index) => (
        <Text key={index} style={styles.listItem}>• {item}</Text>
      ))}

      <View style={styles.footer}>
        <View style={styles.orangeLine} />
        <Text style={styles.footerText}>
          678-940-6456 | bubolo.care | kaylar@bubolo365.com | 3889 Cobb Pkwy NW, Acworth, GA 30101
        </Text>
      </View>
    </Page>
  </Document>
);

export default CarePlanPDF;
