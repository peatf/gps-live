import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card/Card';
import { Button } from './Button/Button';
import { Alert, AlertDescription } from './Alert/Alert';
import { Heart, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

/**
 * AlignmentAdjustment
 *
 * Props:
 * - journeyData (object): user data from parent
 * - setJourneyData (function): if you want to store adjustments globally
 * - onComplete (function): called when user finishes alignment
 */
export default function AlignmentAdjustment({ journeyData, setJourneyData, onComplete }) {
  const [activeCategory, setActiveCategory] = useState('safety');
  const [adjustedGoal, setAdjustedGoal] = useState(journeyData?.goal || '');

  const getAdjustments = (category) => {
    const adjustments = {
      anticipation: {
        title: 'Anticipation / Expectation of Receiving',
        options: [
          {
            type: 'Shorten the Timeline',
            original: 'in six months, I want to land a big deal',
            adjusted: 'in the next two weeks, I’d love one encouraging sign or opportunity',
            somaticPrompt: 'Breathe and ask...'
          },
          // more if desired
        ]
      },
      safety: {
        title: 'Feeling Safe to Receive',
        options: [
          {
            type: 'Scale the Size',
            original: 'triple my revenue in three months',
            adjusted: 'welcome one new client...',
            somaticPrompt: 'Close your eyes...'
          },
          // more
        ]
      },
      // confidence, openness, deserving, appreciation...
    };

    return adjustments[category] || { title: 'Unknown Category', options: [] };
  };

  const { title, options } = getAdjustments(activeCategory);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          <span>Aligning Your Goal</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Intro Alert */}
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="space-y-2">
            <p>
              We’re focusing on <span className="font-medium">{title}</span> as an area
              where we could bring more alignment.
            </p>
            <p className="text-sm text-blue-600">
              Let's explore some adjustments that might feel better in your body.
            </p>
          </AlertDescription>
        </Alert>

        {/* Adjustment Options */}
        <div className="space-y-4">
          {options.map((option, i) => (
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
          {['safety','anticipation','openness','deserving','confidence','appreciation'].map((cat) => (
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
                Notice how it feels in your body.
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
          <Button className="flex items-center gap-2" onClick={onComplete}>
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
