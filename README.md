# ZenShift - Mood Tracking & Mindfulness App

A production-ready React + Tailwind web application for mood logging and micro-breaks, built with Supabase backend.

![ZenShift](https://via.placeholder.com/800x300/4CAF50/FFFFFF?text=ZenShift)

## Features

- **Authentication**: Sign up, login, logout, and password reset with Supabase Auth
- **Mood Tracking**: Log your mood with optional notes and view history
- **Personalized Suggestions**: Get mood-based recommendations for wellbeing
- **User Profiles**: Manage username and profile information
- **Admin Dashboard**: Admin users can view all users and mood analytics
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Data**: Powered by Supabase for instant updates

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Row Level Security)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **UI Components**: shadcn/ui, Lucide React
- **Build Tool**: Vite

## Quick Start

### Prerequisites

- Node.js 18+
- A Supabase project

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd zenshift
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   Run the SQL schema in your Supabase SQL editor:
   ```sql
   -- See supabase/schema.sql for the complete database schema
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Database Schema

The application uses two main tables:

### `profiles`
- User profile information
- Links to Supabase Auth users
- Admin role management

### `moods`
- Mood check-ins with timestamps
- Optional notes
- User-specific with RLS policies

See `supabase/schema.sql` for the complete schema.

## Environment Variables

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Features Overview

### Authentication
- Email/password signup and login
- Password reset functionality
- Protected routes
- Row Level Security (RLS) for data isolation

### Mood Tracking
- Quick mood logging with predefined options
- Optional notes for context
- Mood history with timestamps
- Personalized suggestions based on current mood

### User Management
- Profile editing (username, full name)
- Password updates
- Admin role assignment

### Admin Features
- View all users
- Access to all mood data
- User activity analytics
- Admin-only pages with proper authorization

## Security

- **Row Level Security**: Users can only access their own data
- **Admin Policies**: Special policies for admin users
- **Authentication Required**: All main features require login
- **Environment Variables**: Sensitive data stored securely

## Deployment

The app can be deployed to any static hosting service:

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

3. **Configure environment variables** in your hosting platform

### Recommended Hosting Platforms
- Vercel
- Netlify
- Supabase Hosting

## Original Lovable Info

**Project URL**: https://lovable.dev/projects/ed32b0e2-6ca4-4266-ab5e-64048906bb9c

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check the Supabase documentation
- Review the React and Tailwind CSS docs

---

**ZenShift** - Take control of your mental wellbeing, one mood at a time. 🧘‍♀️✨