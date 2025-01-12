import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Alert, AlertDescription } from './Alert/Alert';
import { Heart, Sparkles, ArrowRight, ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Slider } from './Slider/Slider';
import debounce from 'lodash/debounce';
import { getCategoryPrompt } from '../utils/alignmentPrompts';
import { PDFDownloadLink } from '@react-pdf/renderer';
import JourneyPDF from './JourneyPDF';

export default function AlignmentAdjustment({ journeyData, setJourneyData, onComplete, onBack }) {
  const [activeCategory, setActiveCategory] = useState('null');
  const [shouldFetchAdvice, setShouldFetchAdvice] = useState(false);
  const [adjustedGoal, setAdjustedGoal] = useState(journeyData?.goal || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(journeyData.latestAiAdvice || {});
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

  // Fetch AI suggestions
  const fetchAISuggestions = useCallback(async (category) => {
    const score = sliderValues[category];
    if (score > 3) return;

    setIsLoading(true);
    setError(null);

    try {
      const basePrompt = getCategoryPrompt(category, score, journeyData.goal);
      const contextualText = `A focus around this goal that connects you with ${category} could be: "I am glad I have the ability and resources to work on: ${journeyData.goal}."`;
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
      const suggestions = data.message;

      // Update local state and journeyData
      setAiSuggestions((prev) => ({
        ...prev,
        [category]: suggestions,
      }));

      setJourneyData((prev) => ({
        ...prev,
        latestAiAdvice: {
          ...prev.latestAiAdvice,
          [category]: suggestions,
        },
      }));
    } catch (err) {
      setError('Unable to fetch advice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [journeyData, sliderValues, setJourneyData]);

  // Handle category changes
  const handleCategoryChange = (category) => {
    setActiveCategory(category);

    if (sliderValues[category] <= 3) {
      setShouldFetchAdvice(true);
    }
  };

  // Handle slider value changes
  const handleSliderChange = useCallback((category, value) => {
    const newValue = value[0];
    setSliderValues((prev) => ({
      ...prev,
      [category]: newValue,
    }));

    setJourneyData((prev) => ({
      ...prev,
      likertScores: {
        ...prev.likertScores,
        [category]: newValue,
      },
    }));

    if (newValue <= 3) {
      fetchAISuggestions(category);
    }
  }, [fetchAISuggestions, setJourneyData]);

  useEffect(() => {
    console.log('Active Category:', activeCategory);
    console.log('Slider Values:', sliderValues);
    console.log('AI Suggestions:', aiSuggestions);
  }, [activeCategory, sliderValues, aiSuggestions]);

  return (
    <Card className="w-full max-w-4xl mx-auto backdrop-blur-sm animate-fade-in">
      <CardHeader className="border-b border-stone/10">
        <CardTitle className="flex items-center gap-2 text-sage">
          <Heart className="w-5 h-5 text-cosmic" />
          <span>Aligning Your Goal</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {Object.keys(alignmentAreas).map((cat) => (
          <Button
            key={cat}
            variant={cat === activeCategory ? 'primary' : 'ghost'}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
        {activeCategory !== 'null' && (
          <>
            <div className="space-y-4">
              <Slider
                value={[sliderValues[activeCategory] || 1]}
                min={1}
                max={5}
                step={1}
                onValueChange={(value) => handleSliderChange(activeCategory, value)}
              />
              {sliderValues[activeCategory] <= 3 && aiSuggestions[activeCategory] && (
                <Alert>
                  <AlertDescription>
                    <Sparkles />
                    {aiSuggestions[activeCategory]}
                  </AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="error">
                  <AlertDescription>
                    <AlertTriangle />
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </>
        )}
        <PDFDownloadLink
          document={
            <JourneyPDF
              journeyData={{
                ...journeyData,
                likertScores: sliderValues,
                adjustedGoal,
                latestAiAdvice: aiSuggestions,
              }}
            />
          }
          fileName="alignment-journey.pdf"
        >
          {({ loading }) => (
            <Button variant="primary" disabled={loading}>
              {loading ? 'Preparing...' : 'Download Journey Summary'}
            </Button>
          )}
        </PDFDownloadLink>
        <Button variant="primary" onClick={onComplete}>
          Complete Journey
        </Button>
      </CardContent>
    </Card>
  );
}
