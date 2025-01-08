/* src/components/JourneyFlow.js */
import React, { useEffect, useState } from 'react';

// Relative imports for your UI components
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Slider } from './Slider/Slider';
import { Input } from './Input/Input';

import { Map, Heart, Activity } from 'lucide-react';

export default function JourneyFlow({ journeyData, setJourneyData, onComplete }) {
  // Destructure values from journeyData; provide defaults just in case
  const {
    goal = '',
    targetDate = '',
    daysUntilTarget = 0,
    currentPosition = 0,
    midpointPosition = 0,
    endPosition = 0,
    likertScores = {},
  } = journeyData;

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    if (targetDate) {
      const days = Math.ceil((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24));
      setJourneyData((prev) => ({ ...prev, daysUntilTarget: days }));
    }
  }, [targetDate, setJourneyData]);

  const steps = [
    // Step 1: Goal Submission
    <div key="goal-setting" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          Take a moment to imagine your next goal in your business.
          What is it that you want to experience that can be achieved by a certain date?
        </p>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-500">Describe your goal</label>
        <Input
          type="text"
          value={goal}
          onChange={(e) => setJourneyData({ ...journeyData, goal: e.target.value })}
          placeholder="Enter your goal here"
          className="w-full"
        />
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
          onChange={(e) => setJourneyData({ ...journeyData, targetDate: e.target.value })}
          className="w-full"
        />
      </div>
      {targetDate && (
        <div className="text-sm text-gray-600">
          This date is {daysUntilTarget} days away.
          The halfway point would be in {Math.ceil(daysUntilTarget / 2)} days.
        </div>
      )}
    </div>,

    // Step 3: Current Position
    <div key="current" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          Imagine yourself in the now moment like an object on a slider.
          If point A was the first stop on a map... which letter would you be at?
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          {alphabet.map((letter, index) => (
            <span
              key={letter}
              className={index === currentPosition ? 'text-blue-600 font-bold' : ''}
            >
              {letter}
            </span>
          ))}
        </div>
        <Slider
          value={[currentPosition]}
          min={0}
          max={25}
          step={1}
          onValueChange={(value) =>
            setJourneyData({ ...journeyData, currentPosition: value[0] })
          }
          className="w-full"
        />
      </div>
    </div>,

    // Step 4: Midpoint Position
    <div key="midpoint" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          On that halfway date ({
            new Date(Date.now() + (daysUntilTarget / 2) * 24 * 60 * 60 * 1000).toLocaleDateString()
          }), what letter do you think you'll be at?
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          {alphabet.map((letter, index) => (
            <span
              key={letter}
              className={index === midpointPosition ? 'text-green-600 font-bold' : ''}
            >
              {letter}
            </span>
          ))}
        </div>
        <Slider
          value={[midpointPosition]}
          min={0}
          max={25}
          step={1}
          onValueChange={(value) =>
            setJourneyData({ ...journeyData, midpointPosition: value[0] })
          }
          className="w-full"
        />
      </div>
    </div>,

    // Step 5: End Position
    <div key="end" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          Now, at your target date ({new Date(targetDate).toLocaleDateString()}), which letter do you believe you'll be at?
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          {alphabet.map((letter, index) => (
            <span
              key={letter}
              className={index === endPosition ? 'text-purple-600 font-bold' : ''}
            >
              {letter}
            </span>
          ))}
        </div>
        <Slider
          value={[endPosition]}
          min={0}
          max={25}
          step={1}
          onValueChange={(value) =>
            setJourneyData({ ...journeyData, endPosition: value[0] })
          }
          className="w-full"
        />
      </div>
    </div>,

    // Step 6: Somatic Check
    <div key="somatic" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          Notice in your body: From {alphabet[currentPosition]} to {alphabet[endPosition]}, how do you feel?
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {['Tension', 'Warmth', 'Lightness', 'Heaviness', 'Expansion', 'Contraction'].map(
          (sensation) => (
            <Button key={sensation} variant="ghost" className="justify-start">
              + {sensation}
            </Button>
          )
        )}
      </div>
    </div>,

    // Step 7: Alignment Check
    <div key="alignment" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          How true do these statements feel in your body right now?
        </p>
      </div>
      <div className="space-y-6">
        {/* Safely call Object.entries on likertScores */}
        {Object.entries(likertScores || {}).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">
                {key === 'safety' && 'I feel safe to receive this experience'}
                {key === 'confidence' && 'I trust in my capacity to reach this point'}
                {key === 'openness' && 'I can stay open even if it takes time'}
                {key === 'deserving' && 'I feel deserving of this experience'}
                {key === 'belief' && 'I believe this is possible for me'}
              </span>
              <span className="text-sm text-gray-500">{value}/5</span>
            </div>
            <Slider
              value={[value]}
              min={1}
              max={5}
              step={1}
              onValueChange={(newValue) =>
                setJourneyData({
                  ...journeyData,
                  likertScores: {
                    ...likertScores,
                    [key]: newValue[0],
                  },
                })
              }
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>,
  ];

  const [step, setStep] = useState(0);

  const handleContinue = () => {
    if (step === 0 && !goal.trim()) {
      alert('Please enter your goal before continuing.');
      return;
    }
    setStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step <= 4 && <Map className="w-5 h-5" />}
            {step === 5 && <Heart className="w-5 h-5" />}
            {step === 6 && <Activity className="w-5 h-5" />}
            <span>
              {step === 0
                ? 'Set Your Goal'
                : step === 1
                ? 'Choose Your Timeline'
                : step <= 4
                ? 'Map Your Journey'
                : step === 5
                ? 'Body Awareness Check'
                : 'Alignment Check'}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {step + 1} of {steps.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {steps[step]}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setStep((prev) => Math.max(0, prev - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          <Button
            onClick={() => {
              if (step === steps.length - 1) {
                // Last step => go to next phase (BeliefAdjustment)
                onComplete();
              } else {
                handleContinue();
              }
            }}
            disabled={false}
          >
            {step === steps.length - 1 ? 'Finish' : 'Continue'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
