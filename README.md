# 🛍️ E-Commerce Template

A production-ready, full-stack e-commerce template built with modern technologies. Perfect for building online stores, marketplaces, or any e-commerce application.

## 🌟 Features

### Frontend (Next.js 14)
- **Next.js 14** with App Router and React 18
- **TypeScript** for type safety
- **Tailwind CSS** with custom design system
- **Reusable UI Components** (Button, Input, Toast, Badge, Avatar, etc.)
- **State Management** with Zustand
- **Form Handling** with React Hook Form + Zod validation
- **Image Optimization** with Next.js Image
- **Payment Integration** Stripe ready
- **Authentication** NextAuth.js integration
- **Cart & Wishlist** with persistent storage

### Backend (Node.js + Express)
- **Express.js** RESTful API
- **MongoDB** with Mongoose ODM
- **JWT Authentication** with refresh tokens
- **File Upload** with Cloudinary/Multer
- **Email Service** with SendGrid/Nodemailer
- **Payment Processing** Stripe integration
- **Rate Limiting** and security headers
- **Winston Logging**
- **Error Handling** centralized system
- **Input Validation** with express-validator

### DevOps & Deployment
- **Docker** containers for all services
- **Docker Compose** for local development
- **NGINX** reverse proxy with SSL
- **GitHub Actions** CI/CD pipelines
- **Vercel** deployment ready
- **MongoDB & Redis** as services
- **PM2** for process management

## 📁 Project Structure

ecommerce-template/
├── frontend/                 # Next.js 14 frontend
│   ├── app/                 # App router pages
│   │   ├── layout.tsx      # Root layout with Header & Footer
│   │   └── page.tsx        # Home page with all sections
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── layout/        # Layout components (Header, Footer)
│   │   └── sections/      # Home page sections
│   ├── lib/               # Utilities and helpers
│   ├── hooks/             # Custom React hooks
│   ├── styles/            # Global styles
│   └── public/            # Static assets
├── backend/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # API controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── utils/         # Utilities
│   └── uploads/           # Uploaded files
├── shared/                # Shared code
│   ├── types/            # TypeScript types
│   └── schemas/          # Validation schemas
├── .github/workflows/     # GitHub Actions
└── docker/               # Docker configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (or Docker)
- Git

### Installation

1. Clone the repository:
git clone https://github.com/shiroonigami23-ui/ecommerce-template.git
cd ecommerce-template

2. Install dependencies:
npm install
cd frontend && npm install
cd ../backend && npm install

3. Set up environment variables:
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

4. Start development servers:
npm run dev

### Docker Setup
docker-compose up -d

## 🔧 Configuration

### Environment Variables

Backend (.env):
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_test_your_key
CLOUDINARY_CLOUD_NAME=your_cloud_name

Frontend (.env.local):
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

## 📡 API Endpoints

### Authentication
POST /api/auth/register - Register new user
POST /api/auth/login - User login
GET /api/auth/me - Get current user

### Products
GET /api/products - Get all products
GET /api/products/:id - Get single product
POST /api/products - Create product (Admin)
PUT /api/products/:id - Update product (Admin)
DELETE /api/products/:id - Delete product (Admin)

### Categories
GET /api/categories - Get all categories
GET /api/categories/:id - Get single category

### Orders
GET /api/orders - Get user orders
POST /api/orders - Create new order
GET /api/orders/:id - Get single order

### Cart
GET /api/cart - Get user cart
POST /api/cart - Add item to cart
PUT /api/cart/:itemId - Update cart item
DELETE /api/cart/:itemId - Remove from cart

## 🐳 Docker Deployment

### Build and Run
docker-compose build
docker-compose up -d

### Access Services
Frontend: https://localhost:3000
Backend API: https://localhost:5000/api
MongoDB: mongodb://localhost:27017
Redis: redis://localhost:6379

## 🔐 Security Features

- JWT Authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js security headers
- Input validation and sanitization
- SQL/NoSQL injection prevention
- XSS protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow existing code patterns
- Add comments for complex logic
- Write meaningful commit messages

### Testing
- Write unit tests for new features
- Test API endpoints
- Test UI components
- Ensure responsive design

## 📊 GitHub Actions Workflows

- CI/CD Pipeline: Automated testing and deployment
- Security Scan: Weekly vulnerability scanning
- Docker Updates: Auto-updates base images
- Vercel Deploy: Auto-deploys to production
- Issue/PR Automation: Auto-labels and assignments

## 🛠️ Development

### Frontend Development
cd frontend
npm run dev

### Backend Development
cd backend
npm run dev

### Database Management
mongosh
use ecommerce
show collections

### Testing
npm test

## 📞 Support

For support, email shiroonigami23@gmail.com or create an issue in the repository.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for utility-first CSS
- MongoDB for the database
- Stripe for payment processing
- All open-source contributors

---

## 🎯 Getting Started Checklist

- [ ] Clone the repository
- [ ] Install dependencies
- [ ] Set up environment variables
- [ ] Start MongoDB
- [ ] Run development servers
- [ ] Access frontend at http://localhost:3000
- [ ] Access backend at http://localhost:5000/api
- [ ] Set up GitHub Secrets for CI/CD
- [ ] Deploy to your preferred cloud platform

Happy coding! 🚀
