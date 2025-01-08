import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Alert, AlertDescription } from './Alert/Alert';
import { Slider } from './Slider/Slider';
import { ArrowRight, ArrowLeft, Sparkles, AlertTriangle } from 'lucide-react';

export default function BeliefAdjustment({ journeyData, setJourneyData, onContinue }) {
  const [journeyScale, setJourneyScale] = useState(100);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [targetPosition] = useState(22); // 'W' in the alphabet
  const [adjustedGoal, setAdjustedGoal] = useState(journeyData?.goal || '');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Debounced AI call function
  const debouncedCallAI = useCallback(
    async (scale, position) => {
      setIsLoading(true);
      setError(null);
      try {
        const payload = {
          ...journeyData,
          scale,
          currentPos: position,
          message: `Based on the user's journey scale of ${scale}% and current position at letter ${alphabet[position]}, 
                   provide a suggestion for adjusting their goal: "${journeyData.goal}"`
        };

        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ journeyData: payload }),
        });

        if (!res.ok) {
          throw new Error('AI response error: ' + res.statusText);
        }

        const data = await res.json();
        setAiResponse(data.message || 'Analyzing your journey...');
        
        // Update adjusted goal based on AI response
        if (data.message) {
          setAdjustedGoal(data.message.split('"').filter(str => str.length > 10)[0] || adjustedGoal);
        }
      } catch (error) {
        console.error('AI call failed:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [journeyData, adjustedGoal, alphabet]
  );

  // Handle scale changes with AI feedback
  const handleScaleChange = useCallback((value) => {
    setJourneyScale(value[0]);
    debouncedCallAI(value[0], currentPosition);
  }, [currentPosition, debouncedCallAI]);

  // Handle position changes with AI feedback
  const handlePositionChange = useCallback((value) => {
    setCurrentPosition(value[0]);
    debouncedCallAI(journeyScale, value[0]);
  }, [journeyScale, debouncedCallAI]);

  // Get scaled position helper
  const getScaledPosition = (position) => Math.round((position * journeyScale) / 100);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Belief Adjustment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
              <span>Error: {error}</span>
            </AlertDescription>
          </Alert>
        )}

        {/* AI Response */}
        {aiResponse && !error && !isLoading && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="space-y-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-green-600" />
                <span className="font-medium">AI Suggestion:</span>
              </div>
              <p>{aiResponse}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {/* Journey Scale */}
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
              onValueChange={handleScaleChange}
              className="w-full"
            />
          </div>

          {/* Visual Journey Map */}
          <div className="p-6 bg-gray-50 rounded-lg space-y-6">
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

            <div className="space-y-2">
              <label className="text-sm text-gray-500">Current Position</label>
              <Slider
                value={[currentPosition]}
                min={0}
                max={getScaledPosition(25)}
                step={1}
                onValueChange={handlePositionChange}
                className="w-full"
              />
            </div>
          </div>

          {/* Navigation */}
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
        </div>
      </CardContent>
    </Card>
  );
}
