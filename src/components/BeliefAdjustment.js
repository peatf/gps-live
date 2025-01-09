import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Alert, AlertDescription } from './Alert/Alert';
import { Heart, Sparkles, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Slider } from './Slider/Slider';
import debounce from 'lodash/debounce';

export default function ProximityMapping({ journeyData, setJourneyData, onContinue, onBack }) {
  const [goalScale, setGoalScale] = useState(100);
  const [letterPosition, setLetterPosition] = useState(0);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const requestAISuggestions = useCallback(
    debounce(async (scale, letter) => {
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
              message: `The user's goal "${journeyData.goal}" needs adjustment. Scale: ${scale}%.\nCurrent position: letter ${alphabet[letter]}.\nProvide a clear, specific suggestion to make the goal more manageable while preserving its essence.`,
            },
          }),
        });

        if (!response.ok) throw new Error('AI response error');
        const data = await response.json();
        setAiResponse(data.message || 'Analyzing your journey...');
      } catch (error) {
        console.error('AI call failed:', error);
        setError('Unable to get suggestions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 1000),
    [journeyData, alphabet]
  );

  const handleScaleChange = useCallback((value) => {
    setGoalScale(value[0]);
    requestAISuggestions(value[0], letterPosition);
  }, [letterPosition, requestAISuggestions]);

  const handleLetterChange = useCallback((value) => {
    setLetterPosition(value[0]);
    requestAISuggestions(goalScale, value[0]);
  }, [goalScale, requestAISuggestions]);

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
          <AlertDescription className="space-y-4">
            <p>
              Honesty is your anchor, especially in this experience. We’re looking for real answers,
              not perfect ones. Take a moment to reflect: where are you standing in relation to your
              goal? Imagine crossing a river, hopping from stone to stone. Some stones are close and
              steady, easy to land on. Others are a stretch, requiring a bit more reach. And then
              there are the leaps, those edgy moments when you feel ready to propel yourself
              forward, trusting the momentum.
            </p>
            <p>
              This practice of proximity mapping asks you to tune into three things:
              <ul className="list-disc list-inside">
                <li>What’s already within your grasp? Solid, reachable, and ready for action.</li>
                <li>
                  What can you reach with a stretch? These steps push you further, requiring
                  intention and effort, but they can accelerate your progress.
                </li>
                <li>
                  When are you ready to leap? Bold moves that demand trust, risk, and readiness, but
                  can catapult you further than imagined.
                </li>
              </ul>
              The rhythm is yours to set—step, stretch, or leap. Each choice brings its own energy
              and flow to your progress.
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
          <div className="text-sm text-gray-700 font-medium">
            You are currently at letter <span className="text-blue-600">{alphabet[letterPosition]}</span>. Adjust the scope of your goal.
          </div>
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
          <div className="text-sm text-gray-500">Reduce the scope by 10% using the slider to see if this makes the goal feel more achievable.</div>
        </div>

        {/* Current Position */}
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
        {!isLoading && !error && aiResponse && (
          <>
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Suggested Adjustment:</span>
                </div>
                <p>{aiResponse}</p>
              </AlertDescription>
            </Alert>
            <div className="text-sm text-gray-700">
              How much does this adjusted goal allow you to move on the proximity slider?
            </div>
          </>
        )}

        {/* Loading State */}
        {isLoading && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span>Analyzing your journey...</span>
            </AlertDescription>
          </Alert>
        )}

        {/* Error State */}
        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={onContinue}
          >
            Continue to Alignment
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
