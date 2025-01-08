import React, { useState } from 'react';

import JourneyFlow from '@/components/JourneyFlow.js';
import BeliefAdjustment from '@/components/BeliefAdjustment.js';
import AlignmentAdjustment from '@/components/AlignmentAdjustment.js';

export default function HomePage() {
  const [step, setStep] = useState(0);

  // Example data object
  const [journeyData, setJourneyData] = useState({ 
    goal: '',
    // etc...
  });

  const handleJourneyComplete = () => setStep(1);
  const handleBeliefContinue = () => setStep(2);
  const handleAlignmentComplete = () => {
    alert('Done with all steps');
    console.log('Final journeyData:', journeyData);
  };

  return (
    <main>
      {step === 0 && (
        <JourneyFlow
          journeyData={journeyData}
          setJourneyData={setJourneyData}
          onComplete={handleJourneyComplete}
        />
      )}
      {step === 1 && (
        <BeliefAdjustment
          journeyData={journeyData}
          setJourneyData={setJourneyData}
          onContinue={handleBeliefContinue}
        />
      )}
      {step === 2 && (
        <AlignmentAdjustment
          journeyData={journeyData}
          setJourneyData={setJourneyData}
          onComplete={handleAlignmentComplete}
        />
      )}
    </main>
  );
}
