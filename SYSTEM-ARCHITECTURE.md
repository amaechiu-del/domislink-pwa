# 🏗️ DomisLink PWA - System Architecture

## Overview

DomisLink is a comprehensive **syllabus aggregation and auto-sync platform** that pulls official syllabi from Nigerian examination bodies (WAEC, BECE, NECO, NTRDC), normalizes them into a standardized schema, and layers AI-powered interactivity on top.

---

## 🎯 Core System Components

### 1. **Syllabus Ingestion Engine**

**Purpose:** Fetch, parse, and normalize official syllabi from examination boards.

**Data Flow:**
```
Official Syllabi (PDF/API)
         ↓
Connectors (Board-specific)
         ↓
Extract: Subjects → Topics → Lessons
         ↓
Normalize to JSON Schema
         ↓
Version Tracking + Source Attribution
```

**Supported Boards:**
- **WAEC** - West African Examinations Council
- **BECE** - Basic Education Certificate Examination
- **NECO** - National Examination Council
- **NTRDC** - Nigerian Teaching & Research Development Council

**Implementation:**
```javascript
// syllabus-ingestion.js
class SyllabusIngestionEngine {
  async fetchFromWAEC(subjectCode) {
    // Connect to WAEC portal/API
    // Extract curriculum data
    // Normalize format
  }

  async normalizeToSchema(rawSyllabus, boardSource) {
    return {
      id: generateUUID(),
      source: boardSource,
      version: "2026-01-01",
      subjects: [
        {
          id: "math-001",
          name: "Mathematics",
          board: "WAEC",
          topics: [
            {
              id: "math-topic-01",
              name: "Algebra",
              lessons: [
                {
                  id: "math-lesson-01",
                  title: "Linear Equations",
                  objectives: ["Solve for x", "Graph solutions"],
                  keyContent: ["Slope-intercept form", "Point-slope form"]
                }
              ]
            }
          ]
        }
      ]
    };
  }

  async versioning(subjectId, previousVersion, newVersion) {
    const diff = this.computeDiff(previousVersion, newVersion);
    return {
      changeLog: diff,
      timestamp: new Date(),
      autoUpdate: true
    };
  }
}
```

---

### 2. **Auto-Update & Diff Engine**

**Purpose:** Periodically check for syllabus changes and trigger auto-updates.

**Features:**
- Scheduled jobs (daily/weekly)
- Intelligent diff detection
- Change notifications
- Automatic Protobuf regeneration

**Implementation:**
```javascript
// auto-update-engine.js
class AutoUpdateEngine {
  constructor(checkInterval = 86400000) { // 24 hours
    this.checkInterval = checkInterval;
    this.scheduler = new CronScheduler();
  }

  async startMonitoring() {
    this.scheduler.schedule('0 2 * * *', async () => {
      console.log('🔄 Checking for syllabus updates...');
      
      const syllabi = await this.getAllStoredSyllabi();
      
      for (const syllabus of syllabi) {
        const currentVersion = syllabus.version;
        const latestVersion = await this.fetchLatestFromBoard(syllabus.source);
        
        const hasChanges = this.detectChanges(currentVersion, latestVersion);
        
        if (hasChanges) {
          console.log(`✅ Updates found for ${syllabus.source}`);
          await this.processUpdate(syllabus.id, latestVersion);
        }
      }
    });
  }

  detectChanges(oldVersion, newVersion) {
    return {
      newTopics: this.findNewTopics(oldVersion, newVersion),
      removedTopics: this.findRemovedTopics(oldVersion, newVersion),
      modifiedLessons: this.findModifiedLessons(oldVersion, newVersion),
      updatedObjectives: this.findUpdatedObjectives(oldVersion, newVersion)
    };
  }

  async processUpdate(syllabusId, newVersion) {
    // 1. Update stored version
    await this.updateSyllabusInDB(syllabusId, newVersion);
    
    // 2. Regenerate Protobuf binary
    await this.regenerateProtobuf(syllabusId, newVersion);
    
    // 3. Push to CDN
    await this.pushToDistribution(syllabusId);
    
    // 4. Notify connected clients
    this.broadcastUpdate(syllabusId, newVersion);
    
    // 5. Log change
    this.logChangeLog(syllabusId, newVersion);
  }
}
```

---

### 3. **Protobuf Conversion Pipeline**

**Purpose:** Convert normalized JSON → Protobuf binary for efficient storage/transport.

