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
    <Card className="w-full max-w-4xl mx-auto backdrop-blur-sm animate-fade-in"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(8px)" }}>
      <CardHeader className="border-b border-stone/10">
        <CardTitle className="text-sage">Proximity Mapping</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Introductory Text */}
        <Alert className="bg-sage/5 border-sage/20 fade-in">
          <AlertDescription className="space-y-4 text-earth">
            <p className="leading-relaxed">
              Imagine crossing a river, hopping from stone to stone. Each stone represents steps
              toward your goal—some are within reach, others require effort, and some demand bold
              leaps.
            </p>
            <div className="space-y-2">
              <p>This practice invites you to tune into three things:</p>
              <ul className="list-none space-y-2 pl-4">
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 rounded-full bg-cosmic"/>
                  <span>What's within your grasp? Solid, reachable, and ready for action.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 rounded-full bg-cosmic"/>
                  <span>What can you reach with a stretch? These steps push you further.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 rounded-full bg-cosmic"/>
                  <span>When are you ready to leap? Bold moves that demand trust, risk, and readiness.</span>
                </li>
              </ul>
            </div>
            <p className="italic text-sage">
              Each choice brings its own energy and rhythm to your progress.
            </p>
          </AlertDescription>
        </Alert>

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
            Reduce the scope by 10% using the slider to see if that makes the goal feel more achievable.
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
              <p>
                How much does an adjusted goal allow you to move your location on the proximity slider?
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
        <div className="flex justify-between pt-4 border-t border-stone/10">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="text-earth hover:text-cosmic transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button 
            onClick={onContinue}
            className="bg-cosmic text-white hover:bg-cosmic-light transition-colors"
          >
            Continue to Alignment <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
