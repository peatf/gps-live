// src/components/JourneyFlow.js

import React, { useState } from 'react';
import { Map, Heart, Activity, ArrowRight, ArrowLeft, Plus, X } from 'lucide-react';
import { 
  Title, 
  MetallicButton, 
  MetallicCard, 
  MetallicInput, 
  MetallicSlider,
  MetallicAlert,
  TypewriterText 
} from './DesignSystem';

export default function JourneyFlow({ journeyData, setJourneyData, onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Goal Setting Step
  const GoalSettingStep = () => (
    <div className="space-y-6 animate-fade-in">
      <MetallicAlert variant="info">
        <TypewriterText className="leading-relaxed">
          Take a moment to reflect on your next goal in your business. What is it that you deeply 
          desire to experience by a certain date? Please be as clear as feels natural to you, 
          whatever 'clear goal or desire' means in this moment.
        </TypewriterText>
      </MetallicAlert>

      <div className="space-y-3">
        <label className="text-sm font-medium text-earth/80 uppercase tracking-wide">
          Share your goal
        </label>
        <MetallicInput
          value={journeyData.goal}
          onChange={(e) => setJourneyData({ ...journeyData, goal: e.target.value })}
          placeholder="Enter your goal here"
          className="w-full"
        />
      </div>
    </div>
  );

  // Timeline Selection Step
  const TimelineStep = () => (
    <div className="space-y-6 animate-fade-in">
      <MetallicAlert variant="info">
        <TypewriterText className="leading-relaxed">
          I invite you to choose a date for your goal—not as a deadline but for the sake of honest 
          evaluation. A goal can manifest at any time, but having a date allows it to become more 
          real in your mind, making it better for proximity mapping.
        </TypewriterText>
      </MetallicAlert>

      <div className="space-y-3">
        <label className="text-sm font-medium text-earth/80 uppercase tracking-wide">
          Choose a target date
        </label>
        <MetallicInput
          type="date"
          value={journeyData.targetDate}
          onChange={(e) => setJourneyData({ ...journeyData, targetDate: e.target.value })}
          className="w-full"
        />
      </div>

      {journeyData.targetDate && (
        <MetallicAlert variant="success" className="mt-4">
          <div className="text-cosmic space-y-1">
            <p>This date is {journeyData.daysUntilTarget} days away.</p>
            <p>The halfway point would be in {Math.ceil(journeyData.daysUntilTarget / 2)} days.</p>
          </div>
        </MetallicAlert>
      )}
    </div>
  );

  // Current Position Step
  const CurrentPositionStep = () => (
    <div className="space-y-6 animate-fade-in">
      <MetallicAlert variant="info">
        <TypewriterText className="leading-relaxed">
          If the reality you're experiencing your goal/desire in is Z, what letter are you located 
          at in relationship to that?
        </TypewriterText>
      </MetallicAlert>

      <div className="space-y-4">
        <div className="flex justify-between px-1">
          {alphabet.map((letter, index) => (
            <span
              key={letter}
              className={`text-sm transition-colors ${
                index === journeyData.currentPosition 
                  ? "text-cosmic font-medium scale-110 transform transition-transform" 
                  : "text-earth/50"
              }`}
            >
              {letter}
            </span>
          ))}
        </div>
        <MetallicSlider
          value={journeyData.currentPosition}
          min={0}
          max={25}
          step={1}
          onChange={(e) => setJourneyData({ 
            ...journeyData, 
            currentPosition: Number(e.target.value) 
          })}
        />
      </div>
    </div>
  );

  // Body Awareness Step
  const BodyAwarenessStep = () => {
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

    return (
      <div className="space-y-6 animate-fade-in">
        <MetallicAlert variant="info">
          <TypewriterText className="leading-relaxed">
            Notice in your body: When you look at this journey from {alphabet[journeyData.currentPosition]} to Z, 
            what do you feel? Choose the sensations that describe what you're feeling best.
          </TypewriterText>
        </MetallicAlert>

        {journeyData.selectedSensations?.length > 0 && (
          <div className="flex flex-wrap gap-2 p-4">
            {journeyData.selectedSensations.map((sensation) => (
              <MetallicButton
                key={sensation}
                variant="primary"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => toggleSensation(sensation)}
              >
                {sensation}
                <X className="w-3 h-3" />
              </MetallicButton>
            ))}
          </div>
        )}

        {Object.entries(sensationCategories).map(([category, sensations]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-medium text-earth/80 uppercase tracking-wide capitalize">
              {category} Sensations
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {sensations.map((sensation) => (
                <MetallicButton
                  key={sensation}
                  variant={journeyData.selectedSensations?.includes(sensation) ? 'primary' : 'outline'}
                  size="sm"
                  className="justify-start transition-all duration-200"
                  onClick={() => toggleSensation(sensation)}
                >
                  {journeyData.selectedSensations?.includes(sensation) ? (
                    <X className="w-4 h-4 mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {sensation}
                </MetallicButton>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Alignment Check Step
  const AlignmentCheckStep = () => {
    const alignmentStatements = {
      safety: "I feel safe and open to receiving this opportunity or experience",
      confidence: "I have strong belief in my abilities and trust in my capability to achieve my goals",
      anticipation: "I consistently expect and anticipate that I will receive what I work towards and desire",
      openness: "I can maintain my focus and open connection to my desired result even if it takes time",
      deserving: "I feel deserving of this experience",
      belief: "I believe this is possible for me",
      appreciation: "I feel a sense of appreciation for this area in my business as it is now"
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <MetallicAlert variant="info">
          <TypewriterText className="leading-relaxed">
            How true do these statements feel in your body right now?
          </TypewriterText>
        </MetallicAlert>

        <div className="space-y-6">
          {Object.entries(alignmentStatements).map(([key, statement]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-earth/80">{statement}</span>
                <span className="text-sm text-cosmic">{journeyData.likertScores[key]}/5</span>
              </div>
              <MetallicSlider
                value={journeyData.likertScores[key]}
                min={1}
                max={5}
                step={1}
                onChange={(e) =>
                  setJourneyData({
                    ...journeyData,
                    likertScores: {
                      ...journeyData.likertScores,
                      [key]: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const steps = [
    <GoalSettingStep key="goal" />,
    <TimelineStep key="timeline" />,
    <CurrentPositionStep key="position" />,
    <BodyAwarenessStep key="awareness" />,
    <AlignmentCheckStep key="alignment" />
  ];

  return (
    <MetallicCard className="w-full max-w-4xl mx-auto">
      <div className="border-b border-stone/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step <= 2 && <Map className="w-5 h-5 text-cosmic" />}
            {step === 3 && <Heart className="w-5 h-5 text-cosmic" />}
            {step === 4 && <Activity className="w-5 h-5 text-cosmic" />}
            <Title>
              {step === 0
                ? 'Set Your Goal'
                : step === 1
                ? 'Choose Your Timeline'
                : step === 2
                ? 'Map Your Journey'
                : step === 3
                ? 'Body Awareness Check'
                : 'Alignment Check'}
            </Title>
          </div>
          <span className="text-sm text-dove">
            {step + 1} of {steps.length}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {steps[step]}

        <div className="flex justify-between pt-4 border-t border-stone/10">
          <MetallicButton
            variant="outline"
            onClick={() => step === 0 ? onBack() : setStep((prev) => prev - 1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </MetallicButton>
          
          <MetallicButton
            variant="primary"
            onClick={() => {
              if (step === steps.length - 1) {
                onComplete();
              } else {
                if (step === 0 && !journeyData.goal.trim()) {
                  alert('Please enter your goal before continuing.');
                  return;
                }
                setStep((prev) => prev + 1);
              }
            }}
          >
            {step === steps.length - 1 ? 'Continue to Beliefs' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </MetallicButton>
        </div>
      </div>
    </MetallicCard>
  );
}
