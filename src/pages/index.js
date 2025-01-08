import React, { useState } from 'react';

// Example of relative imports for your components
import JourneyFlow from '../components/JourneyFlow';
import BeliefAdjustment from '../components/BeliefAdjustment';
import AlignmentAdjustment from '../components/AlignmentAdjustment';

export default function HomePage() {
  const [step, setStep] = useState(0);

  // Provide a default for everything you’ll read in JourneyFlow
  const [journeyData, setJourneyData] = useState({
    goal: '',
    targetDate: '',
    daysUntilTarget: 0,
    currentPosition: 0,
    midpointPosition: 0,
    endPosition: 0,
    // Likert scores must have a default object
    likertScores: {
      safety: 3,
      confidence: 3,
      openness: 3,
      deserving: 3,
      belief: 3,
    },
  });

  // AI response state
  const [aiSuggestion, setAiSuggestion] = useState('');

  // Step handlers
  const handleJourneyFlowComplete = () => setStep(1);
  const handleBeliefAdjustmentContinue = () => setStep(2);

  const handleAlignmentAdjustmentComplete = () => {
    alert('All steps complete!');
    console.log('Final journeyData:', journeyData);
  };

  /**
   * Calls your /api/generate endpoint, sending journeyData as userData.
   * This will communicate with OpenAI using the API key you configured.
   */
  const handleGenerateAI = async () => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData: journeyData }),
      });
      const data = await response.json();

      if (data?.result) {
        setAiSuggestion(data.result);
      } else {
        setAiSuggestion('No response received from AI.');
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
      setAiSuggestion('Error calling AI API.');
    }
  };

  return (
    <main className="p-4">
      {/* Step 0: JourneyFlow */}
      {step === 0 && (
        <JourneyFlow
          journeyData={journeyData}
          setJourneyData={setJourneyData}
          onComplete={handleJourneyFlowComplete}
        />
      )}

      {/* Step 1: BeliefAdjustment */}
      {step === 1 && (
        <BeliefAdjustment
          journeyData={journeyData}
          setJourneyData={setJourneyData}
          onContinue={handleBeliefAdjustmentContinue}
        />
      )}

      {/* Step 2: AlignmentAdjustment */}
      {step === 2 && (
        <AlignmentAdjustment
          journeyData={journeyData}
          setJourneyData={setJourneyData}
          onComplete={handleAlignmentAdjustmentComplete}
        />
      )}
    </main>
  );
}
