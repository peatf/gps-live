// src/components/AlignmentAdjustment.js
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Alert, AlertDescription } from './Alert/Alert';
import { Heart, Sparkles, ArrowRight, ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Slider } from './Slider/Slider';
import debounce from 'lodash/debounce';
import { getCategoryPrompt } from '../utils/alignmentPrompts';

export default function AlignmentAdjustment({ journeyData, setJourneyData, onComplete, onBack }) {
  const [activeCategory, setActiveCategory] = useState('safety');
  const [adjustedGoal, setAdjustedGoal] = useState(journeyData?.goal || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState({});
  const [sliderValues, setSliderValues] = useState(journeyData.likertScores || {});

  const generateCategoryContext = (category, goal) => {
    return `A focus around this goal that connects you with ${category} could be something like, "I am glad I have the ability and resources to work on: ${goal}."`;
  };

  const alignmentAreas = {
    safety: "I feel safe and open to receiving this opportunity or experience",
    confidence: "I have strong belief in my abilities and trust in my capability to achieve my goals",
    anticipation: "I consistently expect and anticipate that I will receive what I work towards and desire",
    openness: "I can maintain my focus and open connection to my desired result even if it takes time",
    deserving: "I feel deserving of this experience",
    belief: "I believe this is possible for me",
    appreciation: "I feel a sense of appreciation for this area in my business as it is now. I celebrate my business regularly"
  };

  const fetchAISuggestions = useCallback(async (category) => {
    const score = sliderValues[category];
    if (score > 3) return;

    setIsLoading(true);
    setError(null);

    try {
      const basePrompt = getCategoryPrompt(category, score, journeyData.goal);
      const contextualText = generateCategoryContext(category, journeyData.goal);
      const finalPrompt = `${basePrompt}\n\n${contextualText}\n\nDoes this help you move this slider up?`;

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journeyData: {
            ...journeyData,
            category,
            score,
            message: finalPrompt
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to get suggestions');

      const data = await response.json();
      setAiSuggestions((prev) => ({
        ...prev,
        [category]: {
          suggestions: data.message,
          timestamp: Date.now(),
        },
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [journeyData, sliderValues]);

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
    <Card
  className="w-full max-w-4xl mx-auto backdrop-blur-sm animate-fade-in"
  style={{
    backgroundColor: "rgba(255, 255, 255, 0.01)", // Translucent background
    backdropFilter: "blur(8px)", // Blur effect
    "-webkit-backdrop-filter": "blur(8px)", // Safari-specific
  }}
>
      <CardHeader className="border-b border-stone/10">
        <CardTitle className="flex items-center gap-2 text-sage">
          <Heart className="w-5 h-5 text-cosmic" />
          <span>Aligning Your Goal</span>
        </CardTitle>
  <AlertDescription className="text-earth leading-relaxed">
  Earlier you shared your internal agreement with receiving your desired goal or experience 
  in the following areas. Aligning your goal is about creating a sense of harmony between 
  what you desire and where you are. This step invites you to check in with how your goal 
  feels in your body, mind, and emotions, and to explore what might support the internal 
  agreement that allows your desire to materialize.
</AlertDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <Alert className="bg-cosmic/5 border-cosmic/20 fade-in">
          <AlertDescription className="space-y-2">
            <p className="font-medium text-cosmic">Your Current Goal:</p>
            <p className="text-earth">{journeyData.goal}</p>
          </AlertDescription>
        </Alert>

        <div className="space-y-4 fade-in">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-earth">{alignmentAreas[activeCategory]}</span>
            <span className="text-sm text-cosmic">
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

        <div className="flex flex-wrap gap-2 fade-in">
          {Object.keys(alignmentAreas).map((cat) => (
  <Button
    key={cat}
    variant={cat === activeCategory ? 'primary' : 'ghost'}
    onClick={() => setActiveCategory(cat)}
    className="flex items-center gap-2 transition-all duration-200"
  >
    {cat.charAt(0).toUpperCase() + cat.slice(1)}
    {sliderValues[cat] >= 4 && (
      <CheckCircle2 className="w-4 h-4 text-sage" />
    )}
  </Button>
          ))}
        </div>

        {sliderValues[activeCategory] >= 4 ? (
          <Alert className="bg-sage/5 border-sage/20 scale-in">
            <AlertDescription className="flex items-center space-x-2 text-earth">
              <CheckCircle2 className="w-4 h-4 text-sage" />
              <span>
                Beautiful! Your {activeCategory} alignment is strong at {sliderValues[activeCategory]}/5. 
                You can explore other areas or continue if you're ready.
              </span>
            </AlertDescription>
          </Alert>
        ) : aiSuggestions[activeCategory]?.suggestions && (
          <Alert className="bg-cosmic/5 border-cosmic/20 scale-in">
            <AlertDescription className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cosmic" />
                <p className="font-medium text-cosmic">Alignment Insight:</p>
              </div>
              <p className="text-earth leading-relaxed">{aiSuggestions[activeCategory].suggestions}</p>
              <Button
  variant="ghost"
  onClick={() => fetchAISuggestions(activeCategory)}
  className="mt-2"
>
  Refresh Insight
</Button>
            </AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <Alert className="bg-cosmic/5 border-cosmic/20 fade-in">
            <AlertDescription className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-cosmic border-t-transparent"/>
              <span className="text-cosmic">Gathering alignment suggestions...</span>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="bg-burgundy/5 border-burgundy/20 scale-in">
            <AlertDescription className="flex items-center space-x-2 text-burgundy">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between pt-6 border-t border-stone/10">
  <Button 
    variant="outline" 
    className="text-earth hover:text-cosmic transition-colors"
    onClick={onBack}
  >
    <ArrowLeft className="w-4 h-4 mr-2" />
    Back
  </Button>
  <Button
    variant="primary"
    onClick={() => {
      setJourneyData((prev) => ({
        ...prev,
        likertScores: sliderValues,
        adjustedGoal,
      }));
      onComplete();
    }}
  >
    Complete Journey <ArrowRight className="w-4 h-4 ml-2" />
  </Button>
</div>
      </CardContent>
    </Card>
  );
}
