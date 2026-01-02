# Eduverse - Learning Management System

A full-stack Learning Management System (LMS) platform built with Next.js and Node.js, featuring course management, student enrollment, progress tracking, and payment integration with Stripe.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

Eduverse is a modern learning management system that provides a comprehensive platform for online education. It offers separate interfaces for teachers and students, with features for course creation, content management, progress tracking, and secure payment processing.

## ✨ Features

### For Students
- 🎓 Browse and enroll in courses
- 📊 Track course progress across multiple sections and chapters
- 📹 Watch video lectures with integrated video player
- 💳 Secure payment processing via Stripe
- 👤 Personal profile and settings management
- 📈 View billing history and enrolled courses
- 🔍 Search and filter courses by category

### For Teachers
- ✏️ Create and manage courses
- 📝 Add sections and chapters with rich content
- 🎥 Upload video content to AWS S3
- 📊 Track student enrollments
- 💰 View billing and transaction history
- 🎨 Course customization with images and pricing
- 🗂️ Drag-and-drop content organization

### General Features
- 🔐 Secure authentication with Clerk
- 🎨 Modern, responsive UI with TailwindCSS and shadcn/ui
- 🌗 Clean and intuitive user interface
- 📱 Mobile-friendly design
- 🚀 Fast performance with Next.js 16
- 🔄 Real-time state management with Redux Toolkit
- 🎭 Role-based access control (Student/Teacher)
- 🔔 Toast notifications for user feedback

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: TailwindCSS 4, shadcn/ui components
- **Authentication**: Clerk
- **State Management**: Redux Toolkit (RTK Query)
- **Forms**: React Hook Form + Zod validation
- **Payment**: Stripe React
- **Video Player**: Video.js, React Player
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Drag & Drop**: @hello-pangea/dnd
- **File Upload**: FilePond

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: AWS DynamoDB with Dynamoose ODM
- **Authentication**: Clerk Express
- **Payment Processing**: Stripe
- **Storage**: AWS S3
- **API Design**: RESTful
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **File Upload**: Multer

### DevOps & Infrastructure
- **Containerization**: Docker
- **Cloud**: AWS (Lambda, DynamoDB, S3)
- **Serverless**: Serverless-http
- **Version Control**: Git

## 🏗️ Architecture

The application follows a modern full-stack architecture:

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Next.js)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Pages     │  │  Components  │  │  State (RTK)  │  │
│  │  (Routes)   │  │   (shadcn)   │  │    Query      │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │       Clerk Auth + Middleware (RBAC)             │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS/REST API
                           │
┌─────────────────────────────────────────────────────────┐
│                  Server (Express + AWS)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Controllers  │  │    Models    │  │    Routes    │  │
│  │              │  │  (Dynamoose) │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │    Clerk Express Auth + Helmet + CORS            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼─────┐     ┌────▼─────┐    ┌─────▼────┐
    │  DynamoDB│     │  AWS S3  │    │  Stripe  │
    │ (Database)│     │ (Storage)│    │(Payments)│
    └──────────┘     └──────────┘    └──────────┘
```

### Key Design Patterns
- **Separation of Concerns**: Clean separation between client, server, and data layers
- **RESTful API**: Standard HTTP methods and resource-based routing
- **Component-Based Architecture**: Reusable UI components with shadcn/ui
- **State Management**: Centralized state with Redux Toolkit Query
- **Authentication Flow**: JWT-based authentication with Clerk
- **Role-Based Access Control**: Middleware-based route protection
- **Serverless-Ready**: Deployable to AWS Lambda

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- AWS Account (for DynamoDB and S3)
- Clerk Account (for authentication)
- Stripe Account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd learning_management_system
   ```

2. **Install dependencies**

   **Client:**
   ```bash
   cd client
   npm install
   ```

   **Server:**
   ```bash
   cd server
   npm install
   ```

