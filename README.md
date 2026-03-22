# Safe Router 🌸 - Women Safety Navigation App

A React-based women safety navigation application with Firebase authentication and real-time location tracking using Leaflet maps.

## Project Structure

```
src/
├── components/
│   ├── LoginPage.js       # Login/Register UI component
│   ├── LoginPage.css      # Login page styles
│   ├── MapPage.js         # Map and navigation component
│   └── MapPage.css        # Map page styles
├── App.js                 # Main app component
├── App.css                # App styles
├── index.js              # Entry point
├── index.css             # Global styles
└── firebase.js           # Firebase configuration

public/
└── index.html            # HTML template

package.json              # Dependencies and scripts
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd /home/rastogi/Desktop/GUnja
npm install
```

### 2. Configure Firebase

Edit `src/firebase.js` and replace the configuration with your Firebase project credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## Features

- **User Authentication**: Email/Password and Google sign-in via Firebase
- **Real-time Location Tracking**: Watch user location with Leaflet maps
- **SOS Feature**: Quick WhatsApp integration for emergency alerts
- **Beautiful UI**: Glass-morphism design with smooth animations
- **Responsive Design**: Works on desktop and mobile devices

## Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Email/Password authentication
3. Enable Google Sign-In provider
4. Copy your project config to `src/firebase.js`

## Technologies Used

- **React 18.2**: Frontend framework
- **Firebase 10.12**: Authentication and backend
- **Leaflet 1.9.4**: Map library
- **CSS3**: Advanced styling with animations and glass-morphism

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Notes

- Geolocation requires HTTPS in production
- User must grant location permissions
- All original configurations are maintained from the vanilla JS version
