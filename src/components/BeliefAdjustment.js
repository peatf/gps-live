import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Alert, AlertDescription } from './Alert/Alert';
import { Slider } from './Slider/Slider';

export default function ProximityMapping({ journeyData, setJourneyData, onContinue, onBack }) {
  const [goalScale, setGoalScale] = useState(100);
  const [letterPosition, setLetterPosition] = useState(0);
  const [celebrationTriggered, setCelebrationTriggered] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Debounced AI request logic
  const requestAISuggestions = useCallback(
    async (scale, letter) => {
      if (letter === 22) {
        // Stop AI requests when reaching W
        setAiResponse('');
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            journeyData: {
              ...journeyData,
              scale,
              letterPosition: letter,
              message: `The user's goal "${journeyData.goal}" needs adjustment. Scale: ${scale}%. Current position: letter ${alphabet[letter]}. Provide a suggestion for goal scaling and adjustment.`,
            },
          }),
        });

        if (!response.ok) throw new Error('AI response error');
        const data = await response.json();
        setAiResponse(data.message || 'Analyzing your journey...');
      } catch (error) {
        setError('Unable to get suggestions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [journeyData, alphabet]
  );

  // Handle scale slider changes
  const handleScaleChange = (value) => {
    setGoalScale(value[0]);
    if (letterPosition < 22) {
      requestAISuggestions(value[0], letterPosition);
    }
  };

  // Handle letter slider changes
  const handleLetterChange = (value) => {
    const newPosition = value[0];
    setLetterPosition(newPosition);

    if (newPosition === 22) {
      // Trigger celebration on W
      setCelebrationTriggered(true);
      setAiResponse('');
    } else {
      setCelebrationTriggered(false);
      requestAISuggestions(goalScale, newPosition);
    }
  };

  // Sync journey data
  useEffect(() => {
    setJourneyData((prev) => ({
      ...prev,
      scale: goalScale,
      letterPosition,
    }));
  }, [goalScale, letterPosition, setJourneyData]);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardHeader>
        <CardTitle>Proximity Mapping</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Intro Text */}
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription>
            {celebrationTriggered
              ? "Congratulations! You've reached letter W. Your goal is well-aligned and ready to move forward!"
              : `You are currently at letter ${alphabet[letterPosition]}. ${
                  goalScale === 100
                    ? 'Consider refining your alignment for better clarity.'
                    : 'Adjust the scale of your goal to align better with your desired outcome.'
                }`}
          </AlertDescription>
        </Alert>

        {/* Scale Adjustment */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Adjust Goal Scope</span>
            <span className="text-sm text-gray-500">{goalScale}%</span>
          </div>
          <Slider
            value={[goalScale]}
            min={10}
            max={100}
            step={10}
            onValueChange={handleScaleChange}
            className="w-full"
          />
        </div>

        {/* Letter Position Slider */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            {alphabet.slice(0, Math.floor((26 * goalScale) / 100)).map((letter, index) => (
              <span
                key={letter}
                className={index === letterPosition ? 'text-blue-600 font-bold' : ''}
              >
                {letter}
              </span>
            ))}
          </div>
          <Slider
            value={[letterPosition]}
            min={0}
            max={Math.floor((25 * goalScale) / 100)}
            step={1}
            onValueChange={handleLetterChange}
            className="w-full"
          />
        </div>

        {/* AI Response */}
        {!celebrationTriggered && aiResponse && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription>{aiResponse}</AlertDescription>
          </Alert>
        )}

        {/* Loading and Error States */}
        {isLoading && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>Loading suggestions...</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
