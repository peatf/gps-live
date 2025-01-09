import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Alert, AlertDescription } from './Alert/Alert';
import { Heart, Sparkles, ArrowRight, ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AlignmentAdjustment({ journeyData, setJourneyData, onComplete, onBack }) {
  const [activeCategory, setActiveCategory] = useState('safety');
  const [adjustedGoal, setAdjustedGoal] = useState(journeyData?.goal || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState({});

  // Helper to check if a category needs adjustment
  const needsAdjustment = (category) => {
    const score = journeyData.likertScores[category];
    return !score || score < 4;
  };

  // Get AI suggestions for a category
  const getAISuggestions = useCallback(async (category) => {
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
            message: `The user rated their ${category} as ${journeyData.likertScores[category]}/5. 
                     Please provide 2 specific adjustments for the goal "${journeyData.goal}" 
                     focusing on improving their sense of ${category}.`
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to get AI suggestions');

      const data = await response.json();
      
      // Structure the suggestions
      const suggestions = {
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Adjustments`,
        options: [
          {
            type: 'Goal Reframing',
            original: journeyData.goal,
            adjusted: data.message,
            somaticPrompt: 'Take a moment to feel how this lands in your body.'
          }
        ]
      };

      setAiSuggestions(prev => ({
        ...prev,
        [category]: suggestions
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [journeyData]);

  // Fetch suggestions when category changes
  useEffect(() => {
    if (!aiSuggestions[activeCategory] && needsAdjustment(activeCategory)) {
      getAISuggestions(activeCategory);
    }
  }, [activeCategory, getAISuggestions]);

  const categories = ['safety', 'anticipation', 'openness', 'deserving', 'confidence', 'appreciation'];
  const currentSuggestions = aiSuggestions[activeCategory];

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          <span>Aligning Your Goal</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Goal Summary */}
        <Alert className="bg-purple-50 border-purple-200">
          <AlertDescription className="space-y-2">
            <p className="font-medium">Your Current Goal:</p>
            <p className="text-purple-800">{journeyData.goal}</p>
          </AlertDescription>
        </Alert>

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

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={cat === activeCategory ? 'default' : 'outline'}
              onClick={() => setActiveCategory(cat)}
              className="flex items-center gap-2"
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
              {!needsAdjustment(cat) && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            </Button>
          ))}
        </div>

        {/* Category Content */}
        {!needsAdjustment(activeCategory) ? (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>
                Your alignment with {activeCategory} is already strong! 
                Feel free to explore other areas or continue if you're ready.
              </span>
            </AlertDescription>
          </Alert>
        ) : currentSuggestions?.options?.map((option, i) => (
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
              setJourneyData(prev => ({
                ...prev,
                adjustedGoal: adjustedGoal
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
