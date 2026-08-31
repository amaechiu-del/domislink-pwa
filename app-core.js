// =====================================================
// TEACHMASTER APP.JS - FULL WORKING APPLICATION
// =====================================================

// ==================== CONFIGURATION ====================
const CONFIG = {
    appName: 'TeachMaster',
    version: '1.0.0',
    supabaseUrl: 'YOUR_SUPABASE_URL', // Replace with your Supabase URL
    supabaseKey: 'YOUR_SUPABASE_ANON_KEY', // Replace with your Supabase anon key
    adminEmail: 'admin@domislink.com', // Your admin email
    paystackKey: 'YOUR_PAYSTACK_PUBLIC_KEY' // Replace with your Paystack key
};

// ==================== DATABASE (LocalStorage for now, Supabase ready) ====================
const DB = {
    // Get data from localStorage
    get(key) {
        const data = localStorage.getItem(`tm_${key}`);
        return data ? JSON.parse(data) : null;
    },
    
    // Set data to localStorage
    set(key, value) {
        localStorage.setItem(`tm_${key}`, JSON.stringify(value));
    },
    
    // Remove data
    remove(key) {
        localStorage.removeItem(`tm_${key}`);
    }
};

// ==================== SUBJECTS DATA ====================
const SUBJECTS = [
    { id: 'math', name: 'Mathematics', icon: '🔢', exams: ['WAEC', 'NECO', 'JAMB'], topics: 45, free: true },
    { id: 'english', name: 'English Language', icon: '📝', exams: ['WAEC', 'NECO', 'JAMB'], topics: 38, free: true },
    { id: 'physics', name: 'Physics', icon: '⚡', exams: ['WAEC', 'NECO', 'JAMB'], topics: 42, free: false },
    { id: 'chemistry', name: 'Chemistry', icon: '🧪', exams: ['WAEC', 'NECO', 'JAMB'], topics: 40, free: false },
    { id: 'biology', name: 'Biology', icon: '🧬', exams: ['WAEC', 'NECO', 'JAMB'], topics: 50, free: false },
    { id: 'economics', name: 'Economics', icon: '📊', exams: ['WAEC', 'NECO', 'JAMB'], topics: 35, free: false },
    { id: 'government', name: 'Government', icon: '🏛️', exams: ['WAEC', 'NECO', 'JAMB'], topics: 32, free: false },
    { id: 'literature', name: 'Literature', icon: '📚', exams: ['WAEC', 'NECO', 'JAMB'], topics: 28, free: false },
    { id: 'accounting', name: 'Accounting', icon: '💰', exams: ['WAEC', 'NECO'], topics: 30, free: false },
    { id: 'commerce', name: 'Commerce', icon: '🛒', exams: ['WAEC', 'NECO'], topics: 25, free: false },
    { id: 'agric', name: 'Agricultural Science', icon: '🌾', exams: ['WAEC', 'NECO', 'JAMB'], topics: 35, free: false },
    { id: 'crs', name: 'Christian Religious Studies', icon: '✝️', exams: ['WAEC', 'NECO', 'JAMB'], topics: 30, free: false }
];

