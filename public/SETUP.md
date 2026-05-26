# Portfolio Setup Guide

Welcome to your brand new Antigravity Portfolio! Follow these final quick steps to insert your personalized assets and connect your custom 3D scenes.

### 1. Frame Sequence Animation (Hero Section)
To power the 3D scroll animation in your hero section:
- Place your 240 JPG frames inside the `/public/frames/` directory.
- Ensure they are exactly named sequentially from `frame_0000.jpg` up to `frame_0239.jpg`.

### 2. Ongoing Projects Brain Image
For the main visual card in the Ongoing Projects section:
- Place your generated brain image inside the `/public/` directory.
- Rename the file (e.g., from `Gemini_Generated_Image_9adkk59adkk59adk.png`) to exactly **`brain.png`**.

### 3. Your Resume
To enable the "Download PDF" resume button in the Contact Section:
- Place your resume PDF file inside the `/public/` directory.
- Name it **`resume.pdf`**.

### 4. Connect Your Custom Spline 3D Scenes
Currently, the portfolio uses temporary placeholder URLs for the 3D robots and interactive elements. 
Search your codebase (in `src/components/RobotIntroSection.tsx` and `src/components/ContactSection.tsx`) for the `<spline-viewer>` URLs, and replace them with your custom Spline `.splinecode` export URLs!

### 5. Update Your Data & Social Links
Open **`src/data/portfolio.ts`** to customize all of your portfolio data:
- Ensure you update the `socialLinks` array with your real GitHub, LinkedIn, and other platform URLs.
- Edit your projects, ongoing works, experience, and skills directly in that file.

### 6. Preview Your Site
Once you've dropped in your assets, start the development server to see everything come to life:
```bash
npm run dev
```

Enjoy your incredible new 3D portfolio!
