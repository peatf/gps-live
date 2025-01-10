import React, { useState } from 'react';
import JourneyFlow from '../components/JourneyFlow';
import BeliefAdjustment from '../components/BeliefAdjustment';
import AlignmentAdjustment from '../components/AlignmentAdjustment';

export default function HomePage() {
  const [step, setStep] = useState(0);
  const [journeyData, setJourneyData] = useState({
    goal: '',
    targetDate: '',
    daysUntilTarget: 0,
    currentPosition: 0,
    selectedSensations: [],
    likertScores: {
      safety: 3,
      confidence: 3,
      openness: 3,
      deserving: 3,
      belief: 3,
      anticipation: 3,
      appreciation: 3,
    },
  });

  const handleBack = () => setStep(prev => Math.max(0, prev - 1));
  const handleJourneyFlowComplete = () => setStep(1);
  const handleBeliefAdjustmentContinue = () => setStep(2);
  const handleAlignmentAdjustmentComplete = () => {
    alert('Journey complete! Thank you for participating.');
    console.log('Final journeyData:', journeyData);
  };

  return (
    <main className="p-4 min-h-screen app-container">
      {step === 0 && (
        <JourneyFlow
          journeyData={journeyData}
          setJourneyData={setJourneyData}
          onComplete={handleJourneyFlowComplete}
          onBack={handleBack}
        />
      )}

      {step === 1 && (
        <BeliefAdjustment
          journeyData={journeyData}
          setJourneyData={setJourneyData}
          onContinue={handleBeliefAdjustmentContinue}
          onBack={handleBack}
        />
      )}

      {step === 2 && (
        <AlignmentAdjustment
          journeyData={journeyData}
          setJourneyData={setJourneyData}
          onComplete={handleAlignmentAdjustmentComplete}
          onBack={handleBack}
        />
      )}
    </main>
  );
}