// ==================== QUESTIONS DATABASE ====================
let QUESTIONS = DB.get('questions') || {
    math: [
        { q: "What is 15 × 12?", options: ["180", "150", "170", "190"], correct: 0 },
        { q: "Solve: 2x + 5 = 15", options: ["x = 5", "x = 10", "x = 7", "x = 3"], correct: 0 },
        { q: "What is the square root of 144?", options: ["12", "14", "11", "13"], correct: 0 },
        { q: "Calculate: 25% of 400", options: ["100", "75", "125", "80"], correct: 0 },
        { q: "What is 3³?", options: ["27", "9", "81", "18"], correct: 0 },
        { q: "Simplify: 4/8", options: ["1/2", "2/4", "1/4", "3/4"], correct: 0 },
        { q: "What is the value of π (pi) to 2 decimal places?", options: ["3.14", "3.41", "3.12", "3.16"], correct: 0 },
        { q: "If a = 3 and b = 4, what is a² + b²?", options: ["25", "12", "7", "49"], correct: 0 },
        { q: "What is 1000 ÷ 25?", options: ["40", "45", "35", "50"], correct: 0 },
        { q: "Solve: 5! (5 factorial)", options: ["120", "25", "60", "720"], correct: 0 }
    ],
    english: [
        { q: "Choose the correct spelling:", options: ["Accommodate", "Accomodate", "Acommodate", "Acomodate"], correct: 0 },
        { q: "What is a synonym for 'happy'?", options: ["Joyful", "Sad", "Angry", "Tired"], correct: 0 },
        { q: "Identify the noun: 'The cat sat on the mat'", options: ["cat", "sat", "on", "the"], correct: 0 },
        { q: "What is the past tense of 'run'?", options: ["ran", "runned", "running", "runs"], correct: 0 },
        { q: "Choose the correct article: '___ apple a day keeps the doctor away'", options: ["An", "A", "The", "No article"], correct: 0 },
        { q: "What type of sentence is 'Close the door!'?", options: ["Imperative", "Declarative", "Interrogative", "Exclamatory"], correct: 0 },
        { q: "What is an antonym of 'ancient'?", options: ["Modern", "Old", "Historic", "Vintage"], correct: 0 },
        { q: "Identify the verb: 'She quickly ran to school'", options: ["ran", "she", "quickly", "school"], correct: 0 },
        { q: "What is a collective noun for 'bees'?", options: ["Swarm", "Herd", "Flock", "Pack"], correct: 0 },
        { q: "Choose the correct pronoun: '___ is going to the market'", options: ["She", "Her", "Hers", "Herself"], correct: 0 }
    ],
    physics: [
        { q: "What is the SI unit of force?", options: ["Newton", "Joule", "Watt", "Pascal"], correct: 0 },
        { q: "What is the speed of light?", options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"], correct: 0 },
        { q: "What is Newton's First Law called?", options: ["Law of Inertia", "Law of Acceleration", "Law of Reaction", "Law of Gravity"], correct: 0 },
        { q: "What is the formula for velocity?", options: ["Distance/Time", "Time/Distance", "Force × Mass", "Mass × Acceleration"], correct: 0 },
        { q: "What is the unit of electrical resistance?", options: ["Ohm", "Volt", "Ampere", "Watt"], correct: 0 }
    ],
    chemistry: [
        { q: "What is the chemical symbol for Gold?", options: ["Au", "Ag", "Go", "Gd"], correct: 0 },
        { q: "What is the atomic number of Carbon?", options: ["6", "12", "8", "4"], correct: 0 },
        { q: "What is H₂O commonly known as?", options: ["Water", "Hydrogen", "Oxygen", "Hydroxide"], correct: 0 },
        { q: "What type of bond forms between Na and Cl?", options: ["Ionic", "Covalent", "Metallic", "Hydrogen"], correct: 0 },
        { q: "What is the pH of a neutral solution?", options: ["7", "0", "14", "1"], correct: 0 }
    ],
    biology: [
        { q: "What is the powerhouse of the cell?", options: ["Mitochondria", "Nucleus", "Ribosome", "Chloroplast"], correct: 0 },
        { q: "What is the basic unit of life?", options: ["Cell", "Atom", "Molecule", "Organ"], correct: 0 },
        { q: "What carries oxygen in blood?", options: ["Haemoglobin", "Plasma", "White blood cells", "Platelets"], correct: 0 },
        { q: "What is photosynthesis?", options: ["Food making by plants", "Breathing", "Digestion", "Excretion"], correct: 0 },
        { q: "How many chromosomes do humans have?", options: ["46", "23", "48", "44"], correct: 0 }
    ],
    economics: [
        { q: "What is the study of how society allocates scarce resources?", options: ["Economics", "Sociology", "Psychology", "Geography"], correct: 0 },
        { q: "What is inflation?", options: ["Rise in general price level", "Fall in prices", "Stable prices", "Currency change"], correct: 0 },
        { q: "What is GDP?", options: ["Gross Domestic Product", "General Development Plan", "Growth Domestic Price", "Gross Development Product"], correct: 0 },
        { q: "What is demand?", options: ["Willingness and ability to buy", "Desire to sell", "Available supply", "Market price"], correct: 0 },
        { q: "What creates unemployment?", options: ["All of the above", "Lack of skills", "Economic recession", "Overpopulation"], correct: 0 }
    ]
};

// ==================== FLASHCARDS DATA ====================
let FLASHCARDS = DB.get('flashcards') || {
    math: [
        { front: "What is the Pythagorean theorem?", back: "a² + b² = c² (for right triangles)" },
        { front: "What is the formula for area of a circle?", back: "A = πr²" },
        { front: "What is BODMAS?", back: "Bracket, Order, Division, Multiplication, Addition, Subtraction" },
        { front: "What is the quadratic formula?", back: "x = (-b ± √(b²-4ac)) / 2a" },
        { front: "What is the sum of angles in a triangle?", back: "180 degrees" }
    ],
    english: [
        { front: "What is a noun?", back: "A word that represents a person, place, thing, or idea" },
        { front: "What is a verb?", back: "A word that expresses action or state of being" },
        { front: "What is an adjective?", back: "A word that describes or modifies a noun" },
        { front: "What is a metaphor?", back: "A figure of speech comparing two unlike things without 'like' or 'as'" },
        { front: "What is alliteration?", back: "Repetition of the same consonant sound at the beginning of words" }
    ],
    physics: [
        { front: "What is Newton's Second Law?", back: "F = ma (Force equals mass times acceleration)" },
        { front: "What is Ohm's Law?", back: "V = IR (Voltage equals current times resistance)" },
        { front: "What is kinetic energy formula?", back: "KE = ½mv²" },
        { front: "What is potential energy formula?", back: "PE = mgh" },
        { front: "What is the law of conservation of energy?", back: "Energy cannot be created or destroyed, only transformed" }
    ],
    chemistry: [
        { front: "What is Avogadro's number?", back: "6.022 × 10²³" },
        { front: "What is the pH scale range?", back: "0 to 14 (0-6 acidic, 7 neutral, 8-14 basic)" },
        { front: "What is an isotope?", back: "Atoms of same element with different number of neutrons" },
        { front: "What is a mole?", back: "Amount of substance containing Avogadro's number of particles" },
        { front: "What is oxidation?", back: "Loss of electrons" }
    ],
    biology: [
        { front: "What is DNA?", back: "Deoxyribonucleic acid - carries genetic information" },
        { front: "What is mitosis?", back: "Cell division resulting in two identical daughter cells" },
        { front: "What is osmosis?", back: "Movement of water from low to high solute concentration" },
        { front: "What are the kingdoms of life?", back: "Monera, Protista, Fungi, Plantae, Animalia" },
        { front: "What is an ecosystem?", back: "Community of living organisms interacting with their environment" }
    ]
};

// ==================== USER STATE ====================
let currentUser = DB.get('currentUser') || null;
let userStats = DB.get('userStats') || {
    xp: 0,
    quizzesTaken: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    streak: 0,
    lastActive: null,
    badges: [],
    subjectProgress: {}
};

// ==================== QUIZ STATE ====================
let quizState = {
    active: false,
    subject: null,
    questions: [],
    currentIndex: 0,
    answers: [],
    startTime: null,
    timer: null
};

// ==================== FLASHCARD STATE ====================
let flashcardState = {
    subject: null,
    cards: [],
    currentIndex: 0
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupNavigation();
    renderSubjects();
    updateUI();
    checkStreak();
});

