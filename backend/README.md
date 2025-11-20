# NoJob Backend API

Backend API for NoJob platform - Node.js + TypeScript + Express + MariaDB + Prisma

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MariaDB 10.6+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your .env file with database credentials

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Prisma models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   └── index.ts          # Entry point
├── prisma/
│   └── schema.prisma     # Database schema
├── logs/                 # Application logs
├── uploads/              # File uploads
└── tests/                # Test files
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### Users
- `GET /api/v1/users/profile` - Get current user profile
- `PUT /api/v1/users/profile` - Update profile
- `GET /api/v1/users/:id` - Get user by ID

### Matching
- `GET /api/v1/matching/profiles` - Get profiles to swipe
- `POST /api/v1/matching/like` - Like a profile
- `GET /api/v1/matching/matches` - Get matches

### Chat
- `GET /api/v1/chat/:matchId` - Get chat messages
- `POST /api/v1/chat/:matchId/message` - Send message
- WebSocket: Real-time messaging

### Verification
- `POST /api/v1/verification/document` - Upload document
- `POST /api/v1/verification/selfie` - Upload selfie
- `POST /api/v1/verification/video` - Upload video
- `GET /api/v1/verification/status` - Get verification status

### Support (Monthly Payment)
- `POST /api/v1/support/create` - Create monthly support
- `GET /api/v1/support/:id` - Get support details
- `POST /api/v1/support/:id/release` - Release payment

### Safety
- `POST /api/v1/safety/panic` - Trigger panic button
- `POST /api/v1/safety/report` - Report user
- `GET /api/v1/safety/reports` - Get reports (admin)

### Meeting
- `POST /api/v1/meeting/schedule` - Schedule safe meeting
- `POST /api/v1/meeting/:id/checkin` - Check-in to meeting
- `POST /api/v1/meeting/:id/safe` - Confirm safety

### Moderation
- `GET /api/v1/moderation/flagged` - Get flagged messages (admin)
- `POST /api/v1/moderation/ban` - Ban user (admin)

### Goals
- `POST /api/v1/goals/create` - Create goal
- `GET /api/v1/goals` - Get user goals
- `PUT /api/v1/goals/:id/progress` - Update progress

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting
- Input validation
- SQL injection protection (Prisma)
- XSS protection
- CORS configuration

## 🧪 Testing

```bash
npm test
```

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🚢 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📄 License

MIT

