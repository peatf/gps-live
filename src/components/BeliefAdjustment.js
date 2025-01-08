import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import { Alert, AlertDescription } from '@/components/Alert/Alert';
import { Slider } from '@/components/Slider/Slider';

import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

const BeliefAdjustment = ({ onContinue, initialGoal }) => {
  const [journeyScale, setJourneyScale] = useState(100);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [targetPosition] = useState(22); // 'W'
  const [adjustedGoal, setAdjustedGoal] = useState(initialGoal);

  // AI-related state (if needed)
  const [aiResponse, setAiResponse] = useState('');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Example local suggestions
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
      10: "Focus on 'I'm taking one small, comfortable step at a time'"
    };
    const nearestTen = Math.floor(scale / 10) * 10;
    return adjustments[nearestTen] || "Try making a small, safe adjustment to your goal.";
  };

  // Example: Call an AI route when scale changes (optional)
  useEffect(() => {
    // callAI(journeyScale);
  }, [journeyScale]);

  const callAI = async (scale) => {
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journeyData: {
            scale,
            currentGoal: adjustedGoal,
          },
        }),
      });
      const data = await response.json();
      setAiResponse(data.message || 'No AI response.');
    } catch (error) {
      console.error('AI call failed:', error);
      setAiResponse('Error calling AI.');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Adjusting Your Journey</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* If you are using AI, display the response here */}
        {aiResponse && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertDescription>
              <p className="font-medium mb-2">AI Suggestion:</p>
              <p>{aiResponse}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {/* Journey Scale Adjustment */}
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
              onValueChange={(value) => {
                setJourneyScale(value[0]);
              }}
              className="w-full"
            />

            {/* Local suggestion for adjusting the goal */}
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

          {/* Visual Journey Map */}
          <div className="p-6 bg-gray-50 rounded-lg space-y-6">
            <div className="flex justify-between text-sm text-gray-600">
              {alphabet.slice(0, Math.round((26 * journeyScale) / 100)).map((letter, index) => (
                <span
                  key={letter}
                  className={`transition-all ${
                    index === Math.round((targetPosition * journeyScale) / 100)
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
                max={Math.round((25 * journeyScale) / 100)}
                step={1}
                onValueChange={(value) => setCurrentPosition(value[0])}
                className="w-full"
              />
            </div>
          </div>

          {/* If not reaching W yet, suggest scaling down */}
          {currentPosition < Math.round((22 * journeyScale) / 100) && (
            <div className="p-4 bg-green-50 rounded-lg space-y-4">
              <p className="text-sm font-medium">
                You’re at position {alphabet[currentPosition] || 'A'}.
                Try reducing the journey scale by 10% to see if that helps you move further.
              </p>
              <Button onClick={() => setJourneyScale(Math.max(10, journeyScale - 10))} className="w-full">
                Reduce Journey Scale by 10%
              </Button>
            </div>
          )}

          {/* Success State */}
          {currentPosition >= Math.round((22 * journeyScale) / 100) && (
            <Alert className="bg-green-50 border-green-200">
              <Sparkles className="w-4 h-4 text-green-600" />
              <AlertDescription>
                <p>Beautiful! You've found a scale that allows you to reach beyond W.</p>
                <p className="mt-2">
                  Your adjusted goal might look like: 
                  <span className="font-medium"> {getGoalAdjustment(journeyScale)}</span>
                </p>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={onContinue}
            disabled={currentPosition < Math.round((22 * journeyScale) / 100)}
          >
            Continue to Alignment
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BeliefAdjustment;
