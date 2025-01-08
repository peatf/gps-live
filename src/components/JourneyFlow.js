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
    // Step 0: Reflection Step
    <div key="reflection" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          Take a moment to imagine your next goal in your business. What is it you want to experience that can be achieved by a certain date? 
        </p>
      </div>
    </div>,

    // Step 1: Date Selection
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

    // Step 2: Current Position
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

    // Step 3: Midpoint Position
    <div key="midpoint" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          Using your imagination, on that halfway date ({
            new Date(Date.now() + (daysUntilTarget/2) * 24 * 60 * 60 * 1000).toLocaleDateString()
          }), what letter on the map do you believe you will be at?
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          {alphabet.map((letter, index) => (
            <span key={letter} className={`${index === midpointPosition ? 'text-green-600 font-bold' : ''}`}>
              {letter}
            </span>
          ))}
        </div>
        <Slider
          value={[midpointPosition]}
          min={0}
          max={25}
          step={1}
          onValueChange={(value) => setMidpointPosition(value[0])}
          className="w-full"
        />
      </div>
    </div>,

    // Step 4: End Position
    <div key="end" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          Now use your imagination to go to your target date ({new Date(targetDate).toLocaleDateString()}). 
          Where do you believe you will be on the map?
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          {alphabet.map((letter, index) => (
            <span key={letter} className={`${index === endPosition ? 'text-purple-600 font-bold' : ''}`}>
              {letter}
            </span>
          ))}
        </div>
        <Slider
          value={[endPosition]}
          min={0}
          max={25}
          step={1}
          onValueChange={(value) => setEndPosition(value[0])}
          className="w-full"
        />
      </div>
    </div>
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
              step === 0 ? 'Reflect on Your Goal' :
              step === 1 ? 'Choose Your Timeline' :
              step <= 3 ? 'Map Your Journey' :
              step === 4 ? 'Body Awareness Check' :
              'Alignment Check'
            }</span>
          </div>
          <span className="text-sm text-gray-500">{step + 1} of 6</span>
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
