import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#3E54B8',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
    color: '#4A524A',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E7E5E0',
    paddingBottom: 5,
    marginBottom: 5,
  },
  cell: {
    width: '50%',
    fontSize: 12,
  },
});

const JourneyPDF = ({ journeyData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Goal Section */}
      <View style={styles.section}>
        <Text style={styles.title}>Your Journey Summary</Text>
        <Text style={styles.subtitle}>Goal</Text>
        <Text style={styles.text}>{journeyData.goal}</Text>
        <Text style={styles.text}>Target Date: {new Date(journeyData.targetDate).toLocaleDateString()}</Text>
      </View>

      {/* Letter Positions Section */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Journey Progress</Text>
        <Text style={styles.text}>Initial Position: {String.fromCharCode(65 + journeyData.initialLetterPosition)}</Text>
        <Text style={styles.text}>Final Position: {String.fromCharCode(65 + journeyData.finalLetterPosition)}</Text>
      </View>

      {/* Sensations Section */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Body Awareness</Text>
        {journeyData.selectedSensations.map((sensation, index) => (
          <Text key={index} style={styles.text}>• {sensation}</Text>
        ))}
      </View>

      {/* Alignment Scores Section */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Alignment Progress</Text>
        <View style={styles.table}>
          {Object.keys(journeyData.initialScores || {}).map((key) => (
            <View style={styles.row} key={key}>
              <Text style={styles.cell}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
              <Text style={styles.cell}>
                Initial: {journeyData.initialScores[key]}/5 | Final: {journeyData.finalScores?.[key]}/5
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Advice Section */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Suggestions</Text>
        {Object.entries(journeyData.aiAdvice || {}).map(([key, advice]) => (
          <View key={key}>
            <Text style={styles.text}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
            <Text style={styles.text}>- {advice}</Text>
          </View>
        ))}
        <Text style={styles.text}>Proximity Advice: {journeyData.latestProximityAdvice}</Text>
      </View>
    </Page>
  </Document>
);

export default JourneyPDF;
