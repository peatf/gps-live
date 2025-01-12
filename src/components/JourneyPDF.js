import React from 'react';
import { Document, Page, Text, View, StyleSheet, Line } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: '#3E54B8',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#4A524A',
    fontWeight: 'bold',
  },
  goalText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#2F2E2C',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  column: {
    flex: 1,
    paddingRight: 10,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#4A524A',
  },
  scoreValue: {
    fontSize: 12,
    color: '#3E54B8',
  },
  divider: {
    borderBottom: 1,
    borderBottomColor: '#E7E5E0',
    marginVertical: 15,
  },
  proximityMap: {
    height: 80,
    marginVertical: 10,
    position: 'relative',
  },
  letterGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  letter: {
    fontSize: 10,
    color: '#666',
  },
  highlightedLetter: {
    fontSize: 12,
    color: '#3E54B8',
    fontWeight: 'bold',
  },
  positionLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  line: {
    height: 2,
    backgroundColor: '#E7E5E0',
  },
  marker: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3E54B8',
  },
  sensationTag: {
    backgroundColor: '#F8F7F5',
    padding: 4,
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 4,
    fontSize: 10,
    color: '#4A524A',
  },
  adviceSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F8F7F5',
    borderRadius: 4,
  },
  adviceText: {
    fontSize: 12,
    color: '#2F2E2C',
    lineHeight: 1.4,
  },
  flexWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});

const ProximitySlider = ({ initial, current }) => (
  <View style={styles.proximityMap}>
    <View style={styles.letterGrid}>
      {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, i) => (
        <Text 
          key={letter}
          style={i === initial || i === current ? styles.highlightedLetter : styles.letter}
        >
          {letter}
        </Text>
      ))}
    </View>
    <View style={[styles.line]} />
    <View style={styles.positionLabels}>
      <Text style={styles.scoreLabel}>Initial Position: {initial !== undefined ? String.fromCharCode(65 + initial) : 'Not set'}</Text>
      <Text style={styles.scoreLabel}>Final Position: {current !== undefined ? String.fromCharCode(65 + current) : 'Not set'}</Text>
    </View>
  </View>
);

export const JourneyPDF = ({ journeyData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>Your Journey Summary</Text>

      {/* Goal Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Goal</Text>
        <Text style={styles.goalText}>{journeyData.goal}</Text>
        <Text style={styles.dateText}>
          Target Date: {new Date(journeyData.targetDate).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Proximity Slider Results */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Proximity Slider Results</Text>
        <ProximitySlider 
          initial={journeyData.initialPosition} 
          current={journeyData.currentPosition}
        />
      </View>

      <View style={styles.divider} />

      {/* Body Awareness */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Body Awareness</Text>
        <View style={styles.flexWrap}>
          {journeyData.selectedSensations?.map((sensation, index) => (
            <View key={index} style={styles.sensationTag}>
              <Text>{sensation}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.divider} />

      {/* Alignment Scores */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alignment Journey</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            {Object.entries(journeyData.likertScores || {}).slice(0, 4).map(([key, value]) => (
              <View key={key} style={styles.row}>
                <Text style={styles.scoreLabel}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </Text>
                <Text style={styles.scoreValue}> {value}/5</Text>
              </View>
            ))}
          </View>
          <View style={styles.column}>
            {Object.entries(journeyData.likertScores || {}).slice(4).map(([key, value]) => (
              <View key={key} style={styles.row}>
                <Text style={styles.scoreLabel}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </Text>
                <Text style={styles.scoreValue}> {value}/5</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Supportive Suggestions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Supportive Suggestions</Text>
        
        {/* Proximity Slider Advice */}
        {journeyData.latestProximityAdvice && (
          <View style={styles.adviceSection}>
            <Text style={[styles.scoreLabel, { marginBottom: 5 }]}>From Proximity Mapping:</Text>
            <Text style={styles.adviceText}>{journeyData.latestProximityAdvice}</Text>
          </View>
        )}
        
        {/* Alignment Advice */}
        {journeyData.latestAiAdvice && Object.entries(journeyData.latestAiAdvice).map(([area, advice]) => (
          <View key={area} style={[styles.adviceSection, { marginTop: 10 }]}>
            <Text style={[styles.scoreLabel, { marginBottom: 5 }]}>
              From {area.charAt(0).toUpperCase() + area.slice(1)} Alignment:
            </Text>
            <Text style={styles.adviceText}>{advice}</Text>
          </View>
        ))}
        
        {!journeyData.latestProximityAdvice && (!journeyData.latestAiAdvice || Object.keys(journeyData.latestAiAdvice).length === 0) && (
          <Text style={styles.adviceText}>Generate advice by adjusting the sliders in Proximity Mapping and Alignment sections.</Text>
        )}
      </View>
    </Page>
  </Document>
);

export default JourneyPDF;