function initApp() {
    console.log(`🎓 ${CONFIG.appName} v${CONFIG.version} initialized`);
    
    // Load saved questions if any
    const savedQuestions = DB.get('questions');
    if (savedQuestions) {
        QUESTIONS = { ...QUESTIONS, ...savedQuestions };
    }
    
    // Check if user is logged in
    if (currentUser) {
        onLogin(currentUser);
    }
    
    // Populate subject selects
    populateSubjectSelects();
}

function setupNavigation() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const section = tab.dataset.section;
            showSection(section);
            
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    // Load section-specific data
    if (sectionId === 'leaderboard') loadLeaderboard();
    if (sectionId === 'admin') loadAdminStats();
}

// ==================== RENDER FUNCTIONS ====================
function renderSubjects() {
    const dashboardGrid = document.getElementById('dashboardSubjects');
    const subjectsList = document.getElementById('subjectsList');
    
    const subjectHTML = (subject, showProgress = true) => {
        const progress = userStats.subjectProgress[subject.id] || 0;
        const isLocked = !subject.free && !isSubscribed();
        
        return `
            <div class="subject-card ${isLocked ? 'locked' : ''}" onclick="${isLocked ? 'showModal(\'subscribeModal\')' : `selectSubject('${subject.id}')`}">
                <div class="subject-header">
                    <span class="subject-icon">${subject.icon}</span>
                    <span class="subject-exam">${subject.exams.join(' • ')}</span>
                </div>
                <div class="subject-body">
                    <h3 class="subject-title">${subject.name} ${isLocked ? '🔒' : ''}</h3>
                    <p class="subject-topics">${subject.topics} topics • ${QUESTIONS[subject.id]?.length || 0} questions</p>
                    ${showProgress ? `
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <p class="progress-text">${progress}% complete</p>
                    ` : ''}
                    <div class="subject-actions">
                        <button class="btn btn-secondary" onclick="event.stopPropagation(); startSubjectQuiz('${subject.id}')">📝 Quiz</button>
                        <button class="btn btn-primary" onclick="event.stopPropagation(); startFlashcards('${subject.id}')">🧠 Cards</button>
                    </div>
                </div>
            </div>
        `;
    };
    
    // Dashboard - show 4 subjects
    if (dashboardGrid) {
        dashboardGrid.innerHTML = SUBJECTS.slice(0, 4).map(s => subjectHTML(s)).join('');
    }
    
    // All subjects
    if (subjectsList) {
        subjectsList.innerHTML = SUBJECTS.map(s => subjectHTML(s)).join('');
    }
}