**Schema Definition (`syllabus.proto`):**
```protobuf
syntax = "proto3";

package domislink;

message Syllabus {
  string id = 1;
  string source = 2; // WAEC, NECO, BECE, NTRDC
  string version = 3;
  int64 updated_at = 4;
  repeated Subject subjects = 5;
}

message Subject {
  string id = 1;
  string name = 2;
  string board = 3;
  string level = 4; // SSS1, SSS2, SSS3, BECE
  repeated Topic topics = 5;
  repeated LearningObjective objectives = 6;
}

message Topic {
  string id = 1;
  string name = 2;
  repeated Lesson lessons = 3;
  repeated string keywords = 4;
}

message Lesson {
  string id = 1;
  string title = 2;
  repeated string learning_objectives = 3;
  repeated string key_concepts = 4;
  string duration_minutes = 5;
  repeated string resources = 6;
}

message LearningObjective {
  string id = 1;
  string objective = 2;
  string bloom_level = 3; // Remember, Understand, Apply, etc.
}
```

**Build Pipeline (`build_syllabus.py`):**
```python
#!/usr/bin/env python3
import json
import subprocess
from protobuf import syllabus_pb2

def json_to_protobuf(json_file, output_file):
    """Convert JSON syllabus to Protobuf binary"""
    
    with open(json_file, 'r') as f:
        data = json.load(f)
    
    syllabus = syllabus_pb2.Syllabus()
    syllabus.id = data['id']
    syllabus.source = data['source']
    syllabus.version = data['version']
    
    for subject_data in data['subjects']:
        subject = syllabus.subjects.add()
        subject.id = subject_data['id']
        subject.name = subject_data['name']
        
        for topic_data in subject_data['topics']:
            topic = subject.topics.add()
            topic.id = topic_data['id']
            topic.name = topic_data['name']
            
            for lesson_data in topic_data['lessons']:
                lesson = topic.lessons.add()
                lesson.id = lesson_data['id']
                lesson.title = lesson_data['title']
                lesson.learning_objectives.extend(
                    lesson_data.get('objectives', [])
                )
    
    with open(output_file, 'wb') as f:
        f.write(syllabus.SerializeToString())
    
    print(f"✅ Generated: {output_file}")

if __name__ == '__main__':
    json_to_protobuf('syllabus.json', 'syllabus.pb')
    
    # Also generate lightweight index
    generate_index('syllabus.json', 'index.pb')
```

---

### 4. **Interactive Content Generation (AI Palette)**

**Purpose:** Auto-generate quizzes, interactive books, and Q&A content using syllabus context.

**Features:**
- Question suggestion engine
- Adaptive difficulty levels
- Interactive book generation
- Context-aware Q&A

**Implementation (`ai-palette-v2.js`):**
```javascript
class AIContentPalette {
  constructor(claudeAPI, syllabusContext) {
    this.claude = claudeAPI;
    this.syllabus = syllabusContext;
  }

  // Generate practice questions aligned to topic
  async generateQuestions(subjectId, topicId, difficulty = 'medium', count = 10) {
    const topic = this.syllabus.getTopic(topicId);
    const objectives = topic.learning_objectives;
    
    const prompt = `
      Generate ${count} ${difficulty} exam-style questions for:
      Subject: ${topic.subject_name}
      Topic: ${topic.name}
      Learning Objectives: ${objectives.join(', ')}
      
      Format: Return as JSON array with fields:
      - question: string
      - type: "multiple_choice" | "fill_blank" | "essay" | "calculation"
      - options: string[] (if multiple_choice)
      - correct_answer: string
      - explanation: string
      - bloom_level: "Remember" | "Understand" | "Apply" | "Analyze"
    `;
    
    return await this.claude.generate(prompt);
  }

  // Create interactive lesson with embedded media
  async generateInteractiveBook(subjectId, topicId) {
    const topic = this.syllabus.getTopic(topicId);
    
    const lessonStructure = {
      title: topic.name,
      sections: [
        {
          type: 'introduction',
          content: await this.generateIntro(topic),
          duration: 5
        },
        {
          type: 'main_content',
          content: await this.generateMainContent(topic),
          duration: 20,
          media: await this.findRelatedVideos(topic.name)
        },
        {
          type: 'worked_examples',
          content: await this.generateExamples(topic),
          duration: 10
        },
        {
          type: 'interactive_quiz',
          questions: await this.generateQuestions(subjectId, topicId, 'medium', 5),
          duration: 5
        },
        {
          type: 'summary',
          content: await this.generateSummary(topic),
          duration: 3
        }
      ]
    };
    
    return lessonStructure;
  }

  // Answer student questions using syllabus context
  async askAI(question, contextTopicId) {
    const topic = this.syllabus.getTopic(contextTopicId);
    const syllabus_text = JSON.stringify(topic);
    
    const prompt = `
      Context (from official syllabus):
      ${syllabus_text}
      
      Student Question: ${question}
      
      Provide a clear, educational answer based on the syllabus.
      Include: explanation, key concepts, and if relevant, worked example.
    `;
    
    return await this.claude.generate(prompt);
  }

  // Generate adaptive quiz based on student performance
  async adaptiveQuiz(subjectId, topicId, studentPerformance) {
    const avgScore = studentPerformance.averageScore;
    
    let nextDifficulty = 'medium';
    if (avgScore > 80) nextDifficulty = 'hard';
    if (avgScore < 60) nextDifficulty = 'easy';
    
    return await this.generateQuestions(
      subjectId, 
      topicId, 
      nextDifficulty, 
      10
    );
  }
}
```

