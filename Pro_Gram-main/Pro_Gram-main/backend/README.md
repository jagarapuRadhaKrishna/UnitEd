# 🚀 United Platform Backend

> Professional backend service for United Platform - A student & faculty collaboration platform built with **Express.js**, **Node.js**, **TypeScript**, and **PostgreSQL**.

## 📊 Status

- **Version**: 0.5.0
- **Completion**: ~50%
- **Last Updated**: January 31, 2026
- **API Level**: v1
- **Production Ready**: Not yet (Phase 1 pending)

## 🎯 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Setup environment variables
cp .env.example .env
# Edit .env with your database credentials and secrets

# 3. Generate Prisma client
npm run prisma:generate

# 4. Run database migrations
npm run prisma:migrate

# 5. Start development server
npm run dev
```

Server will start at: **http://localhost:5000**

### Verify Installation

```bash
# Health check endpoint
curl http://localhost:5000/api/v1/health

# Response:
# {"status":"ok","timestamp":"2026-01-31T10:30:00.000Z"}
```

---

## 📋 Available Scripts

```bash
npm run dev              # Start with hot reload (tsx watch)
npm run build            # Compile TypeScript to JavaScript
npm start                # Run compiled code (production)

npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Create and run database migrations
npm run prisma:studio    # Launch Prisma Studio (visual database GUI)
npm run prisma:seed      # Seed database with test data (if available)

npm run lint             # Run ESLint for code quality
npm run lint:fix         # Fix linting issues automatically
npm run type-check       # TypeScript type checking
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.ts                    # Express server entry point
│   ├── controllers/                # HTTP request handlers
│   │   └── postController.ts      # Post CRUD operations
│   ├── services/                   # Business logic layer
│   │   └── postService.ts         # Database operations
│   ├── routes/                     # API endpoint definitions
│   │   ├── index.ts               # Route aggregation
│   │   └── posts.ts               # Post routes
│   ├── middleware/                 # Request middleware
│   │   └── auth.ts                # JWT authentication & RBAC
│   ├── types/                      # TypeScript interfaces
│   │   └── index.ts               # All type definitions
│   └── utils/                      # Helper functions
│       └── jwt.ts                 # Token generation/verification
├── prisma/
│   ├── schema.prisma              # Database models
│   └── migrations/                # Database version history
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

---

## 🌐 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
Most endpoints require JWT token in the `Authorization` header:
```http
Authorization: Bearer <your-jwt-token>
```

### Response Format
All responses follow this structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## 📚 Implemented Endpoints

### Posts API (✅ Fully Implemented)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/posts` | Optional | Get all posts (paginated) |
| GET | `/posts/:id` | Optional | Get single post |
| GET | `/posts/search?q=term` | None | Search posts |
| GET | `/posts/category/:category` | None | Filter by category |
| GET | `/posts/my-posts` | ✅ Required | User's own posts |
| GET | `/posts/matched` | ✅ Required | Skill-matched posts |
| POST | `/posts` | ✅ Required | Create post |
| PUT | `/posts/:id` | ✅ Required | Update post (owner only) |
| DELETE | `/posts/:id` | ✅ Required | Delete post (owner only) |
| PATCH | `/posts/:id/close` | ✅ Required | Close post |

#### Example: Create Post
```bash
curl -X POST http://localhost:5000/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "AI Research Project",
    "description": "Research on machine learning algorithms",
    "category": "RESEARCH",
    "requiredSkills": ["Python", "TensorFlow"],
    "teamSizeNeeded": 4,
    "deadline": "2026-06-30",
    "visibility": "PUBLIC"
  }'
```

#### Example: Get Posts
```bash
curl "http://localhost:5000/api/v1/posts?page=1&limit=10&category=PROJECT"
```

---

## 🔐 Authentication Endpoints (❌ TODO)

The following authentication endpoints need to be implemented:

```
POST   /auth/register          - User registration
POST   /auth/login             - User login
POST   /auth/refresh-token     - Refresh access token
POST   /auth/logout            - Logout user
POST   /auth/verify-email      - Verify email address
POST   /auth/forgot-password   - Password reset request
```

---

## 👤 User Endpoints (❌ TODO)

```
GET    /users/:id              - Get user profile
PUT    /users/:id              - Update profile
DELETE /users/:id              - Delete account
GET    /users/search?q=search  - Search users
```

