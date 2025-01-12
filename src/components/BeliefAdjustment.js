import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Alert, AlertDescription } from './Alert/Alert';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Slider } from './Slider/Slider';
import debounce from 'lodash/debounce';

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

  // Debounced Fetch Proximity Advice
  const fetchProximityAdvice = useCallback(
    debounce(async (scale) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            journeyData: {
              ...journeyData,
              type: 'ProximityMapping',
              scale: scale,
              message: `Provide advice for a goal scaled to ${scale}% of the original scope.`,
            },
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch proximity advice');

        const data = await response.json();
        setJourneyData((prev) => ({
          ...prev,
          latestProximityAdvice: data.message,
          previousLetterPosition: letterPosition, // Save last fetched position
        }));
        setAiResponse(data.message || 'Analyzing your journey...');
      } catch (error) {
        setError('Unable to fetch proximity advice. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [journeyData, letterPosition, setJourneyData]
  );


  const handleScaleChange = (value) => {
    const newScale = value[0];
    setGoalScale(newScale);
    // Only fetch advice if we're not in celebration mode
    if (!celebrationTriggered) {
      fetchProximityAdvice(newScale);
    }
};

      if (!response.ok) throw new Error('AI response error');

      const data = await response.json();
      setAiResponse(data.message || 'Analyzing your journey...');
    } catch (error) {
      setError('Unable to get suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLetterChange = (value) => {
    const newPosition = value[0];
    setLetterPosition(newPosition);

    if (journeyData.initialPosition === undefined) {
      setJourneyData((prev) => ({ ...prev, initialPosition: newPosition }));
    }

    setJourneyData((prev) => ({ ...prev, currentPosition: newPosition }));

    setCelebrationTriggered(newPosition >= 22); // "W" is position 22
  };

  return (
    <Card className="w-full max-w-4xl mx-auto backdrop-blur-sm animate-fade-in">
      <CardHeader className="border-b border-stone/10">
        <CardTitle className="text-sage">Proximity Mapping</CardTitle>
        <div className="text-earth leading-relaxed mt-2">
          This tool helps you explore where you are in your journey and what steps feel aligned. Earlier you chose a place that represents where you are on your journey to your desire; first check and see if you feel able to "stretch" where you see yourself if you’re not yet at Z.
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <Alert className="bg-cosmic/5 border-cosmic/20 scale-in">
          <AlertDescription>
            <p className="font-medium text-cosmic">Your Current Goal:</p>
            <p className="text-earth mt-2">{journeyData.goal}</p>
            <p className="text-sm text-cosmic/80 mt-2">
              Target Date: {new Date(journeyData.targetDate).toLocaleDateString()}
            </p>
          </AlertDescription>
        </Alert>

        <div className="space-y-4 fade-up">
          <p className="text-sm text-cosmic/80 italic">
            “Reduce” the scope by {goalScale}% using your imagination to see if that allows the goal to feel more achievable or approachable.
          </p>
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
        </div>

        <div className="space-y-4 fade-up">
          <div className="text-sm font-medium text-earth">
            You are currently at letter{' '}
            <span className="text-cosmic font-bold">{alphabet[letterPosition]}</span>
          </div>
          <Slider
            value={[letterPosition]}
            min={0}
            max={25} // "Z" is position 25
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
                How much does an adjusted goal allow you to move your location on the proximity slider?
              </p>
            )}
          </div>
        </div>

        {aiResponse && !celebrationTriggered && (
          <Alert className="bg-sage/5 border-sage/20 scale-in">
            <AlertDescription className="text-earth">{aiResponse}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <Alert className="bg-cosmic/5 border-cosmic/20 fade-in">
            <AlertDescription className="flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-2 border-cosmic border-t-transparent rounded-full" />
              <span className="text-cosmic">Loading suggestions...</span>
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="bg-burgundy/5 border-burgundy/20 scale-in">
            <AlertDescription className="text-burgundy">{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between pt-6 border-t border-stone/10">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-earth hover:text-cosmic transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button 
            onClick={onContinue}
            variant="primary"
            className="px-6 py-3 rounded-full"
          >
            Continue to Alignment <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