function populateSubjectSelects() {
    const selects = ['quizSubject', 'flashcardSubject', 'newQSubject'];
    selects.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Select Subject</option>' + 
                SUBJECTS.map(s => `<option value="${s.id}">${s.icon} ${s.name}</option>`).join('');
            if (currentValue) select.value = currentValue;
        }
    });
}

function updateUI() {
    // Update stats
    document.getElementById('userXP').textContent = `${userStats.xp} XP`;
    document.getElementById('userStreak').textContent = `🔥 ${userStats.streak} Days`;
    document.getElementById('totalXP').textContent = userStats.xp;
    document.getElementById('quizzesTaken').textContent = userStats.quizzesTaken;
    document.getElementById('streak').textContent = userStats.streak;
    
    const avgScore = userStats.totalAnswers > 0 
        ? Math.round((userStats.correctAnswers / userStats.totalAnswers) * 100) 
        : 0;
    document.getElementById('avgScore').textContent = `${avgScore}%`;
    
    // Update profile
    document.getElementById('profileXP').textContent = userStats.xp;
    document.getElementById('profileQuizzes').textContent = userStats.quizzesTaken;
    document.getElementById('profileStreak').textContent = userStats.streak;
    document.getElementById('profileBadges').textContent = userStats.badges.length;
    
    if (currentUser) {
        document.getElementById('profileName').textContent = currentUser.name;
        document.getElementById('profileEmail').textContent = currentUser.email;
        document.getElementById('loginBtn').textContent = currentUser.name.split(' ')[0];
        document.getElementById('profileLoginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'block';
        
        // Show admin tab if admin
        if (currentUser.email === CONFIG.adminEmail) {
            document.getElementById('adminTab').style.display = 'inline-block';
        }
    }
    
    // Save stats
    DB.set('userStats', userStats);
}

// ==================== QUIZ FUNCTIONS ====================
function startQuiz() {
    const subjectId = document.getElementById('quizSubject').value;
    const count = parseInt(document.getElementById('quizCount').value);
    
    if (!subjectId) {
        showToast('Please select a subject!');
        return;
    }
    
    const subject = SUBJECTS.find(s => s.id === subjectId);
    if (!subject.free && !isSubscribed()) {
        showModal('subscribeModal');
        return;
    }
    
    startSubjectQuiz(subjectId, count);
}

function startSubjectQuiz(subjectId, count = 10) {
    const subject = SUBJECTS.find(s => s.id === subjectId);
    if (!subject.free && !isSubscribed()) {
        showModal('subscribeModal');
        return;
    }
    
    const questions = QUESTIONS[subjectId] || [];
    if (questions.length === 0) {
        showToast('No questions available for this subject yet!');
        return;
    }
    
    // Shuffle and select questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    quizState = {
        active: true,
        subject: subjectId,
        questions: shuffled.slice(0, Math.min(count, shuffled.length)),
        currentIndex: 0,
        answers: [],
        startTime: Date.now(),
        timer: null
    };
    
    document.getElementById('quizStart').style.display = 'none';
    document.getElementById('quizActive').style.display = 'block';
    document.getElementById('quizResults').style.display = 'none';
    
    document.getElementById('totalQ').textContent = quizState.questions.length;
    document.getElementById('qSubject').textContent = subject.name;
    
    showSection('quiz');
    document.querySelector('[data-section="quiz"]').click();
    
    startTimer();
    renderQuestion();
}

