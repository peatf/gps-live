import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Slider } from './Slider/Slider';
import { Input } from './Input/Input';
import { Alert, AlertDescription } from './Alert/Alert';
import { Map, Heart, Activity, Plus, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function JourneyFlow({ journeyData, setJourneyData, onComplete, onBack }) {
  const {
    goal = '',
    targetDate = '',
    daysUntilTarget = 0,
    currentPosition = 0,
    selectedSensations = [],
    likertScores = {
      safety: 3,
      confidence: 3,
      openness: 3,
      deserving: 3,
      belief: 3,
      anticipation: 3,
      appreciation: 3,
    },
  } = journeyData;

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [step, setStep] = useState(0);

  // Available sensations with categories
  const sensationCategories = {
    physical: ['Tension', 'Relaxation', 'Warmth', 'Coolness', 'Tingling', 'Pressure'],
    emotional: ['Lightness', 'Heaviness', 'Expansion', 'Contraction', 'Flow', 'Stillness'],
    energetic: ['Vibration', 'Pulsing', 'Radiating', 'Centering', 'Opening', 'Grounding']
  };

  // Handle sensation selection
  const toggleSensation = (sensation) => {
    setJourneyData(prev => ({
      ...prev,
      selectedSensations: prev.selectedSensations?.includes(sensation)
        ? prev.selectedSensations.filter(s => s !== sensation)
        : [...(prev.selectedSensations || []), sensation]
    }));
  };

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
        <label className="text-sm font-medium text-gray-700">Describe your goal</label>
        <Input
          type="text"
          value={goal}
          onChange={(e) => setJourneyData({ ...journeyData, goal: e.target.value })}
          placeholder="Enter your goal here"
          className="input w-full"
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
        <label className="text-sm font-medium text-gray-700">Choose a target date</label>
        <Input
          type="date"
          value={targetDate}
          onChange={(e) => setJourneyData({ ...journeyData, targetDate: e.target.value })}
          className="input w-full"
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
              className={cn(
                "text-sm",
                index === currentPosition ? "text-primary-600 font-bold" : "text-gray-600"
              )}
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
          className="slider"
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

      {selectedSensations?.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-purple-50 rounded-lg">
          {selectedSensations.map((sensation) => (
            <span
              key={sensation}
              className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
            >
              {sensation}
              <button
                onClick={() => toggleSensation(sensation)}
                className="hover:text-purple-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {Object.entries(sensationCategories).map(([category, sensations]) => (
        <div key={category} className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 capitalize">{category} Sensations</h3>
          <div className="grid grid-cols-2 gap-2">
            {sensations.map((sensation) => (
              <Button
                key={sensation}
                variant={selectedSensations?.includes(sensation) ? 'primary' : 'outline'}
                className="justify-start"
                onClick={() => toggleSensation(sensation)}
              >
                {selectedSensations?.includes(sensation) ? (
                  <X className="w-4 h-4 mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                {sensation}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>,

    // Alignment Check
    <div key="alignment" className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription>
          How true do these statements feel in your body right now?
        </AlertDescription>
      </Alert>
      <div className="space-y-6">
        {Object.entries({
          safety: "I feel safe and open to receiving this opportunity or experience",
          confidence: "I have strong belief in my abilities and trust in my capability to achieve my goals",
          anticipation: "I consistently expect and anticipate that I will receive what I work towards and desire",
          openness: "I can maintain my focus and open connection to my desired result even if it takes time",
          deserving: "I feel deserving of this experience",
          belief: "I believe this is possible for me",
          appreciation: "I feel a sense of appreciation for this area in my business as it is now. I celebrate my business regularly"
        }).map(([key, statement]) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">{statement}</span>
              <span className="text-sm text-gray-500">{likertScores[key]}/5</span>
            </div>
            <Slider
              value={[likertScores[key]]}
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
              className="slider"
            />
          </div>
        ))}
      </div>
    </div>,
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step <= 2 && <Map className="w-5 h-5 text-primary-600" />}
            {step === 3 && <Heart className="w-5 h-5 text-primary-600" />}
            {step === 4 && <Activity className="w-5 h-5 text-primary-600" />}
            <span className="text-xl font-semibold">
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
          <span className="text-sm text-gray-500 font-medium">
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
            className="flex items-center gap-2"
          >
            Back
          </Button>
          <Button 
            variant="primary"
            onClick={() => {
              if (step === steps.length - 1) {
                onComplete();
              } else {
                if (step === 0 && !goal.trim()) {
                  alert('Please enter your goal before continuing.');
                  return;
                }
                setStep((prev) => prev + 1);
              }
            }}
            className="flex items-center gap-2"
          >
            {step === steps.length - 1 ? 'Continue to Beliefs' : 'Continue'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
