# 🚺 Safe Router - Women's Safety Navigation App

A React-based web application designed to help women navigate safely by providing real-time route analysis, safety scoring, emergency features, and comprehensive safety resources.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [User Flow](#user-flow)
- [Safety Algorithm](#safety-algorithm)
- [API Integration](#api-integration)
- [Components](#components)
- [Configuration](#configuration)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Authentication & Onboarding
- **Email-based Registration** - Secure signup with Firebase
- **Email Verification** - OTP-based email verification for account security
- **Profile Onboarding** - 3-step wizard to collect:
  - Age information
  - Emergency contact numbers
  - Safety preferences

### Core Safety Features
- **Real-time Route Safety Analysis** - Intelligent scoring based on:
  - Distance and duration
  - Time of day
  - Destination safety zones
  - Route characteristics
  
- **GPS Tracking** - Live location updates with bearing calculation
- **Interactive Map** - OpenStreetMap with route visualization
- **SOS Button** - Quick emergency contact with WhatsApp integration
- **Route History** - Automatic logging of completed routes with safety scores

### Safety Resources
- **Emergency Numbers** - Quick access to India emergency services
- **Safety Tips** - Contextual safety advice for different scenarios
- **Self-Defense Guide** - Techniques and resources
- **Helpline Resources** - NGO and counseling services database

### Navigation & Settings
- **Start/Stop Navigation** - Control when navigation begins
- **Safety Dashboard** - Real-time safety level indicator
- **User Profile** - Manage emergency contacts
- **Settings** - Customizable preferences (Auto-SOS, Voice, Dark Mode)

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **Leaflet.js** - Interactive mapping library
- **CSS3** - Glass-morphism design with animations

### Backend & Services
- **Firebase Authentication** - Email/password auth with REST API
- **Firebase Firestore** - Real-time database for user profiles and history
- **Nominatim API** - OpenStreetMap geocoding service
- **OSRM** - Open Route Service Machine for route generation
- **Browser Geolocation API** - GPS positioning

### Storage
- **localStorage** - Session tokens and route history
- **Firebase** - User profiles and settings

## 📦 Installation

### Prerequisites
- Node.js 14+
- npm or yarn
- Modern web browser with GPS support

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/mehrotragunja/SafeRouter.git
   cd SafeRouter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Update Firebase credentials in `src/firebase/auth.js` and `src/firebase/firestore.js`
   - Set your Firebase REST API endpoint

4. **Start development server**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── map/                 # Map-related components
│   │   ├── MapView.jsx      # Leaflet map initialization
│   │   ├── SearchBar.jsx    # Destination search
│   │   ├── NavBar.jsx       # Navigation info display
│   │   └── SOSButton.jsx    # Emergency button
│   ├── sidebar/             # Sidebar sub-pages
│   │   ├── Sidebar.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── HistoryPage.jsx
│   │   ├── EmergencyPage.jsx
│   │   ├── TipsPage.jsx
│   │   ├── DefensePage.jsx
│   │   ├── ResourcesPage.jsx
│   │   └── SettingsPage.jsx
│   ├── LoginPage.js         # Login page
│   ├── Loading.jsx          # Loading state
│   └── Toast.jsx            # Notification component
├── pages/
│   ├── RegisterPage.jsx     # Registration page
│   ├── VerifyPage.jsx       # Email verification
│   ├── OnboardPage.jsx      # Profile setup wizard
│   └── MapPage.jsx          # Main map page
├── context/
│   └── AppContext.jsx       # Global state management
├── firebase/
│   ├── auth.js              # Firebase auth API
│   └── firestore.js         # Firebase database API
├── hooks/
│   ├── useGPS.js            # GPS tracking hook
│   └── useSession.js        # Session management hook
├── utils/
│   ├── routing.js           # Nominatim & OSRM APIs
│   ├── helpers.js           # Utility functions
│   └── history.js           # Route history management
├── styles/
│   ├── App.css
│   ├── MapPage.css
│   ├── AuthPages.css
│   ├── Sidebar.css
│   └── SubPages.css
└── App.js                   # Main app component
```

## 🔄 User Flow

```
Login
  ↓
Register (if new user)
  ↓
Email Verification
  ↓
Onboarding (Age + Emergency Contacts)
  ↓
Map Page (Main Interface)
  ├─ Search for Destination
  ├─ View Route
  ├─ Start Navigation
  └─ Access Sidebar Menu
      ├─ View Profile
      ├─ Check Route History
      ├─ Emergency Numbers
      ├─ Safety Tips
      ├─ Self-Defense Guide
      ├─ Resources
      └─ Settings
```

## 🎯 Safety Algorithm

The app calculates route safety using a comprehensive scoring system:

### Scoring Factors (0-100 points)

| Factor | Weight | Safe | Moderate | Risky |
|--------|--------|------|----------|-------|
| **Distance** | 15 | <1km | 1-5km | >10km |
| **Time of Day** | 10 | 6AM-6PM | 6PM-9PM | 12AM-6AM |
| **Duration** | 5 | <10min | 10-30min | >60min |
| **Safe Zones** | 5 | Major cities | Towns | Remote |

### Safety Levels
- 🟢 **Safe** (80-100): Low risk, recommended route
- 🟡 **Moderate** (65-79): Proceed with caution
- 🔴 **Risky** (<65): High risk, avoid if possible

## 🔌 API Integration

### Nominatim (Geocoding)
- **Purpose**: Convert address text to coordinates
- **Endpoint**: `https://nominatim.openstreetmap.org/search`
- **Features**: 
  - Autocomplete location search
  - Reverse geocoding (coordinates → address)
  - India-specific location bias

### OSRM (Routing)
- **Purpose**: Generate optimized routes between locations
- **Endpoint**: `https://router.project-osrm.org/route/v1/driving`
- **Features**:
  - Distance calculation
  - Duration estimation
  - Turn-by-turn instructions
  - Multiple route options

### Firebase REST API
- **Authentication**: Email/password signup and login
- **Database**: User profiles, route history, settings
- **Endpoints**: 
  - `POST /accounts:signUp` - Register
  - `POST /accounts:signInWithPassword` - Login
  - `GET /databases/` - Read user data
  - `PATCH /databases/` - Update user data

### Browser Geolocation API
- **Purpose**: Get user's GPS location
- **Features**:
  - High accuracy positioning
  - Continuous location watching
  - Bearing calculation (direction)

## 🧩 Key Components

### MapView.jsx
- Initializes Leaflet map
- Displays current location marker with bearing rotation
- Shows route polyline with safety-based coloring
- Pans to user location automatically

### SearchBar.jsx
- Destination input field
- Geocoding with India location bias
- Route generation with OSRM
- Safety score calculation

### NavBar.jsx
- Displays route info (distance, ETA, safety)
- Start/Stop navigation controls
- Clear route button

### SOSButton.jsx
- Emergency contact button with pulsing animation
- WhatsApp integration with location sharing
- Quick call functionality

### Sidebar.jsx
- Overlay navigation menu
- Sub-page routing
- Blur effect on map when open

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_DATABASE_URL=your_database_url
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

### Firebase Rules
Configure Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

## 🚀 Usage

### For End Users

1. **Sign Up**
   - Enter email and password
   - Verify email with OTP
   - Complete profile setup

2. **Search Routes**
   - Allow GPS access to device
   - Enter destination name
   - Click "→" to find route
   - Review safety score and route details

3. **Navigate**
   - Click "▶ Start Navigation"
   - Follow highlighted route on map
   - Use SOS for emergencies

4. **Access Resources**
   - Open sidebar menu (👤)
   - Browse tips, emergency numbers, resources
   - Manage profile and settings

### For Developers

- **Hot Reload**: `npm start` with auto-refresh
- **Debug**: Open DevTools → Console to see route/GPS logs
- **Testing**: Manually test with different destinations and times
- **Deployment**: Build with `npm run build`, deploy to Vercel/Netlify

## 🔮 Future Enhancements

- [ ] **Crowdsourced Safety Data** - Community-reported unsafe areas
- [ ] **AI-Powered Recommendations** - ML model for route prediction
- [ ] **Offline Maps** - Download maps for offline usage
- [ ] **Real-time Traffic** - Integration with traffic APIs
- [ ] **Friend Tracking** - Share live location with trusted contacts
- [ ] **Incident Reporting** - Report unsafe incidents to authorities
- [ ] **Multiple Language Support** - Hindi, Tamil, Telugu, etc.
- [ ] **Native Mobile App** - React Native for iOS/Android
- [ ] **Advanced Analytics** - Dashboard for women's safety insights
- [ ] **Integration with Police** - Direct reporting to local authorities

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Use functional components with hooks
- Follow ESLint configuration
- Write meaningful commit messages
- Test before submitting PR

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support & Contact

- **Issues**: Report bugs via GitHub Issues
- **Suggestions**: Open a discussion or feature request
- **Email**: Contact the maintainer for urgent issues

## 🌟 Acknowledgments

- OpenStreetMap & Nominatim for geocoding
- OSRM for routing services
- Firebase for backend services
- Leaflet.js for mapping
- Community for feedback and suggestions

---

**Safe Router** - Making women's travel safer, one route at a time. 🚀

*Last Updated: March 2026*
