import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Alert, AlertDescription } from './Alert/Alert';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Slider } from './Slider/Slider';

export default function ProximityMapping({ journeyData, setJourneyData, onContinue, onBack }) {
  // State initialization
  const [goalScale, setGoalScale] = useState(100);
  const [letterPosition, setLetterPosition] = useState(journeyData.letterPosition || 0);
  const [aiResponse, setAiResponse] = useState('');
  const [celebrationTriggered, setCelebrationTriggered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Update letterPosition when journeyData updates
  useEffect(() => {
    if (journeyData.letterPosition !== undefined) {
      setLetterPosition(journeyData.letterPosition);
    }
  }, [journeyData.letterPosition]);

  // Handle scope slider changes
  const handleScaleChange = async (value) => {
    setGoalScale(value[0]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journeyData: {
            ...journeyData,
            scale: value[0],
            message: `The user's goal "${journeyData.goal}" involves achieving ${value[0]}% scope. Provide specific feedback on refining the goal's complexity and size.`,
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

    // Trigger celebration if letterPosition is W
    if (letterPosition === 22) {
      setCelebrationTriggered(true);
      setAiResponse('Congratulations! Your goal is now within reach and aligned with your vision.');
    }
  };

  // Handle letter slider changes
  const handleLetterChange = (value) => {
    const newPosition = value[0];
    setLetterPosition(newPosition);

    if (newPosition === 22) {
      setCelebrationTriggered(true);
    } else {
      setCelebrationTriggered(false);
    }
  };

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
              Imagine crossing a river, hopping from stone to stone. Each stone represents steps
              toward your goal—some are within reach, others require effort, and some demand bold
              leaps.
            </p>
            <p>
              This practice invites you to tune into three things:
              <ul className="list-disc list-inside">
                <li>What’s within your grasp? Solid, reachable, and ready for action.</li>
                <li>What can you reach with a stretch? These steps push you further.</li>
                <li>
                  When are you ready to leap? Bold moves that demand trust, risk, and readiness.
                </li>
              </ul>
              Each choice brings its own energy and rhythm to your progress.
            </p>
          </AlertDescription>
        </Alert>

        {/* Goal Summary */}
        <Alert className="bg-purple-50 border-purple-200">
          <AlertDescription>
            <p className="font-medium">Your Current Goal:</p>
            <p className="text-purple-800">{journeyData.goal}</p>
            <p className="text-sm text-purple-600 mt-2">
              Target Date: {new Date(journeyData.targetDate).toLocaleDateString()}
            </p>
          </AlertDescription>
        </Alert>

        {/* Scope Slider */}
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

        {/* Letter Position Slider */}
        <div className="space-y-4">
          <div className="text-sm font-medium">
            You are currently at letter{' '}
            <span className="text-blue-600 font-bold">{alphabet[letterPosition]}</span>.
          </div>
          <Slider
            value={[letterPosition]}
            min={0}
            max={25}
            step={1}
            onValueChange={handleLetterChange}
            className="w-full"
          />
          <div className="text-sm text-gray-500">
            {celebrationTriggered
              ? 'Congratulations! Your goal is now within reach and aligned with your vision. Focus on clarity and execution to bring it to life.'
              : 'You\'re making progress. Adjust the scope of your goal to refine and align your goal further. You can use the Scope Adjustment slider for some suggestions.'}
          </div>
        </div>

        {/* AI Response */}
        {aiResponse && !celebrationTriggered && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription>{aiResponse}</AlertDescription>
          </Alert>
        )}

        {/* Loading/Error States */}
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
