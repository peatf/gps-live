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
  const [activeCategory, setActiveCategory] = useState('safety');
  const [adjustedGoal, setAdjustedGoal] = useState(journeyData?.goal || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState({});
  const [sliderValues, setSliderValues] = useState(journeyData.likertScores || {});

  // Track and update final scores and AI advice for the PDF
  useEffect(() => {
    const latestAdvice = aiSuggestions[activeCategory]?.suggestions || '';
    const hasAdviceChanged = journeyData.aiAdvice[activeCategory] !== latestAdvice;

    if (hasAdviceChanged) {
      setJourneyData((prev) => ({
        ...prev,
        finalScores: { ...sliderValues },
        aiAdvice: {
          ...prev.aiAdvice,
          [activeCategory]: latestAdvice,
        },
      }));
    }
  }, [sliderValues, aiSuggestions, activeCategory, journeyData, setJourneyData]);

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
    <Card className="w-full max-w-4xl mx-auto backdrop-blur-sm animate-fade-in">
      <CardHeader className="border-b border-stone/10">
        <CardTitle className="flex items-center gap-2 text-sage">
          <Heart className="w-5 h-5 text-cosmic" />
          <span>Aligning Your Goal</span>
        </CardTitle>
        <AlertDescription className="text-earth leading-relaxed">
          Earlier you shared your internal agreement with receiving your desired goal or experience 
          in the following areas. Aligning your goal is about creating a sense of harmony between 
          what you desire and where you are.
        </AlertDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        <Alert className="bg-cosmic/5 border-cosmic/20 fade-in">
          <AlertDescription>
            <p className="font-medium text-cosmic">Your Current Goal:</p>
            <p>{journeyData.goal}</p>
          </AlertDescription>
        </Alert>

        <div className="space-y-4 fade-in">
          <div className="flex justify-between">
            <span>{alignmentAreas[activeCategory]}</span>
            <span>{sliderValues[activeCategory]}/5</span>
          </div>
          <Slider
            value={[sliderValues[activeCategory] || 1]}
            min={1}
            max={5}
            step={1}
            onValueChange={(value) => handleSliderChange(activeCategory, value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 fade-in">
          {Object.keys(alignmentAreas).map((cat) => (
            <Button
              key={cat}
              variant={cat === activeCategory ? 'primary' : 'ghost'}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>

        {sliderValues[activeCategory] >= 4 && (
          <Alert>
            <AlertDescription>
              Beautiful! Your {activeCategory} alignment is strong at {sliderValues[activeCategory]}/5.
            </AlertDescription>
          </Alert>
        )}

        {sliderValues[activeCategory] <= 3 && aiSuggestions[activeCategory]?.suggestions && (
          <Alert>
            <AlertDescription>
              <p>Alignment Insight:</p>
              <p>{aiSuggestions[activeCategory].suggestions}</p>
            </AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <Alert>
            <AlertDescription>Gathering alignment suggestions...</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft /> Back
          </Button>
          <div className="flex gap-4">
            <PDFDownloadLink
              document={<JourneyPDF journeyData={journeyData} />}
              fileName="journey-summary.pdf"
            >
              {({ loading }) => (
                <Button variant="primary" disabled={loading}>
                  {loading ? 'Preparing...' : 'Download Summary'}
                </Button>
              )}
            </PDFDownloadLink>
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
              Complete Journey <ArrowRight />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