---

## 📝 Application Endpoints (❌ TODO)

```
POST   /applications           - Apply to post
GET    /applications/:id       - View application
PUT    /applications/:id       - Update status
GET    /posts/:id/applications - View all applications for post
```

---

## 📨 Invitation Endpoints (❌ TODO)

```
POST   /invitations            - Send invitation
PUT    /invitations/:id        - Accept/reject invitation
GET    /invitations            - Get my invitations
```

---

## 💬 Chat Endpoints (❌ TODO)

```
POST   /chatrooms              - Create chatroom
GET    /chatrooms/:id          - Get chatroom messages
POST   /messages               - Send message (WebSocket planned)
```

---

## 🗄️ Database

### Models Implemented

- **User** - User accounts with roles (STUDENT, FACULTY, ADMIN)
- **Post** - Projects, research, internship opportunities
- **Application** - Applications to posts
- **Invitation** - Direct user invitations
- **TeamMember** - Team composition for posts
- **Chatroom** - Post discussion spaces
- **Message** - Chat messages
- **Comment** - Post comments
- **Attachment** - File uploads
- **Notification** - System notifications
- **SocialLink** - User social profiles

### Database Migrations

```bash
# Create new migration
npm run prisma:migrate dev --name <migration-name>

# Apply pending migrations
npm run prisma:migrate deploy

# View migration history
npm run prisma:migrate status

# Rollback (in dev only)
npm run prisma:migrate resolve --rolled-back <migration-name>
```

### Prisma Studio (Visual Database UI)

```bash
npm run prisma:studio
# Opens browser at http://localhost:5555
```

---

## 🔒 Security Features

### Implemented ✅
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs support (not yet integrated)
- **CORS**: Configurable cross-origin requests
- **Helmet**: Security headers protection
- **SQL Injection Prevention**: Prisma parameterized queries
- **Role-Based Access Control**: STUDENT, FACULTY, ADMIN roles
- **Rate Limiting**: express-rate-limit (ready but not enforced)
- **Input Validation**: express-validator (ready but not used)

### TODO 🚧
- [ ] Email verification
- [ ] Password reset flow
- [ ] CSRF protection
- [ ] XSS prevention headers
- [ ] Request timeout limits
- [ ] Error message sanitization
- [ ] Audit logging
- [ ] Two-factor authentication (phase 2+)

---

## 📊 Performance Considerations

### Current Optimizations ✅
- Database indexes on frequently queried fields
- Pagination for large result sets
- Efficient database queries with Prisma
- Middleware chaining for efficiency

### Recommended Improvements 🚧
- [ ] Implement Redis caching
- [ ] Use connection pooling
- [ ] Compress responses (gzip)
- [ ] Enable query result caching
- [ ] Implement CDN for file uploads
- [ ] Database query optimization
- [ ] Lazy loading relationships

---

## 🧪 Testing (TODO)

```bash
npm test                  # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
npm run test:e2e        # End-to-end tests
```

Target: 80%+ code coverage

---

## 📝 Code Quality

### Linting & Type Checking
```bash
npm run lint             # Check code quality
npm run lint:fix         # Auto-fix issues
npm run type-check       # TypeScript validation
```

### Code Standards
- ESLint configuration applied
- TypeScript strict mode
- Prettier formatting (recommended)
- Comments on complex functions

---

## 🌍 Environment Setup

### Development Environment

Create `.env` file:
```env
PORT=5000
HOST=localhost
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/united_db
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
CORS_ORIGIN=http://localhost:3000
API_VERSION=v1
```

### Production Environment

Set these environment variables:
```env
NODE_ENV=production
PORT=5000 (or your port)
DATABASE_URL=your-production-db-url
JWT_SECRET=secure-random-32+-char-key
JWT_REFRESH_SECRET=secure-random-32+-char-key
CORS_ORIGIN=https://yourdomain.com
```

---

## 🚀 Deployment

### Docker (Recommended)
```bash
# Build image
docker build -t united-backend .

# Run container
docker run -e DATABASE_URL=... -p 5000:5000 united-backend
```

### Heroku
```bash
heroku login
heroku create your-app-name
heroku addons:create heroku-postgresql:standard-0
git push heroku main
```

