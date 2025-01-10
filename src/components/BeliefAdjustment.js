import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Alert, AlertDescription } from './Alert/Alert';
import { ArrowRight, ArrowLeft, Sparkles, Map, Heart } from 'lucide-react';
import { Slider } from './Slider/Slider';
import { TypewriterText } from './DesignSystem';

export default function BeliefAdjustment({ journeyData, setJourneyData, onContinue, onBack }) {
  const [goalScale, setGoalScale] = useState(100);
  const [letterPosition, setLetterPosition] = useState(journeyData.currentPosition || 0);
  const [aiResponse, setAiResponse] = useState('');
  const [celebrationTriggered, setCelebrationTriggered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [showExplanation, setShowExplanation] = useState(true);

  // Reset handlers
  useEffect(() => {
    if (journeyData.currentPosition !== undefined) {
      setLetterPosition(journeyData.currentPosition);
    }
  }, [journeyData.currentPosition]);

  // Scale change handler with AI feedback
  const handleScaleChange = useCallback(async (value) => {
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

      // Check for celebration trigger
      if (letterPosition === 22) {
        setCelebrationTriggered(true);
        setAiResponse('Congratulations! Your goal is now within reach and aligned with your vision.');
      }
    } catch (error) {
      setError('Unable to get suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [journeyData, letterPosition]);

  // Position change handler
  const handleLetterChange = useCallback((value) => {
    const newPosition = value[0];
    setLetterPosition(newPosition);
    setCelebrationTriggered(newPosition === 22);

    // Update journey data
    setJourneyData(prev => ({
      ...prev,
      currentPosition: newPosition,
    }));
  }, [setJourneyData]);

  // Update journey data when scale changes
  useEffect(() => {
    setJourneyData(prev => ({
      ...prev,
      scale: goalScale,
      currentPosition: letterPosition,
    }));
  }, [goalScale, letterPosition, setJourneyData]);

  return (
    <Card className="w-full max-w-4xl mx-auto glass-effect animate-fade-in">
      <CardHeader className="border-b border-stone/10">
        <CardTitle className="flex items-center gap-2">
          <Map className="w-5 h-5 text-cosmic" />
          <span className="text-sage">Proximity Mapping</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {showExplanation && (
          <Alert className="glass-effect bg-sage/5 border-sage/20">
            <AlertDescription className="space-y-4 text-earth">
              <TypewriterText>
                Imagine your goal as a journey across stepping stones. Each stone represents a milestone:
                some within easy reach, others requiring a stretch, and a few needing bold leaps.
                
                This exercise helps you identify where you are and how to progress naturally.
              </TypewriterText>
              
              <div className="space-y-2 mt-4">
                <p className="font-medium text-cosmic">Consider three types of progress:</p>
                <ul className="list-none space-y-2 pl-4">
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 rounded-full bg-cosmic"/>
                    <span>Natural steps: What feels comfortable and doable now?</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 rounded-full bg-cosmic"/>
                    <span>Growth steps: What stretches you but feels achievable?</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 rounded-full bg-cosmic"/>
                    <span>Leap steps: What requires courage and commitment?</span>
                  </li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Alert className="glass-effect bg-cosmic/5 border-cosmic/20">
          <AlertDescription>
            <p className="font-medium text-cosmic">Your Current Goal:</p>
            <p className="text-earth mt-2">{journeyData.goal}</p>
            <p className="text-sm text-cosmic/80 mt-2">
              Target Date: {new Date(journeyData.targetDate).toLocaleDateString()}
            </p>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-earth">Adjust Goal Scope</span>
            <span className="text-sm text-cosmic">{goalScale}%</span>
          </div>
          <Slider
            value={[goalScale]}
            min={10}
            max={100}
            step={10}
            onValueChange={value => handleScaleChange(value)}
            className="glass-effect"
          />
          <p className="text-sm text-cosmic/80 italic">
            Adjust the scope to find the right balance between ambition and achievability.
          </p>
        </div>

        <div className="space-y-4">
          <div className="text-sm font-medium text-earth">
            You are at letter <span className="text-cosmic font-bold">{alphabet[letterPosition]}</span>
          </div>
          <div className="flex justify-between px-1 text-xs text-earth/50">
            {alphabet.map((letter, index) => (
              <span
                key={letter}
                className={cn(
                  "transition-all",
                  index === letterPosition ? "text-cosmic scale-110 font-medium" : ""
                )}
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
            onValueChange={value => handleLetterChange(value)}
            className="glass-effect"
          />
          <p className="text-sm text-cosmic/80">
            {celebrationTriggered 
              ? "You've reached an ideal position for your goal!"
              : "How does adjusting the goal affect your position on this journey?"}
          </p>
        </div>

        {aiResponse && !celebrationTriggered && (
          <Alert className="glass-effect bg-sage/5 border-sage/20">
            <AlertDescription className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cosmic" />
                <p className="font-medium text-cosmic">Journey Insight:</p>
              </div>
              <p className="text-earth leading-relaxed">{aiResponse}</p>
            </AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <Alert className="glass-effect bg-cosmic/5 border-cosmic/20">
            <AlertDescription className="flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-2 border-cosmic border-t-transparent rounded-full"/>
              <span className="text-cosmic">Analyzing your journey...</span>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="glass-effect bg-burgundy/5 border-burgundy/20">
            <AlertDescription className="flex items-center space-x-2 text-burgundy">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between pt-4 border-t border-stone/10">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="glass-effect text-earth hover:text-cosmic transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={onContinue}
            className="glass-effect bg-cosmic/90 text-white hover:bg-cosmic"
          >
            Continue to Alignment
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
