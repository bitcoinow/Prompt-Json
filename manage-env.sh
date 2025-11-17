#!/bin/bash

# Environment File Manager for Prompt to JSON Converter
# This script helps you find, view, and edit .env.local file

echo "🔑 Environment File Manager"
echo "========================="
echo ""

# Function to show current contents
show_contents() {
    if [ -f "/home/z/my-project/.env.local" ]; then
        echo "📄 Current contents of .env.local:"
        echo "----------------------------------------"
        cat "/home/z/my-project/.env.local"
        echo "----------------------------------------"
    else
        echo "❌ .env.local file not found!"
    fi
}

# Function to edit with nano
edit_with_nano() {
    echo "📝 Opening .env.local in nano..."
    nano "/home/z/my-project/.env.local"
}

# Function to edit with vim
edit_with_vim() {
    echo "📝 Opening .env.local in vim..."
    vim "/home/z/my-project/.env.local"
}

# Function to create/overwrite file
create_file() {
    echo "📝 Creating new .env.local with template..."
    cat > "/home/z/my-project/.env.local" << 'EOF'
# Supabase Configuration (Optional - Leave empty if not using Supabase)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Stripe Configuration (Live Mode)
STRIPE_SECRET_KEY=sk_live_your_live_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key_here

# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Z.ai SDK (optional)
Z_AI_API_KEY=
EOF
    echo "✅ New .env.local file created!"
}

# Function to show file location
show_location() {
    echo "📍 File location: /home/z/my-project/.env.local"
    echo "📂 Full path: $(realpath /home/z/my-project/.env.local)"
}

# Main menu
echo "Choose an option:"
echo "1) Show current contents"
echo "2) Edit with nano"
echo "3) Edit with vim"
echo "4) Create new file (overwrite)"
echo "5) Show file location"
echo "6) Exit"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        show_contents
        ;;
    2)
        edit_with_nano
        ;;
    3)
        edit_with_vim
        ;;
    4)
        echo "⚠️  This will overwrite your current .env.local file!"
        read -p "Are you sure? (y/n): " -n 1 -r
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            create_file
        else
            echo "❌ Cancelled."
        fi
        ;;
    5)
        show_location
        ;;
    6)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please try again."
        exit 1
        ;;
esac