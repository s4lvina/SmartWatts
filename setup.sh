#!/bin/bash

# SmartWatts Installation Script
# Automatically configures the development environment

set -e

echo "🚀 SmartWatts Setup"
echo "=================="

# Check Node.js
echo "✓ Checking Node.js..."
node_version=$(node --version)
echo "  Node version: $node_version"

# Install dependencies
echo "✓ Installing dependencies..."
npm install

# Ask for environment setup
echo ""
echo "📋 Environment Configuration"
echo "============================="
echo ""
echo "You need to set up three services:"
echo ""
echo "1️⃣  SUPABASE"
echo "   - Go to https://supabase.com"
echo "   - Create a new project"
echo "   - Copy Project URL and Anon Key"
echo ""
echo "2️⃣  GOOGLE GEMINI API"
echo "   - Go to https://console.cloud.google.com"
echo "   - Create API key for Generative Language API"
echo ""
echo "3️⃣  CREATE .env.local"
echo "   - Copy from .env.example"
echo "   - Fill in your API keys"
echo ""

read -p "Have you set up these services? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter your Supabase URL: " SUPABASE_URL
    read -p "Enter your Supabase Anon Key: " SUPABASE_KEY
    read -p "Enter your Gemini API Key: " GEMINI_KEY
    
    # Create .env.local
    cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_KEY
GOOGLE_GENERATIVE_AI_API_KEY=$GEMINI_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
EOF
    
    echo "✓ .env.local created"
fi

echo ""
echo "📊 Database Setup"
echo "================="
echo ""
echo "⚠️  Manual Step Required:"
echo ""
echo "1. Open your Supabase dashboard"
echo "2. Go to SQL Editor"
echo "3. Create NEW QUERY"
echo "4. Copy entire contents of: supabase-schema.sql"
echo "5. Paste into query editor"
echo "6. Click RUN"
echo ""
read -p "Done with database setup? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🎉 Setup Complete!"
    echo "=================="
    echo ""
    echo "Start development server with:"
    echo "  npm run dev"
    echo ""
    echo "Open http://localhost:3000 in your browser"
    echo ""
    echo "📚 Documentation:"
    echo "  - QUICK_START.md - Get up to speed fast"
    echo "  - README.md - Full documentation"
    echo "  - DEPLOYMENT.md - Deploy to production"
    echo "  - ROADMAP.md - Future features"
    echo ""
else
    echo "Please complete the database setup and run:"
    echo "  npm run dev"
fi
