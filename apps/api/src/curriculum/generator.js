/**
 * generateCurriculumFast — parallel WAEC lesson generator
 * Rules:
 * - No subtopic dependencies
 * - No relational errors
 * - 10-20 lessons per subject
 * - Uses Promise.all for speed
 * - try/catch with logging
 */

const CURRICULUM = [
  {
    subject: 'Mathematics',
    class: 'SS3',
    topics: [
      'Number and Numeration',
      'Algebraic Processes',
      'Geometry and Trigonometry',
      'Statistics and Probability',
      'Calculus',
      'Matrices and Determinants',
      'Coordinate Geometry',
      'Mensuration',
      'Sequences and Series',
      'Logical Reasoning',
    ],
  },
  {
    subject: 'English Language',
    class: 'SS3',
    topics: [
      'Comprehension',
      'Summary Writing',
      'Essay Writing',
      'Grammar and Usage',
      'Lexis and Structure',
      'Oral English',
      'Figures of Speech',
      'Vocabulary Development',
      'Letter Writing',
      'Report Writing',
    ],
  },
  {
    subject: 'Biology',
    class: 'SS3',
    topics: [
      'Cell Structure and Organisation',
      'Genetics and Evolution',
      'Ecology and Environment',
      'Plant Biology',
      'Animal Biology',
      'Human Physiology',
      'Reproduction',
      'Microbiology',
      'Nutrition and Digestion',
      'Transport Systems',
    ],
  },
  {
    subject: 'Chemistry',
    class: 'SS3',
    topics: [
      'Atomic Structure',
      'Chemical Bonding',
      'Acids, Bases and Salts',
      'Organic Chemistry',
      'Electrochemistry',
      'Rates of Reaction',
      'Equilibrium',
      'Stoichiometry',
      'Redox Reactions',
      'Industrial Chemistry',
    ],
  },
  {
    subject: 'Physics',
    class: 'SS3',
    topics: [
      'Mechanics',
      'Waves and Sound',
      'Light and Optics',
      'Electricity and Magnetism',
      'Atomic and Nuclear Physics',
      'Heat and Thermodynamics',
      'Motion and Forces',
      'Energy and Power',
      'Electronics',
      'Electromagnetic Waves',
    ],
  },
  {
    subject: 'Economics',
    class: 'SS3',
    topics: [
      'Basic Economic Concepts',
      'Demand and Supply',
      'Market Structures',
      'National Income',
      'Money and Banking',
      'International Trade',
      'Public Finance',
      'Economic Development',
      'Population and Labour',
      'Agricultural Economics',
    ],
  },
]

function buildQuiz(topic, subject) {
  return [
    {
      question: `Which of the following best describes ${topic} in ${subject}?`,
      options: [
        `It is a fundamental concept in ${subject}`,
        `It is unrelated to ${subject}`,
        `It only applies outside ${subject}`,
        `None of the above`,
      ],
      answer: `It is a fundamental concept in ${subject}`,
    },
    {
      question: `What is the primary focus of ${topic}?`,
      options: [
        `Understanding core principles`,
        `Memorising random facts`,
        `Avoiding the subject`,
        `Ignoring experiments`,
      ],
      answer: `Understanding core principles`,
    },
    {
      question: `Why is ${topic} important for WAEC ${subject}?`,
      options: [
        `It forms a key part of the syllabus`,
        `It is not in the syllabus`,
        `It is optional for students`,
        `Teachers rarely teach it`,
      ],
      answer: `It forms a key part of the syllabus`,
    },
  ]
}

function buildContent(topic, subject, cls) {
  return `${topic} — ${subject} (${cls})

Introduction
${topic} is a key area in the ${subject} WAEC syllabus for ${cls} students. Mastering this topic prepares students for both the objective and theory sections of the examination.

Core Concepts
1. Definition and Scope
   ${topic} covers the theoretical and practical aspects required to solve related problems in ${subject}.

2. Key Principles
   - Understanding the foundational rules of ${topic}
   - Applying formulas and methods correctly
   - Interpreting results in context

3. WAEC Examination Focus
   Expect questions that test:
   - Recall of definitions
   - Application of principles
   - Analysis of real-world examples

4. Study Tips
   - Review past WAEC questions on ${topic}
   - Practise calculations (where applicable)
   - Use diagrams and mnemonics to remember key facts

5. Common Mistakes
   - Confusing ${topic} with related concepts
   - Skipping units or labels in calculations
   - Misreading question requirements

Summary
${topic} in ${subject} is examinable and carries significant weight in the WAEC examination. Consistent practice and understanding of core principles will lead to success.`
}

function buildLesson(topicEntry, topicName) {
  const { subject, class: cls } = topicEntry
  const content = buildContent(topicName, subject, cls)
  return {
    title: `${topicName} — ${subject}`,
    class: cls,
    subject,
    topic: topicName,
    content,
    content_multilingual: {
      en: content,
    },
    quiz: buildQuiz(topicName, subject),
  }
}

export async function generateCurriculumFast() {
  console.log('[generateCurriculumFast] Starting generation…')

  const allLessons = await Promise.all(
    CURRICULUM.flatMap((entry) =>
      entry.topics.map((topic) => {
        try {
          return Promise.resolve(buildLesson(entry, topic))
        } catch (e) {
          console.error(`[generateCurriculumFast] Error building lesson for ${topic}:`, e.message)
          return Promise.resolve(null)
        }
      })
    )
  )

  const valid = allLessons.filter(Boolean)
  console.log(`[generateCurriculumFast] Generated ${valid.length} lessons`)
  return valid
}
