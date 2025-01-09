import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Slider } from './Slider/Slider';
import { Input } from './Input/Input';
import { Alert, AlertDescription } from './Alert/Alert';
import { Map, Heart, Activity } from 'lucide-react';

export default function JourneyFlow({ journeyData, setJourneyData, onComplete, onBack }) {
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
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (targetDate) {
      const days = Math.ceil((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24));
      setJourneyData((prev) => ({ ...prev, daysUntilTarget: days }));
    }
  }, [targetDate, setJourneyData]);

  const steps = [
    // Goal Setting
    <div key="goal-setting" className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription>
          Take a moment to imagine your next goal in your business.
          What is it that you want to experience that can be achieved by a certain date?
        </AlertDescription>
      </Alert>
      <div className="space-y-2">
        <label className="text-sm text-gray-600">Describe your goal</label>
        <Input
          type="text"
          value={goal}
          onChange={(e) => setJourneyData({ ...journeyData, goal: e.target.value })}
          placeholder="Enter your goal here"
          className="w-full"
        />
      </div>
    </div>,

    // Timeline Selection
    <div key="date" className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription>
          I want you to have a date in mind for your goal—not as a deadline but for the sake of honest evaluation. 
          A goal can happen at any time, but having a date allows it to become more real in your mind, making it 
          better for proximity mapping.
        </AlertDescription>
      </Alert>
      <div className="space-y-2">
        <label className="text-sm text-gray-600">Choose a target date</label>
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

    // Current Position
    <div key="current" className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription>
          If the reality you're experiencing your goal/desire in is Z, what letter are you located 
          at in relationship to that?
        </AlertDescription>
      </Alert>
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

    // Body Awareness Check
    <div key="somatic" className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription>
          Notice in your body: When you look at this journey from {alphabet[currentPosition]} to Z, 
          what do you feel? Choose the sensations that describe what you're feeling best.
        </AlertDescription>
      </Alert>
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

    // Alignment Check
    <div key="alignment" className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription>
          How true do these statements feel in your body right now?
        </AlertDescription>
      </Alert>
      <div className="space-y-6">
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

  const handleContinue = () => {
    if (step === 0 && !goal.trim()) {
      alert('Please enter your goal before continuing.');
      return;
    }
    if (step === steps.length - 1) {
      onComplete();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step <= 2 && <Map className="w-5 h-5" />}
            {step === 3 && <Heart className="w-5 h-5" />}
            {step === 4 && <Activity className="w-5 h-5" />}
            <span>
              {step === 0
                ? 'Set Your Goal'
                : step === 1
                ? 'Choose Your Timeline'
                : step === 2
                ? 'Map Your Journey'
                : step === 3
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
            onClick={() => step === 0 ? onBack() : setStep((prev) => prev - 1)}
            disabled={false}
          >
            Back
          </Button>
          <Button onClick={handleContinue}>
            {step === steps.length - 1 ? 'Continue to Beliefs' : 'Continue'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
