# Sonae Construction Management System

A comprehensive web application for managing construction projects, built with Next.js and TypeScript. This system provides project tracking, document management, photo documentation, and team collaboration features for construction companies.

## 🏗️ Features

### Project Management
- **Project Overview**: Track multiple construction projects with detailed information
- **Project Types**: Support for different project types (Renovation, Maintenance, Construction)
- **Badge System**: Gold, Silver, and Bronze badges for project classification
- **Status Tracking**: Monitor project progress and completion status

### Work Management
- **Work Sections**: Organize work by sections and zones
- **Task Assignment**: Assign specific tasks to different companies and teams
- **Progress Monitoring**: Track work progress with detailed logs and updates
- **Responsible Management**: Assign project responsibilities to team members

### Documentation & Media
- **Photo Documentation**: Upload and organize construction photos by role (Supplier, Inspector, DEC)
- **Document Management**: Store and manage project documents (PDFs, specifications, certificates)
- **Date-based Organization**: Group photos and documents by month/year for easy navigation
- **Real-time Updates**: Live photo and document updates with timestamps

### User Management
- **Authentication System**: Secure login with token-based authentication
- **Role-based Access**: Different access levels for different user types
- **User Profiles**: Complete user management with contact information

### Reporting & Analytics
- **Project Reports**: Generate detailed project reports
- **Work Logs**: Track all work activities with timestamps and comments
- **Progress Analytics**: Visual progress tracking and analytics

## 🛠️ Technology Stack

- **Frontend**: Next.js 13+ with TypeScript
- **UI Framework**: Bootstrap 5 with custom components
- **State Management**: React Context API
- **Styling**: SCSS with Bootstrap theming
- **Authentication**: Cookie-based authentication with nookies
- **Date Handling**: Day.js for date manipulation
- **Icons**: Custom icon system
- **Forms**: Formik for form management

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sonae-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
sonae-website/
├── api/                    # API routes and mock data
│   ├── mocks.ts           # Mock data for development
│   ├── mockRoutes.ts      # Mock API implementations
│   └── routes.ts          # Centralized API route exports
├── components/            # Reusable UI components
│   ├── bootstrap/         # Bootstrap-based components
│   └── extras/            # Additional utility components
├── context/               # React Context providers
│   └── loginContext.tsx   # Authentication context
├── hooks/                 # Custom React hooks
├── pages/                 # Next.js pages
│   ├── auth-pages/        # Authentication pages
│   ├── fotosProj/         # Photo documentation pages
│   ├── projetos/          # Project management pages
│   └── _app.tsx           # Main app component
├── common/                # Shared utilities and data
│   ├── data/              # Static data and constants
│   └── partial/           # Shared partial components
└── public/                # Static assets
```

## 🔧 Development

### Mock Data System
The application includes a comprehensive mock data system for development and demonstration purposes:

- **Mock API Routes**: All API calls are mocked for offline development
- **Realistic Data**: Construction projects, companies, users, and documents
- **Real Images**: High-quality construction photos from Unsplash
- **Complete Workflows**: Full project lifecycle simulation

### Key Development Files
- `api/mocks.ts`: Contains all mock data
- `api/mockRoutes.ts`: Mock implementations of API functions
- `api/routes.ts`: Centralized API route management
- `context/loginContext.tsx`: Authentication management
- `MOCK_SETUP.md`: Documentation for mock system

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx tsc --noEmit     # Type checking
```

## 🎯 Key Features in Detail

### Project Management
- Create and manage construction projects
- Assign projects to different companies and teams
- Track project progress with detailed status updates
- Organize projects by type and badge classification

### Photo Documentation
- Upload construction photos with role-based organization
- Group photos by month/year for easy navigation
- Support for multiple user roles (Supplier, Inspector, DEC)
- Real-time photo updates with timestamps

### Work Tracking
- Detailed work section and zone management
- Task assignment and progress tracking
- Comprehensive logging system
- Real-time updates and notifications

### Document Management
- Store project documents (PDFs, specifications, certificates)
- Organize documents by project and type
- Easy document access and download
- Version control and update tracking

## 🔐 Authentication

The system uses a token-based authentication system:
- Secure login with email/password
- Token-based session management
- Role-based access control
- Automatic session refresh

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices
- Various screen sizes and orientations

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
Configure the following environment variables for production:
- `NEXT_PUBLIC_PRIMARY_COLOR`: Primary theme color
- `NEXT_PUBLIC_SECONDARY_COLOR`: Secondary theme color
- `NEXT_PUBLIC_SUCCESS_COLOR`: Success theme color

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software developed for Sonae. All rights reserved.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for Sonae Construction Management**# Manegement-Sonae-with-mocks
