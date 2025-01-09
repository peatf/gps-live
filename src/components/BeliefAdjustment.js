import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Alert, AlertDescription } from './Alert/Alert';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Slider } from './Slider/Slider';

export default function ProximityMapping({ journeyData, setJourneyData, onContinue, onBack }) {
  const [goalScale, setGoalScale] = useState(100);
  const [letterPosition, setLetterPosition] = useState(journeyData.letterPosition || 0);
  const [celebrationTriggered, setCelebrationTriggered] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Fetch AI suggestions
  const requestAISuggestions = useCallback(async (scale, letter) => {
    if (letter === 22) return; // Stop AI requests at letter W
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
            message: `The user's goal "${journeyData.goal}" needs adjustment. Scale: ${scale}%. Current position: letter ${alphabet[letter]}.`,
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
  }, [journeyData, alphabet]);

  // Handle scale slider changes
  const handleScaleChange = (value) => {
    setGoalScale(value[0]);
    if (letterPosition < 22) requestAISuggestions(value[0], letterPosition);
  };

  // Handle letter slider changes
  const handleLetterChange = (value) => {
    const newPosition = value[0];
    setLetterPosition(newPosition);

    if (newPosition === 22) {
      setCelebrationTriggered(true);
      setAiResponse('');
    } else {
      setCelebrationTriggered(false);
      requestAISuggestions(goalScale, newPosition);
    }
  };

  // Initialize letterPosition from journeyData
  useEffect(() => {
    setLetterPosition(journeyData.letterPosition || 0);
  }, [journeyData.letterPosition]);

  // Sync journey data with changes
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
        {/* Introductory Text */}
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="space-y-4">
            <p>
              Honesty is your anchor, especially in this experience. Imagine crossing a river, hopping
              from stone to stone. Each stone represents your steps—some are close, some require a stretch,
              and others demand bold leaps.
            </p>
            <p>
              Tune into three things: What’s within your grasp? What requires a stretch? And when are you
              ready to leap? This practice invites you to align your rhythm—step, stretch, or leap.
            </p>
          </AlertDescription>
        </Alert>

        {/* Goal Summary */}
        <Alert className="bg-purple-50 border-purple-200">
          <AlertDescription className="space-y-2">
            <p className="font-medium">Your Current Goal:</p>
            <p className="text-purple-800">{journeyData.goal}</p>
            <p className="text-sm text-purple-600 mt-2">
              Target Date: {new Date(journeyData.targetDate).toLocaleDateString()}
            </p>
          </AlertDescription>
        </Alert>

        {/* Scale Adjustment */}
        <div className="space-y-4">
          <div className="text-sm font-medium">
            Adjust Goal Scope: <span className="text-gray-500">{goalScale}%</span>
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

        {/* Letter Position */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            {alphabet.map((letter, index) => (
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
            max={25}
            step={1}
            onValueChange={handleLetterChange}
            className="w-full"
          />
        </div>

        {/* AI Response or Celebration */}
        {celebrationTriggered ? (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription>Congratulations! You've reached letter W—your goal is ready to soar!</AlertDescription>
          </Alert>
        ) : (
          aiResponse && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription>{aiResponse}</AlertDescription>
            </Alert>
          )
        )}

        {/* Loading/Error */}
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

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button onClick={onContinue}>
            Continue to Alignment <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