---

### 5. **Distribution & Sync System**

**Purpose:** Push updates to clients, manage offline caching, ensure seamless sync.

**Architecture:**
```
┌─────────────────┐
│  Syllabus.pb    │  (Protobuf binary)
│  (~50-200 KB)   │
└────────┬────────┘
         │
    ┌────▼────┐
    │   CDN   │  (CloudFront / Netlify)
    └────┬────┘
         │
    ┌────▼──────────┐
    │ Service Worker│
    │ (Caching)     │
    └────┬──────────┘
         │
    ┌────▼─────────┐
    │ Local Storage│
    │ (Client App) │
    └──────────────┘
```

**Implementation (`sync-engine.js`):**
```javascript
class SyncEngine {
  constructor() {
    this.db = new IndexedDB('domislink-offline');
    this.version = this.loadLocalVersion();
  }

  async checkForUpdates() {
    const remoteVersion = await this.fetchRemoteVersion();
    
    if (remoteVersion > this.version) {
      console.log('📥 New syllabus version available');
      await this.downloadAndCache(remoteVersion);
      this.broadcastUpdate();
    }
  }

  async downloadAndCache(version) {
    // 1. Download Protobuf binary
    const syllabusBinary = await fetch(
      `https://cdn.domislink.com/syllabus-${version}.pb`
    ).then(r => r.arrayBuffer());
    
    // 2. Parse with protobuf.js
    const SyllabusProto = this.loadProtoDefinition();
    const syllabus = SyllabusProto.decode(new Uint8Array(syllabusBinary));
    
    // 3. Store in IndexedDB
    await this.db.put('syllabus', {
      version,
      data: syllabus,
      timestamp: Date.now()
    });
    
    // 4. Update service worker cache
    const cache = await caches.open(`syllabus-v${version}`);
    await cache.addAll([
      `https://cdn.domislink.com/syllabus-${version}.pb`,
      `https://cdn.domislink.com/index-${version}.pb`
    ]);
    
    // 5. Clean old versions
    await this.cleanOldCaches(version);
  }

  async broadcastUpdate() {
    if ('serviceWorker' in navigator) {
      const controller = navigator.serviceWorker.controller;
      controller?.postMessage({
        type: 'SYLLABUS_UPDATED',
        timestamp: Date.now()
      });
    }
  }
}
```

---

### 6. **User-Facing Application Layer**

**Features:**

1. **Subject Explorer**
   - Browse all subjects by exam board
   - Filter by level (SSS1, SSS2, SSS3, BECE)
   - Search topics

2. **Topic Detail Pages**
   - Interactive lessons with media
   - Practice quizzes aligned to objectives
   - Student progress tracking

3. **Interactive Q&A**
   - "Ask AI" button on each topic
   - Answers grounded in syllabus
   - Discussion threads

4. **Auto-Sync**
   - Real-time notifications of updates
   - Seamless background refresh
   - Offline-first architecture

**UI Component Example:**
```javascript
// SubjectExplorer.js
class SubjectExplorer {
  async loadSubjects(examBoard = 'WAEC') {
    const syllabus = await this.getSyllabus();
    
    return syllabus.subjects
      .filter(s => s.board === examBoard)
      .map(s => ({
        name: s.name,
        topics: s.topics.length,
        lastUpdated: s.version,
        objectives: s.objectives.length
      }));
  }

