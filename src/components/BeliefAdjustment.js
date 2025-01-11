// src/components/BeliefAdjustment.js
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Alert, AlertDescription } from './Alert/Alert';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Slider } from './Slider/Slider';

export default function ProximityMapping({ journeyData, setJourneyData, onContinue, onBack }) {
  const [goalScale, setGoalScale] = useState(100);
  const [letterPosition, setLetterPosition] = useState(journeyData.currentPosition || 0);
  const [aiResponse, setAiResponse] = useState('');
  const [celebrationTriggered, setCelebrationTriggered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    if (journeyData.currentPosition !== undefined) {
      setLetterPosition(journeyData.currentPosition);
    }
  }, [journeyData.currentPosition]);

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

    if (letterPosition === 22) {
      setCelebrationTriggered(true);
      setAiResponse('Congratulations! Your goal is now within reach and aligned with your vision.');
    }
  };

  const handleLetterChange = (value) => {
    const newPosition = value[0];
    setLetterPosition(newPosition);
    setCelebrationTriggered(newPosition === 22);
  };

  useEffect(() => {
    setJourneyData((prev) => ({
      ...prev,
      scale: goalScale,
      currentPosition: letterPosition,
    }));
  }, [goalScale, letterPosition, setJourneyData]);

  return (
    <Card
      className="w-full max-w-4xl mx-auto backdrop-blur-sm animate-fade-in"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.01)", // Translucent background
        backdropFilter: "blur(8px)", // Blur effect
        WebkitBackdropFilter: "blur(8px)", // Safari-specific
      }}
    >
      <CardHeader className="border-b border-stone/10">
        <CardTitle className="text-sage">The Next Step: Proximity Mapping</CardTitle>
<CardDescription className="text-earth leading-relaxed">
  Earlier, you chose a place that represents where you are on your journey to your desire. 
  First, check and see if you feel able to “stretch” where you see yourself if you’re not yet at Z.
</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">

        {/* Goal Summary */}
        <Alert className="bg-cosmic/5 border-cosmic/20 scale-in">
  <AlertDescription>
    <p className="font-medium text-cosmic">Your Current Goal:</p>
    <p className="text-earth mt-2">{journeyData.goal}</p>
    <p className="text-sm text-cosmic/80 mt-2">
      Target Date: {new Date(journeyData.targetDate).toLocaleDateString()}
    </p>
  </AlertDescription>
</Alert>

        {/* Scope Slider */}
        <div className="space-y-4 fade-up">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-earth">Adjust Goal Scope</span>
            <span className="text-sm text-dove">{goalScale}%</span>
          </div>
          <Slider
            value={[goalScale]}
            min={10}
            max={100}
            step={10}
            onValueChange={handleScaleChange}
            className="w-full"
          />
          <p className="text-sm text-cosmic/80 italic">
  "Reduce" the scope by 10% using your imagination to see if that allows the goal to feel 
  more achievable or approachable. If needed, get some suggestions for scope reduction 
  by sliding this slider.
</p>
        </div>

        {/* Letter Position Slider */}
        <div className="space-y-4 fade-up">
          <div className="text-sm font-medium text-earth">
            You are currently at letter{' '}
            <span className="text-cosmic font-bold">{alphabet[letterPosition]}</span>
          </div>
          <Slider
            value={[letterPosition]}
            min={0}
            max={25}
            step={1}
            onValueChange={handleLetterChange}
            className="w-full"
          />
          <div className="text-sm text-dove">
            {celebrationTriggered ? (
              <div className="flex items-center space-x-2 text-cosmic">
                <Sparkles className="w-4 h-4" />
                <span>Congratulations! Your goal is now within reach and aligned with your vision.</span>
              </div>
            ) : (
              <p className="text-earth">
  Earlier, you chose a place that represents where you are on your journey to your desire. 
  First, check and see if you feel able to “stretch” where you see yourself if you’re not 
  yet at Z.
</p>
            )}
          </div>
        </div>

        {/* AI Response */}
        {aiResponse && !celebrationTriggered && (
          <Alert className="bg-sage/5 border-sage/20 scale-in">
            <AlertDescription className="text-earth">{aiResponse}</AlertDescription>
          </Alert>
        )}

        {/* Loading/Error States */}
        {isLoading && (
          <Alert className="bg-cosmic/5 border-cosmic/20 fade-in">
            <AlertDescription className="flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-2 border-cosmic border-t-transparent rounded-full"/>
              <span className="text-cosmic">Loading suggestions...</span>
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="bg-burgundy/5 border-burgundy/20 scale-in">
            <AlertDescription className="text-burgundy">{error}</AlertDescription>
          </Alert>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t border-stone/10">
  <Button 
            variant="outline" 
            onClick={onBack}
            className="text-earth hover:text-cosmic transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button 
  onClick={onContinue}
  variant="primary" // Use the predefined "primary" variant
  className="px-6 py-3 rounded-full" // Ensure consistent rounded styling
>
  Continue to Alignment <ArrowRight className="w-4 h-4 ml-2" />
</Button>

</div>
      </CardContent>
    </Card>
  );
}
