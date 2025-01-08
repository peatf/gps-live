import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card/Card";
import { Button } from "@/components/Button/Button";
import { Slider } from "@/components/Slider/Slider";
import { Input } from "@/components/Input/Input";
import { Map, Heart, Activity } from "lucide-react";

const JourneyFlow = () => {
  const [step, setStep] = useState(0);
  const [targetDate, setTargetDate] = useState('');
  const [daysUntilTarget, setDaysUntilTarget] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [midpointPosition, setMidpointPosition] = useState(0);
  const [endPosition, setEndPosition] = useState(0);
  const [likertScores, setLikertScores] = useState({
    safety: 3,
    confidence: 3,
    openness: 3,
    deserving: 3,
    belief: 3
  });
  
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  useEffect(() => {
    if (targetDate) {
      const days = Math.ceil((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24));
      setDaysUntilTarget(days);
    }
  }, [targetDate]);

  const steps = [
    // Step 1: Imagining the Goal
    <div key="imagine-goal" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          Take a moment to imagine the next goal you want to achieve in your business. 
          Think about what you want to experience, something tangible that can be reached by a certain date.
        </p>
      </div>
      <div className="text-sm text-gray-500">
        When you're ready, click "Continue" to proceed.
      </div>
    </div>,

    // Step 2: Date Selection
    <div key="date" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          I want you to have a date in mind for your goal - not as a deadline or a tool to punish yourself,
          because that does nothing for you. But for the sake of honest evaluation.
        </p>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-500">Choose a target date</label>
        <Input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full"
        />
      </div>
      {targetDate && (
        <div className="text-sm text-gray-600">
          This date is {daysUntilTarget} days away. 
          The halfway point would be in {Math.ceil(daysUntilTarget/2)} days.
        </div>
      )}
    </div>,

    // Step 3: Current Position
    <div key="current" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          Imagine yourself in the now moment like an object on a slider. 
          If point A was the first stop on a map moving in the direction of the next experience 
          you want to attract and point Z was the last stop, which letter would you currently find yourself at?
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          {alphabet.map((letter, index) => (
            <span key={letter} className={`${index === currentPosition ? 'text-blue-600 font-bold' : ''}`}>
              {letter}
            </span>
          ))}
        </div>
        <Slider
          value={[currentPosition]}
          min={0}
          max={25}
          step={1}
          onValueChange={(value) => setCurrentPosition(value[0])}
          className="w-full"
        />
      </div>
    </div>,

    // Add the remaining steps here...

    // Step 4: Midpoint Position
    // Step 5: End Position
    // Step 6: Somatic Check
    // Step 7: Alignment Check
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step <= 3 && <Map className="w-5 h-5" />}
            {step === 4 && <Heart className="w-5 h-5" />}
            {step === 5 && <Activity className="w-5 h-5" />}
            <span>{
              step === 0 ? 'Imagine Your Goal' :
              step === 1 ? 'Choose Your Timeline' :
              step <= 3 ? 'Map Your Journey' :
              step === 4 ? 'Body Awareness Check' :
              'Alignment Check'
            }</span>
          </div>
          <span className="text-sm text-gray-500">{step + 1} of {steps.length}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {steps[step]}
        
        <div className="flex justify-between pt-4">
          <Button 
            variant="outline"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          <Button
            onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
            disabled={step === steps.length - 1}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyFlow;
