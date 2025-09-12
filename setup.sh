#!/bin/bash

# CogniLearn-AI Setup Script
# This script helps set up the development environment

echo "🧠 CogniLearn-AI Setup Script"
echo "============================="
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js found: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm found: $NPM_VERSION"
echo

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if npm install; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend/cognilearn-ai
if npm install; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ../..

# Copy environment files if they don't exist
echo "⚙️  Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env from template"
    echo "⚠️  Please configure your Supabase credentials in backend/.env"
else
    echo "ℹ️  backend/.env already exists"
fi

if [ ! -f "frontend/cognilearn-ai/.env" ]; then
    cp frontend/cognilearn-ai/.env.example frontend/cognilearn-ai/.env
    echo "✅ Created frontend/.env from template"
    echo "⚠️  Please configure your Supabase credentials in frontend/cognilearn-ai/.env"
else
    echo "ℹ️  frontend/.env already exists"
fi

echo
echo "🎉 Setup completed successfully!"
echo
echo "Next steps:"
echo "1. Configure your Supabase credentials in the .env files"
echo "2. Start the backend server:"
echo "   cd backend && npm run dev"
echo "3. In a new terminal, start the frontend:"
echo "   cd frontend/cognilearn-ai && npm run dev"
echo
echo "Happy coding! 🚀"