# 🤖 Prompt to JSON Converter

A modern, AI-powered web application that converts natural language prompts into structured JSON format, perfect for better LLM understanding and prompt engineering workflows.

## ✨ Features

### 🎯 Core Functionality
- **🤖 AI-Powered Conversion**: Convert prompts to structured JSON using Z.ai SDK
- **📝 Rich Editor**: Intuitive prompt input with real-time conversion
- **📊 JSON Output**: Clean, formatted JSON with syntax highlighting
- **💾 Save History**: Store and manage your prompt conversions
- **🎨 Modern UI**: Beautiful, responsive interface with dark mode support

### 🔐 Authentication System
- **🔓 Demo Mode**: Full functionality without configuration (any email/password works)
- **🔐 Real Authentication**: Supabase integration for production use
- **👤 User Profiles**: Complete profile management with account settings
- **🎭 Mock Support**: Graceful fallback when services aren't configured

### 💰 Pricing & Monetization
- **💳 Stripe Integration**: Complete payment processing with multiple plans
- **📊 Subscription Management**: Monthly/annual billing with 20% discount
- **🎯 Free Tier**: Generous free plan for getting started
- **🏢 Enterprise Support**: Custom plans for teams and organizations

## 🛠️ Technology Stack

### 🎯 Core Framework
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Modern utility-first CSS
- **🧩 shadcn/ui** - High-quality, accessible components

### 🔐 Authentication & Database
- **🔐 Supabase** - Complete authentication and database solution
- **🗄️ Prisma ORM** - Type-safe database operations
- **🔑 NextAuth.js** - Authentication flows and session management

### 💳 Payment Processing
- **💳 Stripe** - Complete payment solution
- **🔄 Webhooks** - Real-time payment event handling
- **📊 Subscription Management** - Recurring billing support

### 🤖 AI Integration
- **🚀 Z.ai SDK** - Advanced AI capabilities
- **📝 Prompt Engineering** - Structured prompt conversion
- **🎯 JSON Formatting** - Optimized output for LLMs

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/prompt-to-json-converter.git
cd prompt-to-json-converter

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys (optional for demo mode)

# Set up database
npm run db:push

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
# Optional: For full functionality
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: For payments
STRIPE_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Optional: For AI features
Z_AI_API_KEY=your_z_ai_api_key

# Required
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── pricing/            # Pricing and subscription
│   ├── profile/            # User profile management
│   ├── success/            # Payment success page
│   └── api/               # API routes
│       ├── stripe/         # Stripe webhooks and checkout
│       ├── convert/        # AI conversion endpoint
│       └── conversions/    # Data management
├── components/              # React components
│   ├── ui/             # shadcn/ui components
│   ├── auth-form.tsx    # Authentication form
│   ├── back-button.tsx   # Navigation helper
│   └── user-profile.tsx  # Profile component
├── contexts/               # React contexts
│   └── auth-context.tsx  # Authentication state
├── lib/                   # Utilities
│   ├── db.ts           # Database client
│   ├── stripe.ts        # Stripe configuration
│   └── supabase.ts     # Supabase client (with demo mode)
└── hooks/                  # Custom React hooks
    └── use-toast.ts     # Toast notifications
```

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run lint          # Run ESLint
npm run build        # Build for production

# Database
npm run db:push      # Push schema to database
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run database migrations
npm run db:reset      # Reset database

# Production
npm run start         # Start production server
```

## 🔧 Demo Mode

The application works out-of-the-box in **demo mode**:

### ✅ What Works in Demo Mode
- **Full UI**: All pages and components work perfectly
- **Mock Authentication**: Any email/password combination works
- **AI Conversion**: Full prompt-to-JSON conversion functionality
- **Profile Management**: Complete user profile interface
- **Pricing Interface**: Explore all pricing plans and features

### 🔄 Demo Mode Limitations
- **No Data Persistence**: Data is lost on page refresh
- **Mock Payments**: No real payment processing
- **Simulated Users**: User sessions are temporary

### 🚀 Enabling Full Mode
1. **Configure Supabase**: Add URL and anon key to `.env.local`
2. **Configure Stripe**: Add payment keys for subscriptions
3. **Restart Server**: Full functionality enabled

## 💳 Payment Integration

### Supported Plans
- **Free**: $0/month - 10 conversions, basic features
- **Professional**: $19/month - Unlimited conversions, advanced features
- **Enterprise**: Custom pricing - Teams and organizations

### Payment Features
- **Multiple Billing Cycles**: Monthly and annual (20% discount)
- **Secure Processing**: Stripe-powered payment infrastructure
- **Webhook Support**: Real-time payment event handling
- **Success Pages**: Optimized post-payment experience

## 🤖 AI Features

### Prompt Conversion
- **Natural Language Processing**: Understand user intent and requirements
- **Structured Output**: Convert to optimized JSON format
- **Error Handling**: Graceful fallbacks and retry logic
- **Quality Assurance**: Validated and tested JSON output

### Supported Formats
```json
{
  "task_type": "content_creation",
  "intent": "Generate blog post about technology",
  "parameters": {
    "topic": "AI trends",
    "length": "1000 words",
    "tone": "informative"
  },
  "constraints": ["factual", "engaging"],
  "expected_output": "Blog post content",
  "complexity": "medium",
  "domain": "technology",
  "metadata": {
    "target_audience": "tech_enthusiasts",
    "seo_keywords": ["AI", "technology", "trends"]
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker
```bash
# Build image
docker build -t prompt-json-converter .

# Run container
docker run -p 3000:3000 prompt-json-converter
```

### Environment Setup
- **Node.js**: 18.x or higher
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: Supabase or custom provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Z.ai](https://chat.z.ai)** - AI SDK and prompt engineering capabilities
- **[Supabase](https://supabase.com)** - Authentication and database services
- **[Stripe](https://stripe.com)** - Payment processing infrastructure
- **[shadcn/ui](https://ui.shadcn.com)** - UI component library
- **[Next.js](https://nextjs.org)** - React framework

---

Built with ❤️ for the prompt engineering community. Powered by [Z.ai](https://chat.z.ai) 🚀