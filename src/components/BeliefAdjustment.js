import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Alert, AlertDescription } from './Alert/Alert';
import { Slider } from './Slider/Slider';
import { ArrowRight, ArrowLeft, Sparkles, AlertTriangle, Heart } from 'lucide-react';
import debounce from 'lodash/debounce';

export default function BeliefAdjustment({ journeyData, setJourneyData, onContinue, onBack }) {
  const [goalScale, setGoalScale] = useState(100);
  const [letterPosition, setLetterPosition] = useState(0);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSensations] = useState(journeyData.selectedSensations || []);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Get AI suggestions based on scale - debounced
  const requestAISuggestions = useCallback(async (scale, letter) => {
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
            message: `The user's goal "${journeyData.goal}" needs adjustment. Scale: ${scale}%.
                     Current position: letter ${alphabet[letter]}.
                     Consider their felt sensations: ${selectedSensations.join(', ')}.
                     Provide a clear, specific suggestion to make the goal more manageable 
                     while preserving its essence.`
          }
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
  }, [journeyData, alphabet, selectedSensations]);

  // Debounced handlers
  const debouncedScaleUpdate = useCallback(
    debounce((scale, letter) => {
      requestAISuggestions(scale, letter);
    }, 800),
    [requestAISuggestions]
  );

  const debouncedLetterUpdate = useCallback(
    debounce((scale, letter) => {
      requestAISuggestions(scale, letter);
    }, 800),
    [requestAISuggestions]
  );

  // Handle scale changes
  const handleScaleChange = (value) => {
    setGoalScale(value[0]);
    debouncedScaleUpdate(value[0], letterPosition);
  };

  // Handle letter position changes
  const handleLetterChange = (value) => {
    setLetterPosition(value[0]);
    debouncedLetterUpdate(goalScale, value[0]);
  };

  // Rest of the component remains the same...
  // [Previous return statement and JSX remains unchanged]
  
  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardHeader>
        <CardTitle>Adjusting Your Goal's Scale</CardTitle>
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

        {/* Body Awareness Reminder */}
        {selectedSensations.length > 0 && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-blue-600" />
                <p className="font-medium">Your Body's Wisdom:</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSensations.map((sensation, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {sensation}
                  </span>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Scale Adjustment */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Reduce Goal Scale</span>
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
          
          {/* AI Suggestion directly under scale slider */}
          {!isLoading && !error && aiResponse && (
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

        {/* Current Position on Journey */}
        <div className="p-6 bg-gray-50 rounded-lg space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>
              Where are you now in relationship to your adjusted goal?
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              {alphabet.slice(0, Math.floor((26 * goalScale) / 100)).map((letter, index) => (
                <span
                  key={letter}
                  className={`transition-all ${
                    index === letterPosition
                      ? 'text-blue-600 font-bold transform scale-110'
                      : ''
                  }`}
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
        </div>

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
            disabled={letterPosition < Math.floor((22 * goalScale) / 100)}
          >
            Continue to Alignment
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
