import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Alert, AlertDescription } from './Alert/Alert';
import { Slider } from './Slider/Slider';
import { CheckCircle2, Sparkles, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';
import debounce from 'lodash/debounce';
import { getCategoryPrompt } from '../utils/alignmentPrompts';

export default function AlignmentAdjustment({ journeyData, setJourneyData, onComplete, onBack }) {
  const [activeCategory, setActiveCategory] = useState('safety');
  const [adjustedGoal, setAdjustedGoal] = useState(journeyData?.goal || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState({});
  const [sliderValues, setSliderValues] = useState(journeyData.likertScores || {});

  const alignmentAreas = {
    safety: "I feel safe and open to receiving this opportunity or experience",
    confidence: "I have strong belief in my abilities and trust in my capability to achieve my goals",
    anticipation: "I consistently expect and anticipate that I will receive what I work towards and desire",
    openness: "I can maintain my focus and open connection to my desired result even if it takes time",
    deserving: "I feel deserving of this experience",
    belief: "I believe this is possible for me",
    appreciation: "I feel a sense of appreciation for this area in my business as it is now. I celebrate my business regularly"
  };

  // Check if category needs adjustment
  const needsAdjustment = (category) => sliderValues[category] <= 3;

  // Append prompt to AI suggestions
  const appendPromptToResponse = (message) => {
    return `${message.trim()} Does this help you move this slider up?`;
  };

  // Request AI suggestions
  const requestAISuggestions = useCallback(
  debounce(async (category) => {
    const score = sliderValues[category];
    if (!needsAdjustment(category)) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journeyData: {
            ...journeyData,
            category,
            score,
            message: `${getCategoryPrompt(category, score, journeyData.goal)} A focus that connects you with ${category} might help.`,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch AI suggestions');

      const data = await response.json();
      const suggestion = appendPromptToResponse(
        data.message || 'Here’s a suggestion to improve your alignment.'
      );

      setAiSuggestions((prev) => ({
        ...prev,
        [category]: {
          suggestion,
          timestamp: Date.now(),
        },
      }));
    } catch (err) {
      setError('Unable to fetch suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, 1000),
  [journeyData, sliderValues]
);

  const handleSliderChange = useCallback((category, value) => {
    setSliderValues((prev) => ({
      ...prev,
      [category]: value[0],
    }));

    setJourneyData((prev) => ({
      ...prev,
      likertScores: {
        ...prev.likertScores,
        [category]: value[0],
      },
    }));
  }, [setJourneyData]);

  useEffect(() => {
    const score = sliderValues[activeCategory];
    if (score <= 3) {
      fetchAISuggestions(activeCategory);
    }
  }, [activeCategory, sliderValues, fetchAISuggestions]);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          <span>Aligning Your Goal</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-purple-50 border-purple-200">
          <AlertDescription className="space-y-2">
            <p className="font-medium">Your Current Goal:</p>
            <p className="text-purple-800">{journeyData.goal}</p>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">{alignmentAreas[activeCategory]}</span>
            <span className="text-sm text-gray-500">
              {sliderValues[activeCategory]}/5
            </span>
          </div>
          <Slider
            value={[sliderValues[activeCategory] || 1]}
            min={1}
            max={5}
            step={1}
            onValueChange={(value) => handleSliderChange(activeCategory, value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.keys(alignmentAreas).map((cat) => (
            <Button
              key={cat}
              variant={cat === activeCategory ? 'default' : 'outline'}
              onClick={() => setActiveCategory(cat)}
              className="flex items-center gap-2"
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
              {sliderValues[cat] >= 4 && (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              )}
            </Button>
          ))}
        </div>

        {sliderValues[activeCategory] >= 4 ? (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>
                Congratulations! Your {activeCategory} alignment is strong at {sliderValues[activeCategory]}/5. 
                You can explore other areas or continue if you're ready.
              </span>
            </AlertDescription>
          </Alert>
        ) : aiSuggestions[activeCategory]?.suggestions && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <p className="font-medium">Alignment Suggestion:</p>
              </div>
              <p className="text-sm">{aiSuggestions[activeCategory].suggestions}</p>
              <Button
                variant="outline"
                onClick={() => fetchAISuggestions(activeCategory)}
                className="mt-2"
              >
                Regenerate Suggestions
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span>Getting alignment suggestions...</span>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </AlertDescription>
          </Alert>
        )}

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
            onClick={() => {
              setJourneyData((prev) => ({
                ...prev,
                likertScores: sliderValues,
                adjustedGoal,
              }));
              onComplete();
            }}
          >
            Complete Journey
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
Adjustment(category)) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            journeyData: {
              ...journeyData,
              category,
              score,
              message: `${getCategoryPrompt(category, score, journeyData.goal)} A focus that connects you with ${category} might help.`,
            },
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch AI suggestions');

        const data = await response.json();
        const suggestion = appendPromptToResponse(
          data.message || 'Here’s a suggestion to improve your alignment.'
        );

        setAiSuggestions((prev) => ({
          ...prev,
          [category]: {
            suggestion,
            timestamp: Date.now(),
          },
        }));
      } catch (err) {
        setError('Unable to fetch suggestions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 1000),
    [journeyData, sliderValues]
  );

  // Handle slider value changes
  const handleSliderChange = (category, value) => {
    setSliderValues((prev) => ({
      ...prev,
      [category]: value[0],
    }));

    setJourneyData((prev) => ({
      ...prev,
      likertScores: {
        ...prev.likertScores,
        [category]: value[0],
      },
    }));

    requestAISuggestions(category);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          <span>Aligning Your Goal</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-purple-50 border-purple-200">
          <AlertDescription>Your Current Goal: {journeyData.goal}</AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>{alignmentAreas[activeCategory]}</span>
            <span>{sliderValues[activeCategory] || 1}/5</span>
          </div>
          <Slider
            value={[sliderValues[activeCategory] || 1]}
            min={1}
            max={5}
            step={1}
            onValueChange={(value) => handleSliderChange(activeCategory, value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.keys(alignmentAreas).map((cat) => (
            <Button
              key={cat}
              variant={cat === activeCategory ? 'default' : 'outline'}
              onClick={() => setActiveCategory(cat)}
              className="flex items-center gap-2"
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
              {sliderValues[cat] >= 4 && (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              )}
            </Button>
          ))}
        </div>

        {needsAdjustment(activeCategory) && aiSuggestions[activeCategory]?.suggestion && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="space-y-2">
              <p>{aiSuggestions[activeCategory].suggestion}</p>
              <Button
                variant="outline"
                onClick={() => requestAISuggestions(activeCategory)}
                className="mt-2"
              >
                Regenerate Suggestions
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {sliderValues[activeCategory] >= 4 && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription>
              <CheckCircle2 className="w-4 h-4 text-green-600 inline-block mr-2" />
              Congratulations! Your alignment for {activeCategory} is strong at {sliderValues[activeCategory]}/5.
            </AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>Fetching suggestions...</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button
            onClick={() => {
              setJourneyData((prev) => ({ ...prev, likertScores: sliderValues }));
              onComplete();
            }}
          >
            Complete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
