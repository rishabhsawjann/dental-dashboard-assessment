# DentalCare Dashboard

A modern React-based dental practice management system with role-based access for administrators and patients.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd dental-dashboard

# Install dependencies
npm install

# Start development server
npm start
```


### Demo Credentials
- **Admin**: `admin@entnt.in` / `admin123`
- **Patient**: `john.doe@entnt.in` / `patient123`

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19.1.0 with React Router DOM 7.6.3
- **Styling**: Tailwind CSS 3.4.17
- **Icons**: Lucide React 0.525.0
- **Charts**: Recharts 3.0.2
- **PDF Generation**: jsPDF 3.0.1
- **Progress Bars**: React Circular Progressbar 2.2.0

### Project Structure
```
src/
├── components/
│   ├── Admin/           # Admin-specific components
│   │   ├── Dashboard.jsx
│   │   ├── MainLayout.jsx
│   │   ├── PatientsManagement.jsx
│   │   ├── IncidentManagement.jsx
│   │   ├── AppointmentsPage.jsx
│   │   ├── CalendarPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── Sidebar.jsx
│   └── Patient/         # Patient-specific components
│       ├── PatientLayout.jsx
│       ├── PatientDetailsPage.jsx
│       ├── PatientUpcomingPage.jsx
│       ├── PatientHistoryPage.jsx
│       └── PatientSettingsPage.jsx
├── context/
│   ├── AuthContext.jsx      # Authentication state management
│   └── AppDataContext.jsx   # Application data management
├── constants/
│   └── services.js          # Dental services configuration
└── utils/                   # Utility functions
```

### State Management
The app uses React Context API for state management:

- **AuthContext**: Handles user authentication and role-based routing
- **AppDataContext**: Manages patients, appointments, and incidents data with localStorage persistence

### Routing Structure
- `/login` - Authentication page
- `/dashboard` - Admin dashboard (protected)
- `/patients` - Patient management (admin only)
- `/patients/:id/*` - Patient-specific pages (role-based access)
- `/appointments` - Appointment management (admin only)
- `/calendar` - Calendar view (admin only)
- `/settings` - Settings page (role-based)

## 🔧 Technical Decisions

### 1. Client-Side Data Management
- **Decision**: Using localStorage for data persistence instead of a backend
- **Rationale**: Backend was not allowed in the requirements - no external APIs, auth libraries, or server setup permitted 
- **Trade-offs**: Data persistence is limited to browser storage, but it's perfect for a working demo that anyone can run locally

### 2. Role-Based Access Control
- **Decision**: Simple role-based routing with hardcoded user credentials
- **Rationale**: For a demo app, I didn't want to overcomplicate things with a full auth system. This approach lets me focus on the core functionality
- **Implementation**: Used React Context to manage user state - it's lightweight and perfect for this use case

### 3. Component Architecture
- **Decision**: Separate Admin and Patient component directories
- **Rationale**: Keeps the codebase organized and makes it easier to find specific functionality. Also helps when working on role-specific features
- **Benefits**: Clear separation makes the code more maintainable and easier to understand

### 4. Styling Approach
- **Decision**: Tailwind CSS with custom gradients and animations
- **Rationale**: Tailwind lets me build UI quickly without writing custom CSS. The gradients and animations make it look modern and polished
- **Features**: Built with mobile-first responsive design, and the styling is consistent across all components

### 5. Data Generation
- **Decision**: Sample data generation in AppDataContext
- **Rationale**: Needed realistic data to demonstrate the app's capabilities without requiring users to manually create test data
- **Implementation**: Created a simple data generator that creates random appointments with realistic dates and costs

## 🐛 Known Issues

### 1. Data Persistence
- **Issue**: Data is stored in localStorage and lost on browser clear
- **Impact**: Users lose their data if they clear browser cache, which is annoying but expected for a demo
- **Workaround**: Could add export/import functionality if needed

### 2. File Upload Limitations
- **Issue**: File uploads are stored as base64 in localStorage
- **Impact**: Large files can slow things down and hit browser storage limits pretty quickly
- **Workaround**: Should probably add file size limits and maybe some compression

### 3. Authentication Security
- **Issue**: Hardcoded credentials in client-side code
- **Impact**: Obviously not secure for real use, but works fine for demo purposes
- **Note**: This is by design for the demo - in a real app you'd want proper auth

### 4. Responsive Design Edge Cases
- **Issue**: Some components may not work optimally on very small screens
- **Impact**: Mobile experience could be better, especially on older phones
- **Areas**: The tables and forms get cramped on small screens - need to work on that


## ✨ Key Features Built

1. **Smart Patient Management**: Profile photos, custom tags, visit analytics, and advanced search with pagination
2. **Interactive Appointments**: File attachments, timeline/table views, status tracking, and PDF invoice generation
3. **Analytics Dashboard**: Revenue charts, patient statistics, service analytics, and real-time KPIs
4. **Patient Portal**: Personalized dashboards, treatment history, cost tracking, and countdown timers
5. **Modern UI**: Gradient animations, responsive design, and smooth micro-interactions

### Data Structure
```javascript
// Patient object structure
{
  id: "p1",
  name: "John Doe",
  dob: "1990-05-10",
  contact: "1234567890",
  healthInfo: "No allergies",
  gender: "Male",
  bloodGroup: "A+",
  tags: ["VIP"],
  notes: "",
  profilePic: ""
}

// Incident/Appointment object structure
{
  id: "i1",
  patientId: "p1",
  title: "Dental Cleaning",
  description: "Routine cleaning",
  comments: "",
  appointmentDate: "2025-01-15T10:00:00",
  cost: 60,
  status: "Completed",
  files: [],
  notes: "",
  nextDate: "",
  locked: false
}
```


## 📦 Build & Deploy

### Production Build
```bash
npm run build
```

### Testing
```bash
npm test
```

### Deployment
The app is deployed on Vercel for easy hosting and automatic deployments:
- Connected to GitHub repository for automatic deployments
- Built and deployed automatically on every push to main branch
- Accessible at: https://entnt-dental-dashboard-chi.vercel.app/login

Alternative deployment options:
- Netlify
- GitHub Pages
- AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