### AWS EC2
```bash
# SSH into instance
ssh -i key.pem ubuntu@your-instance

# Install Node and dependencies
curl -fsSL https://nodejs.org/dist/v18.0.0/node-v18.0.0-linux-x64.tar.xz | tar xJ
npm install -g pm2

# Deploy
pm2 start npm --name "united-backend" -- run start
pm2 save
```

---

## 🐛 Troubleshooting

### "Cannot find module" Error
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run prisma:generate
```

### "Database connection failed"
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Verify DATABASE_URL in .env
# Format: postgresql://user:password@localhost:5432/dbname

# Test connection
psql $DATABASE_URL
```

### "JWT Secret not set"
```bash
# Add to .env
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET=$JWT_SECRET" >> .env
```

### Port Already in Use
```bash
# Change PORT in .env
PORT=5001

# Or kill process using port 5000
lsof -i :5000  # Find PID
kill -9 <PID>
```

---

## 📚 Documentation Files

- **[BACKEND_DOCUMENTATION.md](../BACKEND_DOCUMENTATION.md)** - Complete code review & architecture
- **[.env.example](./.env.example)** - Environment variables template
- **[prisma/schema.prisma](./prisma/schema.prisma)** - Database schema
- **[src/types/index.ts](./src/types/index.ts)** - TypeScript interfaces

---

## 🤝 Contributing

### Before Committing
```bash
npm run lint:fix      # Fix formatting issues
npm run type-check    # Check types
npm test              # Run tests
```

### Code Review Checklist
- [ ] All types are properly defined
- [ ] Error handling is present
- [ ] Database queries are optimized
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No hardcoded secrets
- [ ] Input is validated

---

## 📦 Dependencies Overview

### Production
- **express**: Web framework
- **@prisma/client**: Database ORM
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **helmet**: Security headers
- **cors**: Cross-origin support
- **morgan**: HTTP logging
- **dotenv**: Environment variables
- **express-validator**: Input validation
- **express-rate-limit**: Rate limiting

### Development
- **typescript**: Type safety
- **tsx**: TypeScript execution
- **prisma**: Database toolkit
- **eslint**: Code linting

---

## 📞 Support & Questions

### Common Issues
1. **Port in use**: Change `PORT` in `.env`
2. **Database error**: Check `DATABASE_URL` format
3. **Type errors**: Run `npm run type-check`
4. **Module not found**: Run `npm install`

### Need Help?

1. Check [BACKEND_DOCUMENTATION.md](../BACKEND_DOCUMENTATION.md)
2. Review example code in [src/examples/](./src/examples/)
3. Check TypeScript types in [src/types/index.ts](./src/types/index.ts)
4. Review service logic in [src/services/](./src/services/)

---

## 📈 Roadmap

### Phase 1: Core Setup 🔄
- [x] Express server
- [x] Middleware setup
- [x] Database models
- [x] Post endpoints
- [ ] Input validation
- [ ] Error logging
- [ ] Rate limiting

### Phase 2: Authentication 🔄
- [ ] User registration
- [ ] Login endpoint
- [ ] Token refresh
- [ ] Email verification
- [ ] Password reset

### Phase 3: User Management 🔄
- [ ] User profiles
- [ ] Skills management
- [ ] Profile pictures
- [ ] User search

### Phase 4: Applications & Invitations
- [ ] Application submission
- [ ] Invitation system
- [ ] Status notifications

### Phase 5: Real-time Chat
- [ ] WebSocket integration
- [ ] Message persistence
- [ ] Typing indicators
- [ ] Read receipts

### Phase 6: Testing & Docs
- [ ] Unit tests
- [ ] Integration tests
- [ ] API documentation (Swagger)

### Phase 7: Deployment
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Production database
- [ ] Monitoring

---

## 📄 License

MIT License - See LICENSE file

---

## 👥 Team

| Role | Status |
|------|--------|
| Backend Lead | In Progress |
| Database Admin | ✅ Complete |
| DevOps Engineer | TODO |
| QA Engineer | TODO |

---

## 🎯 Next Steps

1. **Create `.env` file** from `.env.example`
2. **Setup PostgreSQL database**
3. **Run `npm install && npm run prisma:migrate`**
4. **Start development**: `npm run dev`
5. **Implement Phase 1** from roadmap
6. **Run tests** and validate endpoints

---

**Last Updated**: January 31, 2026  
**Backend Version**: 0.5.0  
**Status**: Ready for Development ✅
