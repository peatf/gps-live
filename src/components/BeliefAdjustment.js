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
                <p className="font-medium">Alignment Suggestions:</p>
              </div>
              <p className="text-sm">{aiSuggestions[activeCategory].suggestions}</p>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm">Take a moment to feel how these suggestions land in your body.</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

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
                likertScores: sliderValues,
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
