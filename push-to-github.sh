#!/bin/bash

# GitHub Push Script for Prompt to JSON Converter
# This script helps you push your project to GitHub

echo "🤖 Prompt to JSON Converter - GitHub Push Script"
echo "============================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: This is not a Git repository."
    echo "Run: git init"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 You have uncommitted changes:"
    git status --porcelain
    echo ""
    echo "Please commit your changes first:"
    echo "  git add ."
    echo "  git commit -m 'Your commit message'"
    echo ""
    read -p "Do you want to commit and continue? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    
    # Add and commit changes
    git add .
    read -p "Enter commit message: " -r
    git commit -m "$commit_message"
fi

# Get GitHub repository URL
echo ""
echo "📋 GitHub Repository Setup"
echo "========================="
echo ""

if [ -z "$(git remote get-url origin 2>/dev/null)" ]; then
    echo "No GitHub remote found."
    echo ""
    read -p "Enter your GitHub username: " github_username
    read -p "Enter your repository name: " repo_name
    
    if [ -z "$github_username" ] || [ -z "$repo_name" ]; then
        echo "❌ Error: Username and repository name are required."
        exit 1
    fi
    
    repo_url="https://github.com/${github_username}/${repo_name}.git"
    echo "Setting remote to: $repo_url"
    git remote add origin $repo_url
else
    repo_url=$(git remote get-url origin)
    echo "Found existing remote: $repo_url"
fi

echo ""
echo "🚀 Pushing to GitHub..."
echo "====================="

# Push to GitHub
echo "Pushing branch 'master' to $repo_url..."
git push -u origin master

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Your code has been pushed to GitHub."
    echo ""
    echo "📁 Repository URL: $repo_url"
    echo "🌐 View your code at: $(echo $repo_url | sed 's/\.git$/\/')"
    echo ""
    echo "🎯 Next steps:"
    echo "  1. Visit your repository on GitHub"
    echo "  2. Review the pushed code"
    echo "  3. Set up GitHub Pages if needed"
    echo "  4. Configure GitHub Actions for CI/CD"
else
    echo ""
    echo "❌ Error: Failed to push to GitHub."
    echo ""
    echo "Troubleshooting:"
    echo "  • Check your GitHub credentials"
    echo "  • Verify the repository URL"
    echo "  • Make sure you have push permissions"
    echo "  • Check your internet connection"
fi

echo ""
echo "Done! 🎉"