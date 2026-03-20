# LAW Model Academy

A high-fashion, cinematic, artistic website prototype for Larry Walker Model Academy built with Next.js.

## Overview

This is a luxury, editorial-style website that showcases the LAW Model Academy brand with a premium black-and-white aesthetic inspired by top fashion houses like Saint Laurent, Prada, and Calvin Klein.

## Features

- **Hero Section**: Full-screen video background with cinematic typography and spotlight effects
- **About Section**: Magazine-style grid layout with high-fashion imagery
- **Courses/Programs**: Minimal card design with hover animations
- **Gallery/Portfolio**: Masonry grid with parallax effects and staggered reveals
- **CTA/Enrol Section**: Elegant typography with clean spacing
- **Footer**: Minimalist editorial design

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (Animations)
- **React Intersection Observer** (Scroll animations)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables (Supabase + Cloudinary registration)

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_FOLDER=law-masterclass
```

Required resources:
- Cloudinary account (for storing headshot, full-body photo, and optional walk video)
- Supabase table: `masterclass_registrations` with columns:
  - `id` (text or uuid, primary key)
  - `location` (text)
  - `full_name` (text)
  - `age` (int)
  - `date_of_birth` (text/date)
  - `gender` (text)
  - `phone` (text)
  - `email` (text)
  - `city_state` (text)
  - `height_value` (text)
  - `height_unit` (text)
  - `weight_value` (text)
  - `weight_unit` (text)
  - `bust_chest_value` (text)
  - `bust_chest_unit` (text)
  - `waist_value` (text)
  - `waist_unit` (text)
  - `hips_value` (text)
  - `hips_unit` (text)
  - `hips_converted` (text, nullable)
  - `shoe_size` (text)
  - `has_modeling_experience` (text)
  - `experience_types` (text, nullable)
  - `prior_training` (text, nullable)
  - `full_session_availability` (text)
  - `motivation` (text)
  - `goals` (text)
  - `expected_gain` (text)
  - `instagram_handle` (text, nullable)
  - `tiktok_or_other` (text, nullable)
  - `consent_photo_video` (text)
  - `referral_source` (text)
  - `headshot_url` (text)
  - `full_body_url` (text)
  - `walk_video_url` (text, nullable)
  - `created_at` (timestamp)

### Admin Dashboard (is_admin)

To enable the `/admin` area:
- Create `public.user_profiles` using `supabase/admin_user_profiles.sql`
- In that table, set `is_admin = true` for the Supabase user(s) who should access the dashboard
- Ensure `.env.local` includes:
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (needed for admin login)

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── Navigation.tsx      # Fixed navigation bar
│   ├── Hero.tsx            # Hero section with video
│   ├── About.tsx           # About section
│   ├── Courses.tsx         # Courses/Programs section
│   ├── Gallery.tsx         # Gallery with parallax
│   ├── CTA.tsx             # Call-to-action section
│   └── Footer.tsx          # Footer component
├── public/                 # Static assets
└── package.json
```

## Design System

### Colors
- **Luxury Black**: `#000000`
- **Luxury White**: `#FFFFFF`
- **Luxury Gray**: `#1A1A1A`
- **Luxury Light Gray**: `#F5F5F5`

### Typography
- **Editorial**: Playfair Display (headings)
- **Sans**: Inter (body text)

### Animations
- Parallax scroll effects
- Fade-in/reveal animations
- Hover effects (image zoom, blur-to-clear)
- Typographic animations (staggered reveals)
- Smooth transitions

## Customization

### Replace Video Background

Update the video source in `components/Hero.tsx`:

```tsx
<source
  src="YOUR_VIDEO_URL"
  type="video/mp4"
/>
```

### Update Images

Replace placeholder images in:
- `components/About.tsx` (grid items)
- `components/Courses.tsx` (course cards)
- `components/Gallery.tsx` (gallery images)

### Modify Content

Edit text content directly in each component file.

## Build for Production

```bash
npm run build
npm start
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- This is a prototype focusing on visual impact and brand identity
- Functionality is minimal by design
- Images are currently using placeholder URLs (Unsplash)
- Video background uses a placeholder from Pexels
- Replace with your own media assets for production

## License

This project is proprietary and confidential.

# law_50k
