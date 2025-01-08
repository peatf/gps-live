import React, { useState } from 'react';

// Adjust these import paths if needed (depending on how you export in each file)
import { Card, CardHeader, CardTitle, CardContent } from '../Card/Card';
import { Button } from '../Button/Button';
import { Slider } from '../Slider/Slider';
import { Alert, AlertDescription } from '../Alert/Alert';

// Icons from lucide-react (make sure you've installed the package)
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

const BeliefAdjustment = ({ onContinue, initialGoal }) => {
  const [journeyScale, setJourneyScale] = useState(100);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [targetPosition, setTargetPosition] = useState(22); // 'W' position
  const [showSomaticPrompt, setShowSomaticPrompt] = useState(false);
  const [adjustedGoal, setAdjustedGoal] = useState(initialGoal);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Calculate scaled positions
  const getScaledPosition = (position) => {
    return Math.round((position * journeyScale) / 100);
  };

  // Generate goal adjustment suggestions based on scale
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

    // e.g., if scale=75, floor to 70
    const nearestTen = Math.floor(scale / 10) * 10;
    return adjustments[nearestTen] || "Try making a small, safe adjustment to your goal.";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Adjusting Your Journey</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
                setShowSomaticPrompt(true);
              }}
              className="w-full"
            />

            {/* Goal Adjustment Suggestion */}
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
              <label className="text-sm text-gray-500">
                Push your piece as far as it'll go and stick
              </label>
              <Slider
                value={[currentPosition]}
                min={0}
                max={getScaledPosition(25)}
                step={1}
                onValueChange={(value) => {
                  setCurrentPosition(value[0]);
                  if (value[0] < getScaledPosition(22)) {
                    setShowSomaticPrompt(true);
                  }
                }}
                className="w-full"
              />
            </div>
          </div>

          {/* Adjustment Prompts */}
          {currentPosition < getScaledPosition(22) && (
            <div className="p-4 bg-green-50 rounded-lg space-y-4">
              <p className="text-sm font-medium">
                I notice you're at position {alphabet[currentPosition]}. 
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

          {/* Success State */}
          {currentPosition >= getScaledPosition(22) && (
            <Alert className="bg-green-50 border-green-200">
              <Sparkles className="w-4 h-4 text-green-600" />
              <AlertDescription>
                <p>
                  Beautiful! You've found a scale that allows you to reach beyond W.
                </p>
                <p className="mt-2">
                  Your adjusted goal might look like:{' '}
                  <span className="font-medium">
                    {getGoalAdjustment(journeyScale)}
                  </span>
                </p>
                <p className="mt-2">
                  How does this adjusted journey feel in your body?
                </p>
              </AlertDescription>
            </Alert>
          )}
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
      </CardContent>
    </Card>
  );
};

export default BeliefAdjustment;

