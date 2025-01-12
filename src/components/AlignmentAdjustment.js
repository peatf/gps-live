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

  const generateCategoryContext = (category, goal) => {
    return `A focus around this goal that connects you with ${category} could be something like, "I am glad I have the ability and resources to work on: ${goal}."`;
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
            message: finalPrompt,
          },
        }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      setAiSuggestions((prev) => ({
        ...prev,
        [category]: data.message,
      }));

      setJourneyData((prev) => ({
        ...prev,
        latestAiAdvice: {
          ...prev.latestAiAdvice,
          [category]: data.message,
        },
      }));
    } catch (err) {
      setError('Unable to fetch advice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [journeyData, sliderValues, setJourneyData]);

  useEffect(() => {
    if (shouldFetchAdvice && activeCategory !== 'null') {
      fetchAISuggestions(activeCategory);
      setShouldFetchAdvice(false); // Reset to prevent duplicate calls
    }
  }, [activeCategory, shouldFetchAdvice, fetchAISuggestions]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (sliderValues[category] <= 3) {
      setShouldFetchAdvice(true);
    }
  };

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
      setShouldFetchAdvice(true);
    }
  }, [setJourneyData]);

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
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-earth">{alignmentAreas[activeCategory]}</span>
            <span className="text-sm text-cosmic">{sliderValues[activeCategory] || 1}/5</span>
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
              onClick={() => handleCategoryChange(cat)}
              className="flex items-center gap-2 transition-all duration-200"
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
              {sliderValues[cat] >= 4 && (
                <CheckCircle2 className="w-4 h-4 text-sage" />
              )}
            </Button>
          ))}
        </div>

        {isLoading && (
          <Alert className="bg-cosmic/5 border-cosmic/20 fade-in">
            <AlertDescription className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-cosmic border-t-transparent" />
              <span className="text-cosmic">Gathering alignment suggestions...</span>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="bg-burgundy/5 border-burgundy/20 fade-in">
            <AlertDescription className="flex items-center space-x-2 text-burgundy">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between pt-6 border-t border-stone/10">
          <Button 
            variant="ghost"
            onClick={onBack}
            className="text-earth/90 hover:text-cosmic transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-xs md:text-sm">Back</span>
          </Button>

          <div className="flex gap-4">
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
              Complete Journey <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