function renderQuestion() {
    const q = quizState.questions[quizState.currentIndex];
    document.getElementById('currentQ').textContent = quizState.currentIndex + 1;
    document.getElementById('questionText').textContent = q.q;
    
    // Shuffle options for display
    const optionsWithIndex = q.options.map((opt, idx) => ({ text: opt, originalIndex: idx }));
    const shuffledOptions = [...optionsWithIndex].sort(() => Math.random() - 0.5);
    
    document.getElementById('optionsList').innerHTML = shuffledOptions.map((opt, idx) => `
        <button class="option-btn" data-index="${opt.originalIndex}" onclick="selectOption(this, ${opt.originalIndex})">
            ${String.fromCharCode(65 + idx)}. ${opt.text}
        </button>
    `).join('');
    
    document.getElementById('nextBtn').disabled = true;
}

function selectOption(btn, originalIndex) {
    if (quizState.answers[quizState.currentIndex] !== undefined) return;
    
    const q = quizState.questions[quizState.currentIndex];
    const isCorrect = originalIndex === q.correct;
    
    quizState.answers[quizState.currentIndex] = { selected: originalIndex, correct: isCorrect };
    
    // Show feedback
    document.querySelectorAll('.option-btn').forEach(b => {
        const idx = parseInt(b.dataset.index);
        if (idx === q.correct) {
            b.classList.add('correct');
        } else if (idx === originalIndex && !isCorrect) {
            b.classList.add('wrong');
        }
    });
    
    document.getElementById('nextBtn').disabled = false;
    
    // Award XP
    if (isCorrect) {
        userStats.xp += 10;
        userStats.correctAnswers++;
        showToast('+10 XP! 🎉');
    }
    userStats.totalAnswers++;
}

function nextQuestion() {
    if (quizState.currentIndex < quizState.questions.length - 1) {
        quizState.currentIndex++;
        renderQuestion();
    } else {
        finishQuiz();
    }
}

function skipQuestion() {
    quizState.answers[quizState.currentIndex] = { selected: -1, correct: false };
    userStats.totalAnswers++;
    nextQuestion();
}

function finishQuiz() {
    clearInterval(quizState.timer);
    
    const correct = quizState.answers.filter(a => a?.correct).length;
    const total = quizState.questions.length;
    const score = Math.round((correct / total) * 100);
    const timeTaken = Math.round((Date.now() - quizState.startTime) / 1000);
    
    // Calculate XP bonus
    let bonusXP = 0;
    if (score === 100) bonusXP = 50;
    else if (score >= 80) bonusXP = 30;
    else if (score >= 60) bonusXP = 15;
    
    userStats.xp += bonusXP;
    userStats.quizzesTaken++;
    
    // Update subject progress
    const currentProgress = userStats.subjectProgress[quizState.subject] || 0;
    userStats.subjectProgress[quizState.subject] = Math.min(100, currentProgress + Math.round(score / 10));
    
    // Show results
    document.getElementById('quizActive').style.display = 'none';
    document.getElementById('quizResults').style.display = 'block';
    
    document.getElementById('finalScore').textContent = `${score}%`;
    document.getElementById('finalGrade').textContent = `Grade: ${getGrade(score)}`;
    document.getElementById('correctCount').textContent = correct;
    document.getElementById('wrongCount').textContent = total - correct;
    document.getElementById('xpEarned').textContent = `+${(correct * 10) + bonusXP}`;
    document.getElementById('timeTaken').textContent = formatTime(timeTaken);
    
    // Check achievements
    checkAchievements(score, correct);
    
    updateUI();
    renderSubjects();
}

