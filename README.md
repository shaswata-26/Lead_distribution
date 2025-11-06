MERN Leadt Distribution System
A comprehensive lead management system built with the MERN stack that allows administrators to distribute customer contact lists equally among agents and track task completion.
🌟 Features
👨‍💼 Admin Features
 1. User Management: Register and manage admin/agent accounts

 2. Agent Management: Create, view, edit, and delete agents

 3.  File Upload: Upload CSV/Excel files with customer contacts

 4.  Automatic Distribution: System automatically distributes leads equally among active agents

 5.  Real-time Monitoring: View distribution statistics and agent performance

 6.  Dashboard Analytics: Comprehensive overview of system activities

 👨‍💻 Agent Features
  1. Task Management: View assigned customer contacts

  2. Status Updates: Update task status (pending → in-progress → completed)

  3. Call Tracking: Record call outcomes, duration, and notes

  4. Performance Metrics: Personal dashboard with completion statistics

  5. Mobile-Friendly: Responsive design for all devices

  🛠️ Tech Stack
   Frontend
      React.js - UI framework

     Tailwind CSS - Styling and responsive design

     React Router - Navigation and routing

     Axios - HTTP client for API calls

     Context API - State management

     Backend
     Node.js - Runtime environment

     Express.js - Web framework
 
     MongoDB - Database

     Mongoose - ODM for MongoDB

     JWT - Authentication

     bcryptjs - Password hashing

     Multer - File upload handling

     csv-parser - CSV file processing

     xlsx - Excel file processing


📋 Prerequisites
    Before running this application, make sure you have the following installed:

    Node.js (v14 or higher)

    MongoDB (local or Atlas)

    npm or yarn

🚀 Installation & Setup
1. Clone the Repository
   git clone <repository-url>
   cd mern-list-distribution


2. Backend Setup
  bash
  # Navigate to backend directory
  cd backend

  # Install dependencies
  npm install

  # Create uploads directory
  mkdir uploads
  # Create environment file
  cp .env.example .env
