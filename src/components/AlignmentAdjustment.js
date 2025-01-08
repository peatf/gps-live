import React, { useState } from 'react';

// Adjust imports as needed:
import { Card, CardHeader, CardTitle, CardContent } from '../Card/Card';
import { Button } from '../Button/Button';
import { Alert, AlertDescription } from '../Alert/Alert';
import { Heart, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

// If you don't have a Tabs component, remove or replace this logic.
// The code references "Tabs, TabsList, TabsTrigger, TabsContent" from a 
// typical UI library, so adapt as needed. 
// If you do NOT have these, you can omit that logic or create your own simple nav.

const AlignmentAdjustment = ({ alignmentScores = {}, initialGoal, onComplete }) => {
  const [activeCategory, setActiveCategory] = useState('safety');
  const [adjustedGoal, setAdjustedGoal] = useState(initialGoal);

  // Define adjustments for each category
  const getAdjustments = (category) => {
    const adjustments = {
      anticipation: {
        title: "Anticipation / Expectation of Receiving",
        options: [
          {
            type: "Shorten the Timeline",
            original: "in six months, I want to land a big deal",
            adjusted: "in the next two weeks, I'd love one encouraging sign or opportunity",
            somaticPrompt: "Breathe and ask, does looking for a small win over two weeks bring more lightness?"
          },
          {
            type: "Focus on Incremental Steps",
            original: "I will have 100% certainty in my success",
            adjusted: "Each day, I will acknowledge one small way life is showing me I'm on track",
            somaticPrompt: "Notice if your chest feels more open when thinking of smaller, daily victories."
          },
          {
            type: "Flexible Outcomes",
            original: "I must lock in this specific outcome",
            adjusted: "I'm open to receiving something even better than I imagined",
            somaticPrompt: "Does your jaw relax when you think of being pleasantly surprised?"
          }
        ]
      },
      safety: {
        title: "Feeling Safe to Receive",
        options: [
          {
            type: "Scale the Size",
            original: "triple my revenue in three months",
            adjusted: "welcome one new client that feels deeply aligned this month",
            somaticPrompt: "Close your eyes. Does this smaller goal feel calmer in your chest or belly?"
          },
          {
            type: "Add Safety Clause",
            original: "a flood of new customers",
            adjusted: "a steady, comfortable flow of new customers that I can handle with ease",
            somaticPrompt: "Notice if your shoulders drop or your breathing deepens with this version."
          },
          {
            type: "Emphasize Gentle Receiving",
            original: "must hit X milestone",
            adjusted: "allow supportive opportunities that feel nourishing and safe to arrive",
            somaticPrompt: "Place a hand on your belly. Feel your breath: does it slow down?"
          }
        ]
      },
      confidence: {
        title: "Self-Confidence and Belief",
        options: [
          {
            type: "Highlight Existing Strengths",
            original: "need to be confident to succeed",
            adjusted: "build on the strengths I already have, step by step",
            somaticPrompt: "Notice if you feel a gentle warmth when you recognize existing strengths."
          },
          {
            type: "Allow for Growth",
            original: "should have unshakable belief right now",
            adjusted: "open to my confidence growing steadily as I take aligned actions",
            somaticPrompt: "Sense any relief in allowing gradual growth?"
          }
        ]
      },
      openness: {
        title: "Not Being Distracted by Non-Receiving",
        options: [
          {
            type: "Create Buffer Goals",
            original: "need immediate results",
            adjusted: "building my capacity to stay steady, even when progress ebbs and flows",
            somaticPrompt: "Does your body remain calmer with the emphasis on resilience?"
          },
          {
            type: "Shift to Process",
            original: "must make X amount by next month",
            adjusted: "commit to consistent actions and trust that results come in their own time",
            somaticPrompt: "Place a hand on your heart. Feel more peaceful focusing on process?"
          }
        ]
      },
      deserving: {
        title: "Feeling Deserving",
        options: [
          {
            type: "Include Self-Permission",
            original: "want a thriving business",
            adjusted: "give myself permission to have a thriving business that matches my unique gifts",
            somaticPrompt: "Notice any release of tension around your throat or chest."
          },
          {
            type: "Ease Into Worthiness",
            original: "must fully believe I'm worthy right now",
            adjusted: "learning to see my own worth day by day",
            somaticPrompt: "Do you breathe more freely with this gentler approach?"
          }
        ]
      },
      appreciation: {
        title: "Appreciation and Celebration of the Present",
        options: [
          {
            type: "Simplify the Celebration",
            original: "I need an elaborate daily celebration routine",
            adjusted: "I will take 30 seconds each morning to acknowledge one current blessing",
            somaticPrompt: "Does your breathing deepen when you imagine this simple act of appreciation?"
          },
          {
            type: "Pair Appreciation with Progress",
            original: "I only celebrate when I hit big milestones",
            adjusted: "I celebrate each tiny sign of progress along the way",
            somaticPrompt: "Visualize celebrating a small win. Do you feel a subtle lift in your shoulders or mood?"
          },
          {
            type: "Anchor in the Body",
            original: "I have to be more grateful",
            adjusted: "I will pause daily to feel gratitude physically—like a warm glow in my chest",
            somaticPrompt: "Notice if you feel a gentle wave of warmth or relaxation when imagining gratitude as a physical sensation."
          }
        ]
      }
    };

    return adjustments[category] || {
      title: 'Unknown Category',
      options: []
    };
  };

  const { title, options } = getAdjustments(activeCategory);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            <span>Aligning Your Goal</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Category Alert */}
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
          {options.map((option, index) => (
            <div
              key={index}
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
                onClick={() => {
                  setAdjustedGoal(option.adjusted);
                }}
              >
                Try This Adjustment
              </Button>
            </div>
          ))}
        </div>

        {/* Category Navigation (Simplified) */}
        <div className="pt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {/* If you don't have a Tabs component, just use simple buttons */}
            {['safety', 'anticipation', 'openness', 'deserving', 'confidence', 'appreciation'].map(
              (cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? 'default' : 'outline'}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Button>
              )
            )}
          </div>
        </div>

        {/* Selected Adjustment */}
        {adjustedGoal !== initialGoal && (
          <Alert className="bg-green-50 border-green-200">
            <Sparkles className="w-4 h-4 text-green-600" />
            <AlertDescription>
              <p className="font-medium">Your Refined Goal:</p>
              <p className="mt-1">{adjustedGoal}</p>
              <p className="mt-2 text-sm text-green-600">
                Take a moment to sit with this version. Notice how it feels in your body.
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
};

export default AlignmentAdjustment;

