import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Slider } from './Slider/Slider';
import { Input } from './Input/Input';
import { Alert, AlertDescription } from './Alert/Alert';
import { Map, Heart, Activity, Plus, X } from 'lucide-react';
import { cn } from '../utils/cn';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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

  const [step, setStep] = useState(0);

  const sensationCategories = {
    physical: ['Tension', 'Relaxation', 'Warmth', 'Coolness', 'Tingling', 'Pressure'],
    emotional: ['Lightness', 'Heaviness', 'Expansion', 'Contraction', 'Flow', 'Stillness'],
    energetic: ['Vibration', 'Pulsing', 'Radiating', 'Centering', 'Opening', 'Grounding']
  };

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
    // Step 1: Goal Setting
    <div key="goal-setting" className="space-y-6 fade-in">
      <Alert className="bg-sage/5 border-sage/20">
        <AlertDescription className="text-earth leading-relaxed">
          Take a moment to reflect on your next goal in your business. What is it that you deeply 
          desire to experience by a certain date? Please be as clear as feels natural to you, 
          whatever 'clear goal or desire' means in this moment.
        </AlertDescription>
      </Alert>
      <div className="space-y-3">
        <label className="text-sm font-medium text-earth">Share your goal</label>
        <Input
          type="text"
          value={goal}
          onChange={(e) => setJourneyData({ ...journeyData, goal: e.target.value })}
          placeholder="Enter your goal here"
          className="input focus:border-cosmic"
        />
      </div>
    </div>,

    // Step 2: Timeline Selection
    <div key="date" className="space-y-6 fade-in">
      <Alert className="bg-cosmic/5 border-cosmic/20">
        <AlertDescription className="text-earth leading-relaxed">
          I invite you to choose a date for your goal—not as a deadline but for the sake of honest 
          evaluation. A goal can manifest at any time, but having a date allows it to become more 
          real in your mind, making it better for proximity mapping.
        </AlertDescription>
      </Alert>
      <div className="space-y-3">
        <label className="text-sm font-medium text-earth">Choose a target date</label>
        <Input
          type="date"
          value={targetDate}
          onChange={(e) => setJourneyData({ ...journeyData, targetDate: e.target.value })}
          className="input focus:border-cosmic"
        />
      </div>
      {targetDate && (
        <div className="text-sm text-cosmic">
          This date is {daysUntilTarget} days away.
          <br />
          The halfway point would be in {Math.ceil(daysUntilTarget / 2)} days.
        </div>
      )}
    </div>,

    // Step 3: Current Position
    <div key="current" className="space-y-6 fade-in">
      <Alert className="bg-sage/5 border-sage/20">
        <AlertDescription className="text-earth leading-relaxed">
          If the reality you're experiencing your goal/desire in is Z, what letter are you located 
          at in relationship to that?
        </AlertDescription>
      </Alert>
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-dove">
          {alphabet.map((letter, index) => (
            <span
              key={letter}
              className={cn(
                "text-sm transition-colors",
                index === currentPosition ? "text-cosmic font-medium" : ""
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
        />
      </div>
    </div>,

    // Step 4: Reflective Step (New)
    <div key="reflective-step" className="space-y-6 fade-in">
      <Card className="glass-effect p-6 rounded-3xl shadow-md animate-fade-in">
        <CardContent className="space-y-4">
          <h2 className="text-cosmic font-bold text-xl">
            Imagine crossing a river, hopping from stone to stone.
          </h2>
          <p className="text-earth">
            Each stone represents steps toward your goal—some are within reach, others require effort,
            and some demand bold leaps. This practice invites you to tune into three things:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-earth">
            <li>What's within your grasp? Solid, reachable, and ready for action.</li>
            <li>What can you reach with a stretch? These steps push you further.</li>
            <li>When are you ready to leap? Bold moves that demand trust, risk, and readiness.</li>
          </ul>
          <p className="italic text-sage">
            Each choice brings its own energy and rhythm to your progress.
          </p>
        </CardContent>
      </Card>
      <div className="flex justify-end pt-4">
        <Button
          variant="cosmic"
          onClick={() => setStep((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>,

    // Step 5: Alignment Check
    <div key="alignment" className="space-y-6 fade-in">
      <Alert className="bg-cosmic/5 border-cosmic/20">
        <AlertDescription className="text-earth leading-relaxed">
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
              <span className="text-sm text-earth">{statement}</span>
              <span className="text-sm text-cosmic">{likertScores[key]}/5</span>
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
            />
          </div>
        ))}
      </div>
    </div>,
  ];

  return (
<Card
  className="w-full max-w-4xl mx-auto backdrop-blur-sm animate-fade-in"
  style={{
    backgroundColor: "rgba(255, 255, 255, 0.01)", // Translucent background
    backdropFilter: "blur(8px)",
    "-webkit-backdrop-filter": "blur(8px)",
  }}
>
      <CardHeader className="border-b border-stone/10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step <= 2 && <Map className="w-5 h-5 text-cosmic" />}
            {step === 3 && <Heart className="w-5 h-5 text-cosmic" />}
            {step === 4 && <Activity className="w-5 h-5 text-cosmic" />}
            <span className="text-xl font-medium text-sage">
              {step === 0
                ? 'Set Your Goal'
                : step === 1
                ? 'Choose Your Timeline'
                : step === 2
                ? 'Map Your Journey'
                : step === 3
                ? 'Reflection'
                : 'Alignment Check'}
            </span>
          </div>
          <span className="text-sm text-dove">
            {step + 1} of {steps.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {steps[step]}
        <div className="flex justify-between pt-4 border-t border-stone/10">
          <Button
            variant="outline"
            onClick={() => step === 0 ? onBack() : setStep((prev) => prev - 1)}
            className="text-earth hover:text-cosmic transition-colors"
          >
            Back
          </Button>
          {step < steps.length - 1 && (
            <Button 
              variant="cosmic"
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
            >
              {step === steps.length - 1 ? 'Complete' : 'Continue'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