  async renderTopicDetail(topicId) {
    const topic = this.syllabus.getTopic(topicId);
    
    return `
      <div class="topic-detail">
        <h2>${topic.name}</h2>
        <div class="objectives">
          <h3>Learning Objectives:</h3>
          <ul>
            ${topic.learning_objectives.map(obj => `<li>${obj}</li>`).join('')}
          </ul>
        </div>
        
        <div class="interactive-lesson">
          ${await this.renderInteractiveBook(topicId)}
        </div>
        
        <div class="quiz-section">
          <button onclick="generateQuiz('${topicId}')">
            📝 Take Practice Quiz
          </button>
        </div>
        
        <div class="ask-ai">
          <button onclick="openAIChat('${topicId}')">
            🤖 Ask AI About This Topic
          </button>
        </div>
      </div>
    `;
  }
}
```

---

## 🔄 Auto-Upgrade Workflow (Complete Flow)

```
┌─ Monday 2 AM ─────────────────────────────┐
│  Auto-Update Job Triggers                  │
└────────┬────────────────────────────────────┘
         │
    ┌────▼��────────────────────┐
    │ Fetch Latest from:        │
    │ - WAEC Portal/API         │
    │ - BECE Database           │
    │ - NECO Server             │
    │ - NTRDC Repository        │
    └────┬─────────────────────┘
         │
    ┌────▼────────────────────┐
    │ Compare with Stored      │
    │ Detect Changes           │
    └────┬───────────────────┘
         │
    ┌────▼──────────────────────┐
    │ Changes Found?            │
    │ - New Topics              │
    │ - Removed Lessons         │
    │ - Updated Objectives      │
    └────┬──────────────────────┘
         │
    ┌────▼──────────────────┐
    │ Convert to JSON →      │
    │ Normalize Format       │
    └────┬─────────────────┘
         │
    ┌────▼────────────────────┐
    │ Build Protobuf Binary   │
    │ Regenerate .pb File     │
    └────┬───────────────────┘
         │
    ┌────▼─────────────────────┐
    │ Push to CDN              │
    │ Upload syllabi to dist   │
    └────┬────────────────────┘
         │
    ┌────▼──────────────────────────┐
    │ Broadcast to Clients           │
    │ via WebSocket / Service Worker │
    └────┬───────────────────────────┘
         │
    ┌────▼────────────────────────┐
    │ Client App Receives Update   │
    │ Downloads New .pb File       │
    │ Updates LocalStorage/IDB     │
    └────┬───────────────────────┘
         │
    ┌────▼──────────────────────────┐
    │ Notify Users                  │
    │ "New Syllabus Available"       │
    │ Auto-Sync in Background        │
    └────────────────────────────────┘
```

---

## 📊 Data Model

### Normalized Syllabus JSON Structure

```json
{
  "id": "syllabus-waec-2026",
  "source": "WAEC",
  "version": "2026-01-01",
  "updated_at": 1704067200000,
  "subjects": [
    {
      "id": "math-waec-001",
      "name": "Mathematics",
      "board": "WAEC",
      "level": "SSS3",
      "duration": "3 hours",
      "topics": [
        {
          "id": "math-topic-algebra",
          "name": "Algebra",
          "weight": "20%",
          "lessons": [
            {
              "id": "math-lesson-linear-eq",
              "title": "Linear Equations in One Variable",
              "duration_minutes": 45,
              "learning_objectives": [
                "Solve linear equations",
                "Represent solutions graphically",
                "Apply to real-world problems"
              ],
              "key_concepts": [
                "Equation manipulation",
                "Solution sets",
                "Graphical representation"
              ],
              "resources": {
                "videos": ["https://youtube.com/..."],
                "documents": ["syllabus-section-2.1"],
                "examples": []
              }
            }
          ],
          "keywords": ["equations", "variables", "solving"]
        }
      ],
      "learning_objectives": [
        {
          "id": "obj-001",
          "objective": "Understand algebraic concepts",
          "bloom_level": "Understand"
        }
      ]
    }
  ]
}
```

---

## 🚀 Deployment Architecture

```
GitHub (Source)
    ↓
CI/CD Pipeline (GitHub Actions)
    ↓
┌──────────────────────┐
│ Build Jobs:          │
│ 1. Lint & Test       │
│ 2. Build Protobuf    │
│ 3. Generate Index    │
│ 4. Optimize Assets   │
└──────┬───────────────┘
       ↓
┌──────────────────────┐
│ Distribution:        │
│ - Netlify            │
│ - Vercel             │
│ - GitHub Pages       │
│ - AWS CloudFront     │
└──────────────────────┘
```

---

## 🔒 Security & Performance

### Security Measures
- ✅ TLS/SSL for all data transmission
- ✅ Signature verification for syllabus updates
- ✅ Rate limiting on API endpoints
- ✅ User authentication for AI features

### Performance Optimizations
- ✅ Protobuf binary compression (~50-200 KB)
- ✅ IndexedDB for fast local lookups
- ✅ Service Worker caching strategy
- ✅ CDN distribution for global reach
- ✅ Lazy loading for lesson content

---

## 📈 Monitoring & Analytics

**Key Metrics:**
- Update deployment time
- Sync success rate
- Client cache hit ratio
- API latency
- User engagement per topic

**Logging:**
```javascript
// Log system events
logger.info('✅ Syllabus update deployed', {
  version: '2026-01-01',
  changes: 47,
  affectedTopics: 12,
  deploymentTime: 2450 // ms
});
```

---

## 🎓 Next Steps

1. **Phase 1:** Build ingestion engine for WAEC
2. **Phase 2:** Implement auto-update scheduler
3. **Phase 3:** Deploy sync system to production
4. **Phase 4:** Roll out AI palette features
5. **Phase 5:** Add support for BECE, NECO, NTRDC

---

**Ready to build?** Start with syllabus ingestion and auto-update architecture! 🚀
