import React, { useState } from 'react';
import JourneyFlow from '@/components/JourneyFlow';
import BeliefAdjustment from '@/components/BeliefAdjustment';
import AlignmentAdjustment from '@/components/AlignmentAdjustment';

export default function Home() {
  // 1) Step logic
  const [step, setStep] = useState(0);

  // 2) Example user data (if you need it). 
  //    If JourneyFlow updates these fields, pass journeyData + setJourneyData down to JourneyFlow.
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
    alert('All steps complete! See final data in console.');
    console.log('Final data:', journeyData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
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
          initialGoal={journeyData.goal}
          onContinue={handleBeliefAdjustmentContinue}
        />
      )}

      {/* Step 2: AlignmentAdjustment */}
      {step === 2 && (
        <AlignmentAdjustment
          initialGoal={journeyData.goal}
          onComplete={handleAlignmentAdjustmentComplete}
        />
      )}
    </div>
  );
}
