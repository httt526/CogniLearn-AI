# Contributing to CogniLearn-AI

Thank you for your interest in contributing to CogniLearn-AI! This document provides guidelines and information for contributors.

## 🎯 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git
- A Supabase account for testing

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/CogniLearn-AI.git
   cd CogniLearn-AI
   ```

2. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend/cognilearn-ai
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env` in both backend and frontend directories
   - Configure your Supabase credentials
   - Set up your development database

## 📋 Development Guidelines

### Code Style
- Use **ESLint** configuration provided in the project
- Follow **React** best practices and hooks conventions
- Use **ES6+** features consistently
- Write clear, descriptive variable and function names

### Git Workflow
1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes with clear, atomic commits
3. Write descriptive commit messages following conventional commits
4. Push to your fork and create a Pull Request

### Commit Message Format
```
type(scope): brief description

Detailed description of changes made.

Fixes #issue_number
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation updates
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## 🧪 Testing

### Running Tests
```bash
# Backend tests (if available)
cd backend
npm test

# Frontend tests (if available)
cd frontend/cognilearn-ai
npm test
```

### Manual Testing
1. Start both backend and frontend servers
2. Test core functionality:
   - User registration/login
   - Contest creation and participation
   - AI chat functionality
   - Progress tracking
   - Dashboard analytics

## 📝 Pull Request Process

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation is updated (if needed)
- [ ] No console errors in development
- [ ] Feature works on both student and teacher interfaces (if applicable)

### PR Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] Manual testing completed

## Screenshots (if UI changes)
Include screenshots of UI changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🐛 Bug Reports

### Before Reporting
1. Check existing issues for duplicates
2. Test on the latest version
3. Provide clear reproduction steps

### Bug Report Template
```markdown
## Bug Description
Clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Node.js version: [e.g. v18.0.0]

## Additional Context
Any other relevant information.
```

## 💡 Feature Requests

### Feature Request Template
```markdown
## Feature Description
Clear description of the proposed feature.

## Use Case
Why is this feature needed? What problem does it solve?

## Proposed Solution
How would you like to see this implemented?

## Alternatives Considered
Other solutions you've considered.

## Additional Context
Any mockups, examples, or additional information.
```

## 🏗️ Architecture Guidelines

### Frontend Structure
```
src/
├── components/          # Reusable UI components
│   ├── Layouts/        # Layout components
│   ├── Cards/          # Card components
│   └── Modal/          # Modal components
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Home/           # Dashboard pages
│   └── Contest/        # Contest-related pages
├── utils/              # Utility functions
└── assets/             # Static assets
```

### Backend Structure
```
backend/
├── config/             # Configuration files
├── controllers/        # Route handlers
├── middlewares/        # Custom middleware
├── routes/             # API routes
├── services/           # Business logic
└── utils/              # Helper functions
```

### Database Guidelines
- Follow Supabase best practices
- Use Row Level Security (RLS) for data protection
- Create proper indexes for performance
- Document database schema changes

## 📚 Resources

### Useful Links
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [Mantine UI Components](https://mantine.dev/)
- [Express.js Guide](https://expressjs.com/guide)

### Development Tools
- **VS Code Extensions:**
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
  - Auto Rename Tag
  - GitLens

## 🤝 Community

### Getting Help
- **GitHub Discussions**: For questions and general discussion
- **Issues**: For bug reports and feature requests
- **Pull Requests**: For code contributions

### Code of Conduct
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow project guidelines

## 🎉 Recognition

Contributors will be recognized in:
- Project README
- Release notes for significant contributions
- Special mentions in project updates

Thank you for contributing to CogniLearn-AI! 🚀