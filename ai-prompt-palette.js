/**
 * AI Prompt Palette for Dynamic Question Generation
 * Generates WAEC/NECO/JAMB exam-style questions with AI
 */

const AI_PROMPT_PALETTE = {
  // Question types
  questionTypes: {
    multipleChoice: "Generate a multiple choice question",
    fillTheBlank: "Generate a fill-in-the-blank question",
    shortAnswer: "Generate a short answer question",
    essay: "Generate an essay question",
    calculation: "Generate a calculation problem",
    theory: "Generate a theory-based question",
  },

  // Subject-specific prompts
  subjects: {
    mathematics: {
      topics: [
        "Algebra",
        "Geometry",
        "Trigonometry",
        "Calculus",
        "Statistics",
        "Arithmetic",
      ],
      prompt: `Generate a WAEC/NECO mathematics question on {topic}. 
        Format: 
        {
          "question": "...",
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
          "correctAnswer": "A",
          "explanation": "...",
          "difficulty": "medium",
          "topic": "{topic}"
        }`,
    },
    english: {
      topics: [
        "Comprehension",
        "Grammar",
        "Vocabulary",
        "Literature",
        "Essay Writing",
        "Poetry",
      ],
      prompt: `Generate a WAEC/NECO English question on {topic}.
        Format:
        {
          "question": "...",
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
          "correctAnswer": "A",
          "explanation": "...",
          "difficulty": "medium",
          "topic": "{topic}"
        }`,
    },
    physics: {
      topics: [
        "Mechanics",
        "Heat & Temperature",
        "Waves & Sound",
        "Electricity",
        "Magnetism",
        "Modern Physics",
      ],
      prompt: `Generate a WAEC/NECO physics question on {topic}.
        Include calculation where applicable.
        Format:
        {
          "question": "...",
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
          "correctAnswer": "A",
          "explanation": "...",
          "difficulty": "medium",
          "topic": "{topic}"
        }`,
    },
    chemistry: {
      topics: [
        "Atomic Structure",
        "Bonding",
        "Stoichiometry",
        "Reactions",
        "Equilibrium",
        "Organic Chemistry",
      ],
      prompt: `Generate a WAEC/NECO chemistry question on {topic}.
        Format:
        {
          "question": "...",
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
          "correctAnswer": "A",
          "explanation": "...",
          "difficulty": "medium",
          "topic": "{topic}"
        }`,
    },
    biology: {
      topics: [
        "Cell Biology",
        "Genetics",
        "Evolution",
        "Ecology",
        "Human Physiology",
        "Botany",
      ],
      prompt: `Generate a WAEC/NECO biology question on {topic}.
        Format:
        {
          "question": "...",
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
          "correctAnswer": "A",
          "explanation": "...",
          "difficulty": "medium",
          "topic": "{topic}"
        }`,
    },
    economics: {
      topics: [
        "Microeconomics",
        "Macroeconomics",
        "Trade",
        "Money & Banking",
        "Production",
        "Demand & Supply",
      ],
      prompt: `Generate a WAEC/NECO economics question on {topic}.
        Format:
        {
          "question": "...",
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
          "correctAnswer": "A",
          "explanation": "...",
          "difficulty": "medium",
          "topic": "{topic}"
        }`,
    },
    governmentCivics: {
      topics: [
        "Democracy",
        "Governance",
        "Rights & Duties",
        "Constitution",
        "Political Systems",
        "Leadership",
      ],
      prompt: `Generate a WAEC/NECO government question on {topic}.
        Format:
        {
          "question": "...",
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
          "correctAnswer": "A",
          "explanation": "...",
          "difficulty": "medium",
          "topic": "{topic}"
        }`,
    },
    history: {
      topics: [
        "Pre-colonial Nigeria",
        "Colonial Period",
        "Independence & Nation Building",
        "World War I & II",
        "African Independence",
        "Ancient Civilizations",
      ],
      prompt: `Generate a WAEC/NECO history question on {topic}.
        Format:
        {
          "question": "...",
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
          "correctAnswer": "A",
          "explanation": "...",
          "difficulty": "medium",
          "topic": "{topic}"
        }`,
    },
  },

  // Difficulty levels
  difficulties: {
    easy: "Generate an easy beginner-level question",
    medium: "Generate a medium intermediate-level question",
    hard: "Generate a hard advanced-level question",
  },

  // Image search terms for lessons
  imageSearchTerms: {
    mathematics: [
      "geometric shapes",
      "algebra equations",
      "trigonometric graphs",
      "calculus",
    ],
    physics: [
      "mechanics diagram",
      "wave motion",
      "electricity circuit",
      "magnetism",
    ],
    chemistry: [
      "atomic structure",
      "chemical bonds",
      "molecular structure",
      "reaction mechanism",
    ],
    biology: [
      "cell structure",
      "DNA helix",
      "ecosystem",
      "human anatomy",
    ],
    english: ["literature", "writing", "grammar", "poetry"],
  },

  // Video search terms
  videoSearchTerms: {
    mathematics: "WAEC mathematics tutorial",
    physics: "WAEC physics tutorial",
    chemistry: "WAEC chemistry tutorial",
    biology: "WAEC biology tutorial",
    english: "WAEC English tutorial",
    economics: "WAEC economics tutorial",
  },

  /**
   * Generate a prompt for AI API (Claude, GPT, etc.)
   * @param {string} subject - Subject name
   * @param {string} topic - Topic within subject
   * @param {string} questionType - Type of question
   * @param {string} difficulty - Difficulty level
   * @returns {string} Formatted prompt
   */
  generatePrompt(subject, topic, questionType, difficulty = "medium") {
    const subjectData = this.subjects[subject];
    if (!subjectData) return `Generate a ${questionType} on ${topic}`;

    const basePrompt = subjectData.prompt
      .replace("{topic}", topic)
      .replace("{question_type}", questionType);

    return `
You are an expert exam question creator for Nigerian WAEC/NECO/JAMB exams.
${basePrompt}

Difficulty: ${difficulty}
Ensure questions are:
- Appropriate for Nigerian secondary school curriculum
- Aligned with WAEC/NECO standards
- Clear and unambiguous
- With correct answers verified
- Include detailed explanations for learning

Return ONLY valid JSON with no markdown formatting.
    `.trim();
  },

  /**
   * Get image suggestions for a lesson
   * @param {string} subject - Subject
   * @param {string} topic - Topic
   * @returns {string[]} Array of image search terms
   */
  getImageSuggestions(subject, topic) {
    const baseSuggestions = this.imageSearchTerms[subject] || [];
    return [
      ...baseSuggestions,
      `${topic} diagram`,
      `${topic} illustration`,
      `${subject} ${topic}`,
    ];
  },

  /**
   * Get video suggestions for a lesson
   * @param {string} subject - Subject
   * @param {string} topic - Topic
   * @returns {string} Video search query
   */
  getVideoSuggestion(subject, topic) {
    return `${this.videoSearchTerms[subject] || subject} ${topic}`;
  },
};

