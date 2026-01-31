# 🛍️ E-Commerce Template

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


A modern, production-ready e-commerce template built with Next.js 14, Node.js, Express, and MongoDB. Perfect for building online stores with reusable components and best practices.

## ✨ Features

### 🎨 Frontend (Next.js 14)
- React 18 with TypeScript for type safety
- Tailwind CSS with custom design system
- Responsive Design mobile-first approach
- Component Library with shadcn/ui inspired components
- State Management with Zustand
- Form Handling with React Hook Form + Zod validation
- Image Optimization with Next.js Image component
- Payment Integration Stripe ready
- Authentication NextAuth.js integration
- Cart & Wishlist persistent storage

### ⚙️ Backend (Node.js + Express)
- RESTful API with proper HTTP methods
- MongoDB with Mongoose ODM
- JWT Authentication with refresh tokens
- File Upload with Cloudinary/Multer
- Email Service with SendGrid/Nodemailer
- Payment Processing Stripe integration
- Rate Limiting and security headers
- Logging with Winston
- Error Handling centralized error management
- Validation with express-validator

### 🐳 Deployment Ready
- Docker containers for all services
- Docker Compose for local development
- NGINX reverse proxy with SSL
- MongoDB & Redis as services
- PM2 for process management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (or Docker)
- Redis (or Docker)

### Option 1: Docker (Recommended)

1. Clone the repository:
   git clone <your-repo-url>
   cd ecommerce-template

2. Run the setup script:
   chmod +x setup.sh
   ./setup.sh

3. Start with Docker:
   docker-compose up -d

### Option 2: Local Development

1. Clone the repository:
   git clone <your-repo-url>
   cd ecommerce-template

2. Install dependencies:
   npm run install:all

3. Set up environment variables:
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local

4. Start MongoDB and Redis (if not using Docker)

5. Start development servers:
   npm run dev

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs
- MongoDB: mongodb://localhost:27017

## 📁 Project Structure

ecommerce-template/
├── frontend/                 # Next.js frontend
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── layout/         # Layout components
│   │   └── sections/       # Page sections
│   ├── lib/                # Utilities and helpers
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript definitions
│   └── public/             # Static assets
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utilities
│   │   └── config/         # Configuration
│   └── uploads/            # Uploaded files
├── shared/                 # Shared code
│   ├── types/             # Shared TypeScript types
│   └── schemas/           # Shared validation schemas
└── docker/                # Docker configuration

## 🛠️ Available Scripts

### Root Level
- npm run dev           # Start both frontend and backend in dev mode
- npm run build         # Build frontend for production
- npm run start         # Start both services in production mode
- npm run test          # Run tests (when implemented)
- npm run lint          # Lint codebase

### Frontend Only
cd frontend
- npm run dev           # Start Next.js dev server
- npm run build         # Build for production
- npm run start         # Start production server
- npm run lint          # Lint frontend code

### Backend Only
cd backend
- npm run dev           # Start with nodemon
- npm start             # Start production server
- npm test             # Run backend tests

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_test_your_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
SENDGRID_API_KEY=your_sendgrid_key

**Frontend (.env.local):**
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

## 📦 Key Dependencies

### Frontend
- next: React framework
- react / react-dom: UI library
- tailwindcss: Utility-first CSS
- zustand: State management
- react-hook-form: Form handling
- zod: Schema validation
- stripe: Payment processing
- next-auth: Authentication

### Backend
- express: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: JWT authentication
- bcryptjs: Password hashing
- stripe: Payment processing
- cloudinary: Image upload
- winston: Logging
- express-validator: Input validation

## 🐳 Docker Deployment

### Build and Run
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

### Production Deployment
1. Update environment variables in docker-compose.yml
2. Set up SSL certificates in docker/nginx/ssl/
3. Configure domain names in NGINX config
4. Set up database backups
5. Configure monitoring and logging

## 📄 API Documentation

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- GET /api/auth/me - Get current user

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- POST /api/products - Create product (Admin)
- PATCH /api/products/:id - Update product (Admin)
- DELETE /api/products/:id - Delete product (Admin)

### Categories
- GET /api/categories - Get all categories
- GET /api/categories/:id - Get single category
- POST /api/categories - Create category (Admin)

### Orders
- GET /api/orders - Get user orders
- GET /api/orders/:id - Get single order
- POST /api/orders - Create new order
- PATCH /api/orders/:id - Update order status (Admin)

### Cart
- GET /api/cart - Get user cart
- POST /api/cart - Add item to cart
- PATCH /api/cart/:itemId - Update cart item
- DELETE /api/cart/:itemId - Remove from cart

## 🔒 Security Features

- JWT Authentication with refresh tokens
- Password Hashing with bcrypt
- Rate Limiting on API endpoints
- CORS configuration
- Helmet.js security headers
- Input Validation and sanitization
- SQL/NoSQL Injection prevention
- XSS Protection
- CSRF Protection (when implemented)

## 📈 Performance Optimizations

- Image Optimization with Next.js Image
- Code Splitting and lazy loading
- API Response Caching with Redis
- Database Indexing for queries
- Compression with gzip
- CDN for static assets
- Server-side Rendering for SEO

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit changes (git commit -m 'Add amazing feature')
4. Push to branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js - React framework
- Tailwind CSS - CSS framework
- shadcn/ui - UI component inspiration
- MongoDB - Database
- Stripe - Payments


## 🔑 Key Files Reference

### Frontend
- `frontend/app/layout.tsx` - Main layout with Header & Footer
- `frontend/app/page.tsx` - Home page with all sections
- `frontend/components/layout/Header.tsx` - Navigation header
- `frontend/components/layout/Footer.tsx` - Site footer
- `frontend/components/sections/` - All home page sections
- `frontend/components/ui/` - Reusable UI components
- `frontend/lib/utils.ts` - Utility functions
- `frontend/styles/globals.css` - Global styles & Tailwind

### Backend
- `backend/src/server.js` - Main Express server
- `backend/src/models/` - Database models (User, Product, Order, etc.)
- `backend/src/controllers/` - API controllers
- `backend/src/routes/` - API routes
- `backend/src/middleware/` - Auth & validation middleware
- `backend/src/utils/` - Utilities (logger, upload, email)

### Configuration
- `docker-compose.yml` - Docker services configuration
- `Dockerfile` (frontend & backend) - Container definitions
- `docker/nginx/nginx.conf` - Reverse proxy configuration
- `package.json` (root, frontend, backend) - Dependencies
- `.env.example` - Environment variables template
- `setup.sh` - One-time setup script

### Documentation
- `README.md` - This documentation file
- `LICENSE` - MIT License file

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email shiroonigami23@gmail.com or create an issue in the repository.

---

**Happy Coding!** 🚀
