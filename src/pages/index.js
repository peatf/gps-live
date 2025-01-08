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

      {/* Button to trigger the AI suggestion */}
      <div className="mt-8">
        <button
          onClick={handleGenerateAI}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Get AI Suggestion
        </button>

        {/* Show AI response */}
        {aiSuggestion && (
          <div className="mt-4 bg-gray-100 p-4 rounded whitespace-pre-wrap">
            <strong>AI Suggestion:</strong> {aiSuggestion}
          </div>
        )}
      </div>
    </main>
  );
}
