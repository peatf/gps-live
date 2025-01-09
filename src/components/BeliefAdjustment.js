import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Alert, AlertDescription } from './Alert/Alert';
import { Slider } from './Slider/Slider';
import { ArrowRight, ArrowLeft, Sparkles, AlertTriangle } from 'lucide-react';

export default function BeliefAdjustment({ journeyData, setJourneyData, onContinue, onBack }) {
  const [journeyScale, setJourneyScale] = useState(100);
  const [proximityLevel, setProximityLevel] = useState(0);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Call AI for suggestions
  const requestAISuggestions = useCallback(async (scale, proximity) => {
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
            proximityLevel: proximity,
            message: `Based on the user's comfort level of ${scale}% and current proximity at letter ${alphabet[proximity]}, 
                     suggest adjustments to their goal: "${journeyData.goal}"`
          }
        }),
      });

      if (!response.ok) {
        throw new Error('AI response error');
      }

      const data = await response.json();
      setAiResponse(data.message || 'Analyzing your journey...');
    } catch (error) {
      console.error('AI call failed:', error);
      setError('Unable to get AI suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [journeyData, alphabet]);

  // Handle scale changes with AI feedback
  const handleScaleChange = useCallback((value) => {
    setJourneyScale(value[0]);
    requestAISuggestions(value[0], proximityLevel);
  }, [proximityLevel, requestAISuggestions]);

  // Handle proximity changes with AI feedback
  const handleProximityChange = useCallback((value) => {
    setProximityLevel(value[0]);
    requestAISuggestions(journeyScale, value[0]);
  }, [journeyScale, requestAISuggestions]);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardHeader>
        <CardTitle>Belief Adjustment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

        <div className="space-y-8">
          {/* Journey Scale */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Comfort Level with Goal</span>
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
            <Alert className="bg-blue-50 border-blue-200 mb-4">
              <AlertDescription>
                If Z represents where you want to be, how close do you feel to that experience?
              </AlertDescription>
            </Alert>

            <div className="flex justify-between text-sm text-gray-600">
              {alphabet.slice(0, Math.floor((26 * journeyScale) / 100)).map((letter, index) => (
                <span
                  key={letter}
                  className={`transition-all ${
                    index === proximityLevel
                      ? 'text-blue-600 font-bold transform scale-110'
                      : ''
                  }`}
                >
                  {letter}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Current Proximity to Goal</label>
              <Slider
                value={[proximityLevel]}
                min={0}
                max={Math.floor((25 * journeyScale) / 100)}
                step={1}
                onValueChange={handleProximityChange}
                className="w-full"
              />
            </div>
          </div>

          {/* AI Response */}
          {aiResponse && !error && !isLoading && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Suggested Adjustment:</span>
                </div>
                <p>{aiResponse}</p>
              </AlertDescription>
            </Alert>
          )}
        </div>

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
            disabled={proximityLevel < Math.floor((22 * journeyScale) / 100)}
          >
            Continue to Alignment
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
