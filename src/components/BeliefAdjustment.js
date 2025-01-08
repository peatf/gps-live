import React, { useState, useEffect } from 'react';
// UI components via alias:
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import { Alert, AlertDescription } from '@/components/Alert/Alert';
import { Slider } from '@/components/Slider/Slider';

// Icons from lucide-react
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

/**
 * BeliefAdjustment
 *
 * Props:
 * - journeyData (object): includes fields like { goal, ... } if you want to read them
 * - setJourneyData (function): if you want to update global data here
 * - onContinue (function): called when user is ready to move on
 */
export default function BeliefAdjustment({ journeyData, setJourneyData, onContinue }) {
  // A "journeyScale" that affects how far the user can move the slider
  const [journeyScale, setJourneyScale] = useState(100);

  // Track the user’s current position along the alphabet
  const [currentPosition, setCurrentPosition] = useState(0);
  // “W” position in the alphabet is index 22 → but we scale it if needed
  const [targetPosition] = useState(22);

  // For Claude-based suggestions, we keep an "adjustedGoal"
  // If your global journeyData already has a "goal," you could read or update it here
  const [adjustedGoal, setAdjustedGoal] = useState(journeyData?.goal || '');

  // We'll store the AI response text here
  const [aiResponse, setAiResponse] = useState('');

  // A small alphabet array for the “visual journey map”
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // --- AI CALL EXAMPLE ---
  // By default, let's call AI once on mount just to show how:
  useEffect(() => {
    // callAI();
  }, []);

  /**
   * callAI:
   * Submits the entire journeyData (plus any local state) to /api/ai.
   * The server responds with AI suggestions, stored in aiResponse.
   */
  const callAI = async () => {
    try {
      // You could combine local BeliefAdjustment state with journeyData:
      const payload = {
        ...journeyData,
        scale: journeyScale,
        currentPos: currentPosition,
        message: 'BeliefAdjustment requesting AI suggestions',
      };

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journeyData: payload }),
      });
      const data = await res.json();
      setAiResponse(data.message || 'No AI response.');
    } catch (error) {
      console.error('AI call failed:', error);
      setAiResponse('Error calling AI.');
    }
  };

  /**
   * getGoalAdjustment:
   * Generate local suggestions (from the old "Claude" snippet) based on journeyScale.
   */
  const getGoalAdjustment = (scale) => {
    const adjustments = {
      90: "Instead of 'I want to triple my revenue', try 'I want to welcome steady growth that feels aligned'",
      80: "Shift from 'I must hit this target' to 'I'm open to receiving progress at a comfortable pace'",
      70: "Consider 'I'm building my capacity step by step' rather than 'I need immediate results'",
      60: "Try 'I'm learning to expand gradually' instead of pushing for instant transformation",
      50: "How about 'I welcome small, consistent steps forward that feel safe in my body'?",
      40: "Consider 'I'm creating a gentle foundation for growth at my own pace'",
      30: "Try 'I'm allowing myself to start exactly where I am'",
      20: "Shift to 'I celebrate each tiny movement forward'",
      10: "Focus on 'I'm taking one small, comfortable step at a time'",
    };

    const nearestTen = Math.floor(scale / 10) * 10;
    return adjustments[nearestTen] || 'Try making a small, safe adjustment to your goal.';
  };

  /**
   * getScaledPosition:
   * The alphabet index is scaled by journeyScale. So if the scale is 100, everything is full length (26 letters).
   * If scale is 50, you only show half as far, etc.
   */
  const getScaledPosition = (position) => {
    return Math.round((position * journeyScale) / 100);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Belief Adjustment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Show AI response at top, if present */}
        {aiResponse && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertDescription>
              <p className="font-medium mb-2">AI Suggestion:</p>
              <p>{aiResponse}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {/* 1) Journey Scale */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Journey Scale</span>
              <span className="text-sm text-gray-500">{journeyScale}%</span>
            </div>
            <Slider
              value={[journeyScale]}
              min={10}
              max={100}
              step={10}
              onValueChange={(value) => setJourneyScale(value[0])}
              className="w-full"
            />

            {/* Claude-based local "goal adjustment" suggestion */}
            {journeyScale < 100 && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription>
                  <p className="font-medium mb-2">Suggested Goal Adjustment:</p>
                  <p>{getGoalAdjustment(journeyScale)}</p>
                  <p className="mt-2 text-sm text-blue-600">
                    Take a breath. Does this reframing feel more possible in your body?
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* 2) Visual Journey Map */}
          <div className="p-6 bg-gray-50 rounded-lg space-y-6">
            {/* The scaled alphabet */}
            <div className="flex justify-between text-sm text-gray-600">
              {alphabet.slice(0, getScaledPosition(26)).map((letter, index) => (
                <span
                  key={letter}
                  className={`transition-all ${
                    index === getScaledPosition(targetPosition)
                      ? 'text-purple-600 font-bold transform scale-110'
                      : index === currentPosition
                      ? 'text-blue-600 font-bold'
                      : ''
                  }`}
                >
                  {letter}
                </span>
              ))}
            </div>

            {/* Current Position Slider */}
            <div className="space-y-2">
              <label className="text-sm text-gray-500">Current Position</label>
              <Slider
                value={[currentPosition]}
                min={0}
                max={getScaledPosition(25)}
                step={1}
                onValueChange={(value) => setCurrentPosition(value[0])}
                className="w-full"
              />
            </div>
          </div>

          {/* 3) If user can't reach "W" yet, suggest reducing the scale */}
          {currentPosition < getScaledPosition(22) && (
            <div className="p-4 bg-green-50 rounded-lg space-y-4">
              <p className="text-sm font-medium">
                I notice you're at position {alphabet[currentPosition] || 'A'}.
                Let's try scaling the journey down by 10% to see if that helps you reach further.
              </p>
              <Button
                onClick={() => setJourneyScale(Math.max(10, journeyScale - 10))}
                className="w-full"
              >
                Reduce Journey Scale by 10%
              </Button>
            </div>
          )}

          {/* 4) Success: if user reached W or beyond */}
          {currentPosition >= getScaledPosition(22) && (
            <Alert className="bg-green-50 border-green-200">
              <Sparkles className="w-4 h-4 text-green-600" />
              <AlertDescription>
                <p>Beautiful! You've found a scale that allows you to reach beyond W.</p>
                <p className="mt-2">
                  Your adjusted goal might look like:{' '}
                  <span className="font-medium">{getGoalAdjustment(journeyScale)}</span>
                </p>
                <p className="mt-2">How does this adjusted journey feel in your body?</p>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* 5) Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Map
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={onContinue}
            disabled={currentPosition < getScaledPosition(22)}
          >
            Continue to Alignment
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
