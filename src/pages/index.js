import React, { useState } from 'react';

// Use relative paths:
import JourneyFlow from '../components/JourneyFlow.js';
import BeliefAdjustment from '../components/BeliefAdjustment.js';
import AlignmentAdjustment from '../components/AlignmentAdjustment.js';

export default function HomePage() {
  const [step, setStep] = useState(0);

  // Example: Keep a single data object
  const [journeyData, setJourneyData] = useState({
    goal: '',
    // ...any other fields
  });

  // Step handlers
  const handleJourneyFlowComplete = () => setStep(1);
  const handleBeliefAdjustmentContinue = () => setStep(2);
  const handleAlignmentAdjustmentComplete = () => {
    alert('All steps complete!');
    console.log('Final data:', journeyData);
  };

  return (
    <main className="p-4">
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
    </main>
  );
}
