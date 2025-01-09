// src/utils/alignmentPrompts.js

/**
 * Returns a category-specific prompt for the given alignment category,
 * including references to the user's current score and goal.
 * 
 * NOTE: This function does NOT include "Does this help you move this slider up?"
 *       so you can safely append that (and any additional text) in your
 *       front-end component where finalPrompt is constructed.
 *
 * @param {string} category      - One of: "safety", "confidence", "anticipation", 
 *                                 "openness", "deserving", "belief", "appreciation"
 * @param {number} currentScore  - The user's current alignment score (1 to 5)
 * @param {string} goal          - The user's goal, e.g. "Finish the app"
 * @returns {string}             - A short, tailored prompt
 */
export const getCategoryPrompt = (category, currentScore, goal) => {
  const prompts = {
    safety: `
      The user rated their feeling of safety at ${currentScore}/5 for their goal: "${goal}".
      Provide specific suggestions to help them feel more safe and open to receiving this opportunity.
      Focus on gentle, gradual steps that build trust and comfort.
      Consider both emotional and physical safety in the suggestions.
    `,

    confidence: `
      The user rated their confidence at ${currentScore}/5 for their goal: "${goal}".
      Offer suggestions to build stronger belief in their abilities and trust in their capability.
      Focus on past successes and small wins that can build momentum.
    `,

    anticipation: `
      The user rated their level of positive expectation at ${currentScore}/5 for their goal: "${goal}".
      Provide suggestions to help them consistently expect and anticipate receiving what they work towards.
      Focus on building a stronger connection to the desired outcome.
    `,

    openness: `
      The user rated their ability to maintain focus and connection at ${currentScore}/5 for their goal: "${goal}".
      Suggest ways to help them stay open to their desired result, even when progress takes time.
      Focus on maintaining perspective and connection during the journey.
    `,

    deserving: `
      The user rated their feeling of deservingness at ${currentScore}/5 for their goal: "${goal}".
      Provide suggestions to help them recognize and embrace their worthiness of this experience.
      Focus on self-worth and accepting positive outcomes.
    `,

    belief: `
      The user rated their belief in possibility at ${currentScore}/5 for their goal: "${goal}".
      Offer suggestions to strengthen their belief that this is possible for them.
      Focus on building conviction and trust in the process.
    `,

    appreciation: `
      The user rated their appreciation at ${currentScore}/5 for their goal: "${goal}".
      Suggest ways to help them cultivate more appreciation for their business as it is now.
      Focus on celebration and recognition of current achievements.
    `
  };

  return prompts[category] || `
    Provide suggestions to improve alignment with "${category}" 
    for the goal: "${goal}" (score: ${currentScore}/5).
  `;
};
