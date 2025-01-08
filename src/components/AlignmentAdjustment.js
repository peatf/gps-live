import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Alert, AlertDescription } from './Alert/Alert';
import { Heart, Sparkles, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function AlignmentAdjustment({ journeyData, setJourneyData, onComplete }) {
  const [activeCategory, setActiveCategory] = useState('safety');
  const [adjustedGoal, setAdjustedGoal] = useState(journeyData?.goal || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState({});

  // Function to get AI suggestions for a category
  const getAISuggestions = useCallback(async (category) => {
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
            message: `Please provide 2 specific adjustments for the goal "${journeyData.goal}" 
                     focusing on ${category}. Consider somatic awareness and emotional safety. 
                     Format each suggestion with a 'type', 'original' version, 'adjusted' version, 
                     and 'somaticPrompt' for body awareness.`
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI suggestions');
      }

      const data = await response.json();
      
      // Parse the AI response and structure it
      try {
        const suggestions = data.message.includes('{') 
          ? JSON.parse(data.message) 
          : inferSuggestionsFromText(data.message);
          
        setAiSuggestions(prev => ({
          ...prev,
          [category]: suggestions
        }));
      } catch (e) {
        console.error('Error parsing AI response:', e);
        // Fallback to simpler structure if parsing fails
        setAiSuggestions(prev => ({
          ...prev,
          [category]: {
            title: `${category.charAt(0).toUpperCase() + category.slice(1)} Adjustments`,
            options: [{
              type: 'Goal Reframing',
              original: journeyData.goal,
              adjusted: data.message,
              somaticPrompt: 'Take a deep breath and notice how this adjustment feels in your body.'
            }]
          }
        }));
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [journeyData]);

  // Helper function to infer suggestions structure from text
  const inferSuggestionsFromText = (text) => {
    const sentences = text.split('.');
    return {
      title: `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Adjustments`,
      options: [{
        type: 'Goal Reframing',
        original: journeyData.goal,
        adjusted: sentences[0],
        somaticPrompt: sentences[1] || 'Notice how this adjustment feels in your body.'
      }]
    };
  };

  // Fetch suggestions when category changes
  useEffect(() => {
    if (!aiSuggestions[activeCategory]) {
      getAISuggestions(activeCategory);
    }
  }, [activeCategory, getAISuggestions]);

  // Get current category suggestions
  const currentSuggestions = aiSuggestions[activeCategory] || { title: '', options: [] };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          <span>Aligning Your Goal</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Loading State */}
        {isLoading && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span>Getting alignment suggestions...</span>
            </AlertDescription>
          </Alert>
        )}

        {/* Error State */}
        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </AlertDescription>
          </Alert>
        )}

        {/* Category Intro */}
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="space-y-2">
            <p>
              We're focusing on <span className="font-medium">{currentSuggestions.title}</span>
            </p>
            <p className="text-sm text-blue-600">
              Let's explore adjustments that feel aligned with your body's wisdom.
            </p>
          </AlertDescription>
        </Alert>

        {/* AI Suggestions */}
        <div className="space-y-4">
          {currentSuggestions.options.map((option, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-gray-200 space-y-3 hover:border-blue-200 transition-all"
            >
              <h3 className="font-medium">{option.type}</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  Instead of "<span className="text-red-500">{option.original}</span>"
                </p>
                <p className="text-sm">
                  Try "<span className="text-green-600">{option.adjusted}</span>"
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm">{option.somaticPrompt}</p>
              </div>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => setAdjustedGoal(option.adjusted)}
              >
                Try This Adjustment
              </Button>
            </div>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
  {['safety', 'anticipation', 'openness', 'deserving', 'confidence', 'appreciation'].map((cat) => (
    <Button
      key={cat}
      variant={cat === activeCategory ? 'default' : 'outline'}
      onClick={() => setActiveCategory(cat)}
    >
      {cat.charAt(0).toUpperCase() + cat.slice(1)}
    </Button>
  ))}
</div>

        {/* Show adjusted goal if changed */}
        {adjustedGoal !== journeyData.goal && (
          <Alert className="bg-green-50 border-green-200">
            <Sparkles className="w-4 h-4 text-green-600" />
            <AlertDescription>
              <p className="font-medium">Your Refined Goal:</p>
              <p className="mt-1">{adjustedGoal}</p>
              <p className="mt-2 text-sm text-green-600">
                Take a moment to feel how this lands in your body.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              setJourneyData(prev => ({
                ...prev,
                adjustedGoal
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
