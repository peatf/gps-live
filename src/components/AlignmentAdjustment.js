import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Alert, AlertDescription } from './Alert/Alert';
import { Slider } from './Slider/Slider';
import { Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import debounce from 'lodash/debounce';
import { getCategoryPrompt } from '../utils/alignmentPrompts';
import { PDFDownloadLink } from '@react-pdf/renderer';
import JourneyPDF from './JourneyPDF';

export default function AlignmentAdjustment({ journeyData, setJourneyData, onComplete, onBack }) {
  const [activeCategory, setActiveCategory] = useState('null');
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
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journeyData: {
            ...journeyData,
            category,
            score,
            message: basePrompt,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      const suggestions = data.message;

      // Update local and global states
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

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Handle slider change
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

  // Debugging Logs
  useEffect(() => {
    console.log('Active Category:', activeCategory);
    console.log('Slider Values:', sliderValues);
    console.log('AI Suggestions:', aiSuggestions);
  }, [activeCategory, sliderValues, aiSuggestions]);

  return (
    <Card className="w-full max-w-4xl mx-auto backdrop-blur-sm">
      <CardHeader className="border-b border-stone/10">
        <CardTitle>Aligning Your Goal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
