import React, { useState } from 'react';
import JourneyFlow from '../components/JourneyFlow';
import BeliefAdjustment from '../components/BeliefAdjustment';
import AlignmentAdjustment from '../components/AlignmentAdjustment';

export default function Home() {
  // Track which step the user is on (0: JourneyFlow, 1: BeliefAdjustment, 2: AlignmentAdjustment)
  const [step, setStep] = useState(0);

  // Keep track of the user's data in one object
  const [journeyData, setJourneyData] = useState({
    goal: '',
    timeline: '',
    reflections: '',
  });

  // Called when JourneyFlow is done
  const handleJourneyFlowComplete = () => {
    setStep(1);
  };

  // Called when BeliefAdjustment is done
  const handleBeliefAdjustmentContinue = () => {
    setStep(2);
  };

  // Called when AlignmentAdjustment is done
  const handleAlignmentAdjustmentComplete = () => {
    alert('All steps complete! Check the console for final data.');
    console.log('Final journeyData:', journeyData);
    // You could redirect somewhere, show a final summary, etc.
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
          initialGoal={journeyData.goal}
          onContinue={handleBeliefAdjustmentContinue}
        />
      )}
      {step === 2 && (
        <AlignmentAdjustment
          initialGoal={journeyData.goal}
          onComplete={handleAlignmentAdjustmentComplete}
        />
      )}
    </div>
  );
}
