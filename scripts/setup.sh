#!/bin/bash

# 2027 Full-Stack Monorepo Setup Script
# This script sets up your development environment

set -e

echo "🚀 Setting up 2027 Full-Stack Monorepo..."
echo ""

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js 20+ is required. You have $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v)"

# Check Python version
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
    echo "✅ Python $(python3 --version)"
else
    echo "❌ Python 3.12+ is required but not found"
    exit 1
fi

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    corepack enable
    corepack prepare pnpm@latest --activate
fi
echo "✅ pnpm $(pnpm -v)"

# Install Node.js dependencies
echo ""
echo "📦 Installing Node.js dependencies..."
pnpm install

# Setup Python virtual environment
echo ""
echo "🐍 Setting up Python virtual environment..."
cd services/api-python
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi

# Activate and install Python dependencies
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
echo "✅ Python dependencies installed"
cd ../..

# Copy environment file
echo ""
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
    echo "⚠️  Please update .env with your configuration"
else
    echo "ℹ️  .env file already exists"
fi

# Check Docker
echo ""
if command -v docker &> /dev/null; then
    echo "✅ Docker $(docker --version | cut -d' ' -f3 | cut -d',' -f1)"
    echo "ℹ️  You can run 'docker compose up' to start all services"
else
    echo "⚠️  Docker not found. Install Docker Desktop for containerized development"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env with your configuration"
echo "  2. Run 'pnpm dev' to start all services"
echo "  3. Run 'docker compose up' for containerized development"
echo ""
echo "Services will be available at:"
echo "  • Frontend:     http://localhost:3000"
echo "  • Python API:   http://localhost:8000"
echo "  • Node.js API:  http://localhost:3001"
echo "  • Python Docs:  http://localhost:8000/docs"
echo ""
