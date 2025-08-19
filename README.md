# HairCareLog Frontend

This is the frontend application for HairCareLog, built with React and Tailwind CSS.

## Features

- Modern React application with hooks
- Responsive design with Tailwind CSS
- Form handling with react-hook-form
- Toast notifications with react-hot-toast
- Icon library with lucide-react
- API integration with axios

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`.

## Project Structure

```
frontend/
├── public/          # Static files
├── src/
│   ├── components/  # Reusable React components
│   │   └── layout/  # Layout components
│   ├── pages/       # Page components
│   ├── services/    # API services
│   ├── App.js       # Main App component
│   ├── App.css      # App styles
│   ├── index.js     # React entry point
│   └── index.css    # Global styles
├── package.json     # Dependencies and scripts
├── tailwind.config.js # Tailwind configuration
└── postcss.config.js  # PostCSS configuration
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## API Configuration

The frontend is configured to proxy API requests to `http://localhost:5000` (the backend server). Make sure the backend is running on port 5000.

## Styling

This project uses Tailwind CSS for styling. The configuration is in `tailwind.config.js`. "# loggerfrontend" 
