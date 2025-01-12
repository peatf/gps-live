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

export const JourneyPDF = ({ journeyData }) => {
  // Calculate initial and final scores
  const initialLikertScores = journeyData.initialLikertScores || {
    safety: 3,
    confidence: 3,
    openness: 3,
    deserving: 3,
    belief: 3,
    anticipation: 3,
    appreciation: 3,
  };

  // Default starting position if not available
  const startPosition = journeyData.startPosition || 0;

  // Get the last generated advice
  const lastGeneratedAdvice = journeyData.lastGeneratedAdvice || "No advice was generated.";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Your Journey Summary</Text>

          {/* Goal Section */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>Goal</Text>
            <Text style={styles.text}>{journeyData.goal}</Text>
            <Text style={styles.text}>Target Date: {new Date(journeyData.targetDate).toLocaleDateString()}</Text>
          </View>

          <View style={styles.divider} />

          {/* Alignment Scores Section */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>Alignment Scores</Text>
            <Text style={styles.text}>Initial Scores:</Text>
            {Object.entries(initialLikertScores).map(([key, value]) => (
              <Text key={key} style={styles.text}>
                {key.charAt(0).toUpperCase() + key.slice(1)}: {value}/5
              </Text>
            ))}
            <Text style={styles.text}>Final Scores:</Text>
            {Object.entries(journeyData.likertScores || {}).map(([key, value]) => (
              <Text key={key} style={styles.text}>
                {key.charAt(0).toUpperCase() + key.slice(1)}: {value}/5
              </Text>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Proximity Slider Section */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>Journey Position</Text>
            <Text style={styles.text}>
              Starting Position: {String.fromCharCode(65 + startPosition)}
            </Text>
            <Text style={styles.text}>
              Final Position: {String.fromCharCode(65 + journeyData.currentPosition)}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Body Awareness Section */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>Body Awareness</Text>
            <Text style={styles.text}>Selected Sensations:</Text>
            {journeyData.selectedSensations?.map((sensation, index) => (
              <Text key={index} style={styles.text}>• {sensation}</Text>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Last Generated Advice */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>AI Advice</Text>
            <Text style={styles.text}>{lastGeneratedAdvice}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default JourneyPDF;
