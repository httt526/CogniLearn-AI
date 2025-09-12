# 🧠 CogniLearn-AI

**CogniLearn-AI** is an intelligent cognitive analytics platform that revolutionizes learning through AI-powered assessments, personalized tutoring, and comprehensive performance tracking. The platform combines machine learning algorithms with educational psychology to provide adaptive learning experiences tailored to each student's needs.

## ✨ Features

### 🎯 Smart Assessment System
- **Adaptive Contest Generation**: AI-powered question generation based on learning topics
- **Real-time Performance Analytics**: Track progress with detailed cognitive metrics
- **Multi-topic Support**: Comprehensive question bank across various subjects
- **Intelligent Difficulty Adjustment**: Dynamic question difficulty based on user performance

### 🤖 AI-Powered Learning
- **CogniChat**: Interactive AI tutoring system for personalized learning support
- **Cognitive Analysis**: Advanced analytics to identify learning patterns and strengths/weaknesses
- **Learning Path Optimization**: AI-recommended study plans based on performance data
- **Progress Prediction**: Machine learning models to forecast learning outcomes

### 📊 Comprehensive Dashboard
- **Student Dashboard**: Visual progress tracking with interactive charts and analytics
- **Teacher Dashboard**: Class management with detailed student performance insights
- **Performance Metrics**: Multi-dimensional skill assessment (Logic, Attention, Persistence, Learning Speed)
- **Historical Analysis**: Long-term learning trend visualization

### 👥 User Management
- **Role-based Access**: Separate interfaces for students and teachers
- **Profile Customization**: Detailed user profiles with learning preferences
- **Session Management**: Secure authentication with JWT tokens
- **Progress Continuity**: Save and resume learning sessions

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │────│   Express API   │────│   Supabase DB   │
│   (Vite + Mantine)│    │   (Node.js)     │    │  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                       ┌─────────────────┐
                       │  External APIs  │
                       │ • Langflow AI   │
                       │ • Google GenAI  │
                       │ • Analysis API  │
                       └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 19** with **Vite** for fast development
- **Mantine UI** for modern component library
- **Tailwind CSS** for utility-first styling
- **React Router DOM** for navigation
- **Recharts** for data visualization
- **Framer Motion** for animations

### Backend
- **Node.js** with **Express.js** framework
- **Supabase** for database and authentication
- **JWT** for secure session management
- **bcryptjs** for password encryption
- **Multer** for file uploads
- **Axios** for HTTP requests

### AI & Analytics
- **Google Gemini AI** for intelligent content generation
- **Langflow** for AI workflow orchestration
- **Custom Analytics Engine** for performance evaluation

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase account** (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/httt526/CogniLearn-AI.git
   cd CogniLearn-AI
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Configure environment variables
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend/cognilearn-ai
   npm install
   
   # Configure environment variables
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Environment Configuration**

   **Backend (.env)**
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   PORT=8000
   ```

   **Frontend (.env)**
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:8000
   ```

2. **Start Frontend Application**
   ```bash
   cd frontend/cognilearn-ai
   npm run dev
   # App runs on http://localhost:5173
   ```

## 📡 API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User authentication
- `POST /logout` - User logout
- `GET /get-profile` - Get user profile

### Contest Management
- `GET /questions` - Fetch all questions
- `GET /question/:id` - Get specific question
- `POST /create-contest` - Create new contest
- `GET /get-contest/:id` - Get contest details
- `GET /get-contests` - List all contests
- `POST /contest-result/:id` - Submit contest results

### Progress Tracking
- `GET /get-progress/:userId` - Get user progress
- `POST /contest-progress/:contestId` - Save/update progress
- `DELETE /contest-progress/:id` - Delete progress

### Analytics
- `GET /topic-stats` - Get topic performance statistics
- `GET /topic-stats-user` - Get user-specific topic stats
- `GET /get-contest-results` - Get contest results with analytics

### Chat System
- `POST /sessions/:userId` - Create chat session
- `GET /sessions/:userId` - Get user chat sessions
- `POST /sessions/:sessionId/messages` - Send message
- `GET /sessions/:sessionId/messages` - Get chat history

## 🎮 Usage Examples

### Creating a Contest
```javascript
const contestData = {
  name: "Mathematics Quiz",
  topics: [1, 2, 3], // Topic IDs
  number: 10, // Questions per topic
  author: { name: "Teacher Name" }
};

const response = await fetch('/create-contest', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(contestData)
});
```

### Tracking Progress
```javascript
const progress = {
  userId: "user-123",
  answers: [1, 3, 2, 4], // Answer choices
  currentQIndex: 4,
  timePerQuestion: [30, 45, 20, 60], // Seconds per question
  totalQuestions: 10,
  doneQuestions: 4
};

await fetch(`/contest-progress/${contestId}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(progress)
});
```

## 🏫 Database Schema

### Core Tables
- **profiles** - User information and preferences
- **questions** - Question bank with topics and metadata
- **contests** - Contest configurations and settings
- **contest_results** - Performance data and analytics
- **contest_progress** - Real-time progress tracking
- **chat_sessions** - AI tutoring conversation history
- **chat_messages** - Individual chat messages

## 🎨 UI Components

### Student Interface
- **Dashboard**: Progress overview with performance metrics
- **Contest Library**: Browse and participate in assessments
- **CogniChat**: AI tutoring interface
- **Profile Management**: Personal settings and preferences

### Teacher Interface
- **Teacher Dashboard**: Class analytics and student insights
- **Contest Creation**: AI-powered assessment builder
- **Student Progress**: Detailed performance tracking
- **Analytics Reports**: Comprehensive learning analytics

## 🧪 Development

### Project Structure
```
CogniLearn-AI/
├── backend/                 # Express.js API server
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Authentication & upload middleware
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── utils/              # Helper functions
├── frontend/cognilearn-ai/ # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── utils/          # Frontend utilities
│   │   └── assets/         # Static assets
│   └── public/             # Public files
└── README.md
```

### Development Scripts

**Backend**
```bash
npm run dev     # Start with nodemon
npm start       # Production start
```

**Frontend**
```bash
npm run dev     # Development server
npm run build   # Production build
npm run preview # Preview production build
npm run lint    # Run ESLint
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new functionality
- Update documentation for API changes
- Ensure all tests pass before submitting PRs

## 🔒 Security

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: bcryptjs for secure password hashing
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Environment Variables**: Sensitive data stored securely

## 📋 Roadmap

### Phase 1 (Current)
- ✅ Core assessment system
- ✅ Basic AI tutoring
- ✅ User authentication
- ✅ Progress tracking

### Phase 2 (In Progress)
- 🔄 Advanced analytics
- 🔄 Mobile responsiveness
- 🔄 Performance optimizations
- 🔄 Extended AI capabilities

### Phase 3 (Planned)
- ⏳ Mobile applications
- ⏳ Advanced gamification
- ⏳ Integration with LMS systems
- ⏳ Multi-language support

## 📄 License

This project is licensed under the **ISC License**. See the `LICENSE` file for details.

## 🙏 Acknowledgments

- **Supabase** for backend infrastructure
- **Mantine** for beautiful UI components
- **Google AI** for intelligent content generation
- **Langflow** for AI workflow management

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/httt526/CogniLearn-AI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/httt526/CogniLearn-AI/discussions)
- **Documentation**: [Project Wiki](https://github.com/httt526/CogniLearn-AI/wiki)

---

**Made with ❤️ by the CogniLearn-AI Team**
