# RideSync Web Portal

## Overview
The RideSync Web Portal is a powerful application designed to seamlessly facilitate ride-sharing experiences, connecting users for efficient travel solutions.

## What The App Can Do
- **Real-Time Ride Matching**: Instantly connects riders with drivers based on location and preferences
- **Live Location Tracking**: Track your ride in real-time for enhanced safety and coordination
- **Secure Payment Processing**: Safe and encrypted transaction handling for all rides
- **User Ratings & Reviews**: Build community trust through transparent feedback system
- **Multi-Platform Support**: Access the service from web or mobile devices
- **Regional Broadcast Messaging**: Admins can communicate important updates to operators
- **Admin Dashboard**: Comprehensive control panel for managing users, operators, and alerts
- **Weather Integration**: Real-time weather data for optimal ride planning
- **Operator Status Management**: Track operator availability and service regions

## Quick Start
1. Sign up and create your profile
2. Request a ride by entering pick-up and drop-off locations
3. Connect with available drivers or riders
4. Complete your ride and rate your experience

## Technology Stack
- **Frontend**: React with Vite
- **Backend**: Firebase (Firestore, Authentication, Cloud Functions)
- **Real-Time Updates**: Firestore listeners and FCM push notifications

## Environment Setup
Copy `.env.example` to `.env` and configure:
- Firebase credentials (API Key, Auth Domain, Project ID, Storage Bucket, Messaging Sender ID, App ID)
- OpenWeather API Key (optional)

## Running the Application
```bash
npm install
npm run dev
```

## Support
For assistance, please contact our support team or visit our help center.