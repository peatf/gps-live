import React, { useState } from 'react';

// Using the alias for these imports:
import JourneyFlow from '@/components/JourneyFlow';
import BeliefAdjustment from '@/components/BeliefAdjustment';
import AlignmentAdjustment from '@/components/AlignmentAdjustment';

export default function HomePage() {
  // We track which of the 3 steps is being shown:
  const [step, setStep] = useState(0);

  // Our single object for storing all user data from JourneyFlow
  // Start with default values
  const [journeyData, setJourneyData] = useState({
    goal: '',
    targetDate: '',
    daysUntilTarget: 0,
    currentPosition: 0,
    midpointPosition: 0,
    endPosition: 0,
    likertScores: {
      safety: 3,
      confidence: 3,
      openness: 3,
      deserving: 3,
      belief: 3,
    },
  });

  // Step navigation handlers:
  const handleJourneyFlowComplete = () => {
    // Move from step 0 → step 1
    setStep(1);
  };

  const handleBeliefAdjustmentContinue = () => {
    // Move from step 1 → step 2
    setStep(2);
  };

  const handleAlignmentAdjustmentComplete = () => {
    // The user is done with all steps
    alert('All steps complete! Check console for final data.');
    console.log('Final journeyData:', journeyData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {step === 0 && (
        <JourneyFlow
          journeyData={journeyData}
          setJourneyData={setJourneyData}
          onComplete={handleJourneyFlowComplete}
        />
      )}

      {step === 1 && (
        <BeliefAdjustment
          journeyData={journeyData}
          setJourneyData={setJourneyData}
          onContinue={handleBeliefAdjustmentContinue}
        />
      )}

      {step === 2 && (
        <AlignmentAdjustment
          journeyData={journeyData}
          setJourneyData={setJourneyData}
          onComplete={handleAlignmentAdjustmentComplete}
        />
      )}
    </div>
  );
}