function resetQuiz() {
    document.getElementById('quizStart').style.display = 'block';
    document.getElementById('quizActive').style.display = 'none';
    document.getElementById('quizResults').style.display = 'none';
    quizState = { active: false, subject: null, questions: [], currentIndex: 0, answers: [], startTime: null, timer: null };
}

function startTimer() {
    let seconds = quizState.questions.length * 60; // 1 min per question
    
    quizState.timer = setInterval(() => {
        seconds--;
        document.getElementById('quizTimer').textContent = `⏱️ ${formatTime(seconds)}`;
        
        if (seconds <= 0) {
            finishQuiz();
        }
    }, 1000);
}

// ==================== FLASHCARD FUNCTIONS ====================
function startFlashcards(subjectId) {
    const subject = SUBJECTS.find(s => s.id === subjectId);
    if (!subject.free && !isSubscribed()) {
        showModal('subscribeModal');
        return;
    }
    
    loadFlashcardsForSubject(subjectId);
    showSection('flashcards');
    document.querySelector('[data-section="flashcards"]').click();
}

function loadFlashcards() {
    const subjectId = document.getElementById('flashcardSubject').value;
    if (subjectId) {
        loadFlashcardsForSubject(subjectId);
    }
}

function loadFlashcardsForSubject(subjectId) {
    document.getElementById('flashcardSubject').value = subjectId;
    
    flashcardState = {
        subject: subjectId,
        cards: FLASHCARDS[subjectId] || [],
        currentIndex: 0
    };
    
    if (flashcardState.cards.length === 0) {
        document.getElementById('cardFront').textContent = 'No flashcards available for this subject yet';
        document.getElementById('cardBack').textContent = 'Check back later!';
        document.getElementById('totalCards').textContent = '0';
        return;
    }
    
    document.getElementById('totalCards').textContent = flashcardState.cards.length;
    renderFlashcard();
}

function renderFlashcard() {
    const card = flashcardState.cards[flashcardState.currentIndex];
    if (!card) return;
    
    document.getElementById('cardFront').textContent = card.front;
    document.getElementById('cardBack').textContent = card.back;
    document.getElementById('cardIndex').textContent = flashcardState.currentIndex + 1;
    document.getElementById('flashcard').classList.remove('flipped');
}

function flipCard() {
    document.getElementById('flashcard').classList.toggle('flipped');
}

function markCard(difficulty) {
    // Award XP based on self-assessment
    const xpAward = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 3 : 1;
    userStats.xp += xpAward;
    showToast(`+${xpAward} XP`);
    
    // Move to next card
    if (flashcardState.currentIndex < flashcardState.cards.length - 1) {
        flashcardState.currentIndex++;
        renderFlashcard();
    } else {
        showToast('🎉 You completed all flashcards!');
        flashcardState.currentIndex = 0;
        renderFlashcard();
    }
    
    updateUI();
}

// ==================== LEADERBOARD ====================
function loadLeaderboard() {
    // Simulated leaderboard data (would come from Supabase in production)
    const leaderboard = [
        { name: 'Chinedu O.', xp: 15420 },
        { name: 'Adaeze N.', xp: 14200 },
        { name: 'Oluwaseun A.', xp: 13850 },
        { name: 'Fatima M.', xp: 12600 },
        { name: 'Emmanuel K.', xp: 11900 },
        { name: currentUser?.name || 'You', xp: userStats.xp },
        { name: 'Blessing O.', xp: 10500 },
        { name: 'Ahmed B.', xp: 9800 },
        { name: 'Grace A.', xp: 9200 },
        { name: 'David I.', xp: 8700 }
    ].sort((a, b) => b.xp - a.xp);
    
    document.getElementById('leaderboardList').innerHTML = leaderboard.map((user, idx) => `
        <div class="leaderboard-item ${user.name === (currentUser?.name || 'You') ? 'current-user' : ''}" 
             style="${user.name === (currentUser?.name || 'You') ? 'background: rgba(238, 255, 0, 0.1);' : ''}">
            <div class="leaderboard-rank ${idx < 3 ? 'rank-' + (idx + 1) : 'rank-default'}">${idx + 1}</div>
            <div class="leaderboard-name">${user.name}</div>
            <div class="leaderboard-xp">${user.xp.toLocaleString()} XP</div>
        </div>
    `).join('');
}