/**
 * API Integration for Dynamic Content
 */
class DynamicContentGenerator {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
    this.cache = {};
  }

  /**
   * Call Claude API (or similar) to generate questions
   * @param {string} prompt - The prompt
   * @returns {Promise<Object>} Generated question data
   */
  async generateWithAI(prompt) {
    try {
      // If no API key, return mock data (for demo)
      if (!this.apiKey) {
        return this.generateMockQuestion();
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const content = data.content[0].text;

      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("AI generation error:", error);
      return this.generateMockQuestion();
    }
  }

  /**
   * Generate images from Unsplash or Pexels
   * @param {string[]} searchTerms - Search terms
   * @returns {string[]} Image URLs
   */
  async generateImages(searchTerms) {
    const images = [];
    for (const term of searchTerms.slice(0, 3)) {
      try {
        // Using Unsplash API (free tier)
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(term)}&per_page=1&client_id=YOUR_UNSPLASH_KEY`
        );
        const data = await response.json();
        if (data.results[0]) {
          images.push(data.results[0].urls.regular);
        }
      } catch (error) {
        console.log(`Could not fetch image for ${term}`);
      }
    }
    return images;
  }

  /**
   * Get YouTube video links
   * @param {string} searchQuery - Search query
   * @returns {Promise<string[]>} Video URLs
   */
  async getVideoLinks(searchQuery) {
    // In production, use YouTube API
    // For now, return search URL
    return [
      `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`,
    ];
  }

  /**
   * Mock question for demo (when no API available)
   */
  generateMockQuestion() {
    return {
      question:
        "Which of the following is a noble gas?",
      options: ["A) Oxygen", "B) Nitrogen", "C) Helium", "D) Hydrogen"],
      correctAnswer: "C",
      explanation:
        "Helium is a noble gas with a complete valence shell. It is inert and does not form chemical bonds.",
      difficulty: "easy",
      topic: "Atomic Structure",
    };
  }
}

// Export for use in app.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = { AI_PROMPT_PALETTE, DynamicContentGenerator };
}
