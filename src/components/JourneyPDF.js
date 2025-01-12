import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#3E54B8', // cosmic color
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#4A524A', // sage color
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  divider: {
    borderBottom: 1,
    borderBottomColor: '#E7E5E0', // stone color
    marginVertical: 10,
  },
});

export const JourneyPDF = ({ journeyData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Your Journey Summary</Text>
        
        <View style={styles.section}>
          <Text style={styles.subtitle}>Goal</Text>
          <Text style={styles.text}>{journeyData.goal}</Text>
          <Text style={styles.text}>Target Date: {new Date(journeyData.targetDate).toLocaleDateString()}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.subtitle}>Current Position</Text>
          <Text style={styles.text}>
            You are at position {String.fromCharCode(65 + journeyData.currentPosition)} 
            in your journey towards Z
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.subtitle}>Body Awareness</Text>
          <Text style={styles.text}>Selected Sensations:</Text>
          {journeyData.selectedSensations?.map((sensation, index) => (
            <Text key={index} style={styles.text}>• {sensation}</Text>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.subtitle}>Alignment Scores</Text>
          {Object.entries(journeyData.likertScores || {}).map(([key, value]) => (
            <Text key={key} style={styles.text}>
              {key.charAt(0).toUpperCase() + key.slice(1)}: {value}/5
            </Text>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default JourneyPDF;