// ==================== AUTH FUNCTIONS ====================
let isSignUp = false;

function toggleAuthMode() {
    isSignUp = !isSignUp;
    document.getElementById('nameGroup').style.display = isSignUp ? 'block' : 'none';
    document.getElementById('authSubmitBtn').textContent = isSignUp ? 'Sign Up' : 'Login';
    document.getElementById('authToggleText').textContent = isSignUp ? 'Already have an account?' : "Don't have an account?";
}

function handleAuth() {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const name = document.getElementById('authName').value.trim();
    
    if (!email || !password) {
        showToast('Please fill all fields!');
        return;
    }
    
    if (isSignUp && !name) {
        showToast('Please enter your name!');
        return;
    }
    
    // Simple auth (would use Supabase in production)
    if (isSignUp) {
        // Register
        const users = DB.get('users') || [];
        if (users.find(u => u.email === email)) {
            showToast('Email already registered!');
            return;
        }
        
        const newUser = { email, password, name, createdAt: Date.now() };
        users.push(newUser);
        DB.set('users', users);
        
        onLogin({ email, name });
        showToast('Account created! 🎉');
    } else {
        // Login
        const users = DB.get('users') || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            showToast('Invalid email or password!');
            return;
        }
        
        onLogin({ email: user.email, name: user.name });
        showToast(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
    }
    
    closeModal('authModal');
}

function onLogin(user) {
    currentUser = user;
    DB.set('currentUser', user);
    
    // Load user-specific stats
    const savedStats = DB.get(`stats_${user.email}`);
    if (savedStats) {
        userStats = savedStats;
    }
    
    updateUI();
}

function logout() {
    // Save stats before logout
    if (currentUser) {
        DB.set(`stats_${currentUser.email}`, userStats);
    }
    
    currentUser = null;
    DB.remove('currentUser');
    
    document.getElementById('loginBtn').textContent = 'Login';
    document.getElementById('profileName').textContent = 'Guest User';
    document.getElementById('profileEmail').textContent = 'Login to save your progress';
    document.getElementById('profileLoginBtn').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('adminTab').style.display = 'none';
    
    showToast('Logged out successfully');
}

// ==================== SUBSCRIPTION ====================
function isSubscribed() {
    if (!currentUser) return false;
    const subscription = DB.get(`sub_${currentUser.email}`);
    return subscription && subscription.expiresAt > Date.now();
}

function processSubscription() {
    if (!currentUser) {
        showToast('Please login first!');
        closeModal('subscribeModal');
        showModal('authModal');
        return;
    }
    
    const plan = document.getElementById('subPlan').value;
    const prices = {
        monthly: 2000,
        termly: 5000,
        yearly: 15000,
        school: 0
    };
    
    if (plan === 'school') {
        showToast('Contact us at admin@domislink.com for school pricing');
        return;
    }
    
    // Simulate payment (would use Paystack in production)
    const confirmed = confirm(`Pay ₦${prices[plan].toLocaleString()} for ${plan} subscription?`);
    
    if (confirmed) {
        const durations = {
            monthly: 30 * 24 * 60 * 60 * 1000,
            termly: 90 * 24 * 60 * 60 * 1000,
            yearly: 365 * 24 * 60 * 60 * 1000
        };
        
        DB.set(`sub_${currentUser.email}`, {
            plan,
            startedAt: Date.now(),
            expiresAt: Date.now() + durations[plan]
        });
        
        closeModal('subscribeModal');
        showToast('🎉 Subscription activated! Enjoy all subjects!');
        document.getElementById('subscriptionBanner').style.display = 'none';
        renderSubjects();
    }
}