3. **Set up environment variables** (see [Environment Variables](#environment-variables))

4. **Run DynamoDB locally (for development)**
   ```bash
   # Install DynamoDB Local or use Docker
   docker run -p 8000:8000 amazon/dynamodb-local
   ```

5. **Seed the database (optional)**
   ```bash
   cd server
   npm run seed
   ```

6. **Start the development servers**

   **Server (Terminal 1):**
   ```bash
   cd server
   npm run dev
   ```

   **Client (Terminal 2):**
   ```bash
   cd client
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8001

## 🔐 Environment Variables

### Client (.env.local)
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/signin
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Server (.env)
```env
# Server Configuration
PORT=8001
NODE_ENV=development

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# S3 Configuration
S3_BUCKET_NAME=your_bucket_name

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
```

## 📁 Project Structure

```
learning_management_system/
├── client/                      # Next.js frontend application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   │   ├── (auth)/          # Authentication routes
│   │   │   │   ├── signin/
│   │   │   │   └── signup/
│   │   │   ├── (dashboard)/     # Dashboard routes (protected)
│   │   │   │   ├── teacher/     # Teacher dashboard
│   │   │   │   └── user/        # Student dashboard
│   │   │   ├── (nondashboard)/  # Public routes
│   │   │   │   ├── landing/
│   │   │   │   ├── search/
│   │   │   │   └── checkout/
│   │   │   └── (onboarding)/    # User onboarding
│   │   │       └── setup/
│   │   ├── components/          # Reusable React components
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── AppSidebar.tsx
│   │   │   ├── CourseCard.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ...
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utility functions and schemas
│   │   ├── state/               # Redux store and API
│   │   └── types/               # TypeScript type definitions
│   ├── middleware.ts            # Clerk auth middleware
│   ├── package.json
│   └── tailwind.config.ts
│
├── server/                      # Express.js backend application
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   │   ├── courseController.ts
│   │   │   ├── transactionController.ts
│   │   │   ├── userClerkController.ts
│   │   │   └── userCourseProgressController.ts
│   │   ├── models/              # DynamoDB models
│   │   │   ├── courseModel.ts
│   │   │   ├── transactionModel.ts
│   │   │   └── userCourseProgressModel.ts
│   │   ├── routes/              # API routes
│   │   │   ├── courseRoutes.ts
│   │   │   ├── transactionRoutes.ts
│   │   │   ├── userClerkRoutes.ts
│   │   │   └── userCourseProgressRoutes.ts
│   │   ├── seed/                # Database seeding
│   │   │   ├── seedDynamodb.ts
│   │   │   └── data/
│   │   ├── utils/               # Helper functions
│   │   └── index.ts             # Server entry point
│   ├── Dockerfile               # Container configuration
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                    # This file
```

## 📡 API Endpoints

### Courses
- `GET /courses` - List all courses (with optional category filter)
- `GET /courses/:courseId` - Get course details
- `POST /courses` - Create new course (Teacher only)
- `PUT /courses/:courseId` - Update course (Teacher only)
- `DELETE /courses/:courseId` - Delete course (Teacher only)
- `POST /courses/:courseId/sections/:sectionId/chapters/:chapterId/get-upload-url` - Get S3 upload URL

### User Course Progress
- `GET /users/course-progress/:userId` - Get user's enrolled courses
- `GET /users/course-progress/:userId/:courseId` - Get course progress
- `PUT /users/course-progress/:userId/:courseId` - Update course progress

### Transactions
- `GET /transactions?userId=:userId` - List user transactions
- `POST /transactions/stripe/payment-intent` - Create Stripe payment intent
- `POST /transactions` - Create transaction record

### User Management
- `PUT /users/clerk/:userId` - Update user profile

## 🚢 Deployment

### Frontend (Vercel)
The Next.js frontend can be easily deployed to Vercel:

```bash
cd client
vercel deploy
```

### Backend (AWS Lambda)
The backend is configured for serverless deployment:

1. **Build Docker image:**
   ```bash
   cd server
   docker build -t learning-management-server .
   ```

2. **Push to AWS ECR and deploy to Lambda**
   Follow AWS Lambda deployment guide for container images

3. **Configure environment variables** in AWS Lambda console

### Database (AWS DynamoDB)
- Production uses AWS DynamoDB
- Development uses DynamoDB Local
- Tables are created automatically via Dynamoose

## 🔒 Security Features

- **Authentication**: Clerk-based JWT authentication
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Zod schemas for form validation
- **API Security**: Helmet middleware for HTTP headers
- **CORS**: Configured CORS policies
- **Environment Variables**: Sensitive data stored in .env files
- **Payment Security**: Stripe for PCI-compliant payment processing

## 🧪 Development Scripts

### Client
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Server
```bash
npm run dev      # Start development server with auto-reload
npm run build    # Compile TypeScript
npm run start    # Build and start server
npm run seed     # Seed database with sample data
npm run clean    # Clean build directory
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Clerk for authentication solutions
- shadcn for the beautiful UI components
- AWS for cloud infrastructure
- Stripe for payment processing

---

**Built with ❤️ using Next.js, Express, and AWS**