// ==================== ADMIN FUNCTIONS ====================
function loadAdminStats() {
    const users = DB.get('users') || [];
    const allStats = users.map(u => DB.get(`stats_${u.email}`)).filter(Boolean);
    
    document.getElementById('adminUsers').textContent = users.length;
    document.getElementById('adminSubscribers').textContent = users.filter(u => {
        const sub = DB.get(`sub_${u.email}`);
        return sub && sub.expiresAt > Date.now();
    }).length;
    document.getElementById('adminQuizzes').textContent = allStats.reduce((sum, s) => sum + (s.quizzesTaken || 0), 0);
    
    // Calculate revenue (simplified)
    const revenue = users.filter(u => DB.get(`sub_${u.email}`)).length * 2000;
    document.getElementById('adminRevenue').textContent = `₦${revenue.toLocaleString()}`;
}

function addQuestion() {
    const subject = document.getElementById('newQSubject').value;
    const question = document.getElementById('newQText').value.trim();
    const optA = document.getElementById('newQA').value.trim();
    const optB = document.getElementById('newQB').value.trim();
    const optC = document.getElementById('newQC').value.trim();
    const optD = document.getElementById('newQD').value.trim();
    
    if (!subject || !question || !optA || !optB || !optC || !optD) {
        showToast('Please fill all fields!');
        return;
    }
    
    if (!QUESTIONS[subject]) {
        QUESTIONS[subject] = [];
    }
    
    QUESTIONS[subject].push({
        q: question,
        options: [optA, optB, optC, optD],
        correct: 0 // Option A is always correct
    });
    
    DB.set('questions', QUESTIONS);
    
    // Clear form
    document.getElementById('newQText').value = '';
    document.getElementById('newQA').value = '';
    document.getElementById('newQB').value = '';
    document.getElementById('newQC').value = '';
    document.getElementById('newQD').value = '';
    
    closeModal('addQuestionModal');
    showToast('Question added successfully! 📝');
    renderSubjects();
}

function exportData() {
    const data = {
        users: DB.get('users'),
        questions: QUESTIONS,
        flashcards: FLASHCARDS,
        exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teachmaster_export_${Date.now()}.json`;
    a.click();
    
    showToast('Data exported! 📊');
}

// ==================== GAMIFICATION ====================
function checkAchievements(score, correct) {
    const newBadges = [];
    
    if (score === 100 && !userStats.badges.includes('perfect_score')) {
        newBadges.push({ id: 'perfect_score', name: 'Perfect Score!', desc: 'Got 100% on a quiz' });
    }
    
    if (userStats.quizzesTaken >= 10 && !userStats.badges.includes('quiz_master')) {
        newBadges.push({ id: 'quiz_master', name: 'Quiz Master', desc: 'Completed 10 quizzes' });
    }
    
    if (userStats.streak >= 7 && !userStats.badges.includes('week_streak')) {
        newBadges.push({ id: 'week_streak', name: 'Week Warrior', desc: '7 day streak' });
    }
    
    if (userStats.xp >= 1000 && !userStats.badges.includes('xp_1000')) {
        newBadges.push({ id: 'xp_1000', name: 'XP Hunter', desc: 'Earned 1000 XP' });
    }
    
    newBadges.forEach(badge => {
        userStats.badges.push(badge.id);
        showAchievement(badge.name, badge.desc);
    });
}

function showAchievement(title, desc) {
    document.getElementById('achievementTitle').textContent = title;
    document.getElementById('achievementDesc').textContent = desc;
    document.getElementById('achievementPopup').classList.add('show');
    
    setTimeout(() => {
        document.getElementById('achievementPopup').classList.remove('show');
    }, 3000);
}

function checkStreak() {
    const today = new Date().toDateString();
    const lastActive = userStats.lastActive;
    
    if (lastActive) {
        const lastDate = new Date(lastActive).toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (lastDate === yesterday) {
            userStats.streak++;
        } else if (lastDate !== today) {
            userStats.streak = 1;
        }
    } else {
        userStats.streak = 1;
    }
    
    userStats.lastActive = Date.now();
    DB.set('userStats', userStats);
}

// ==================== UTILITY FUNCTIONS ====================
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    if (score >= 50) return 'E';
    return 'F';
}

function selectSubject(subjectId) {
    document.getElementById('quizSubject').value = subjectId;
    showSection('quiz');
    document.querySelector('[data-section="quiz"]').click();
}

// ==================== SERVICE WORKER ====================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('✅ Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed:', err));
}

console.log('📚 TeachMaster loaded successfully!');
