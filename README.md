# Luke Duran Personal Site

A clean, modern, minimalist personal website built with Next.js, TypeScript, and Tailwind CSS. The site is fully static (SSG) and all content is driven by a single JSON file.

## Features

- ✅ Fully static site generation (SSG) - no server runtime needed
- ✅ Single source of truth: all content in `src/content/site.json`
- ✅ Light and dark mode with system preference detection
- ✅ Responsive design with mobile-first approach
- ✅ SEO optimized with metadata and OpenGraph tags
- ✅ Accessible with proper semantic HTML and ARIA labels
- ✅ Project detail pages with static generation
- ✅ Toggle-able sections (Projects, Education)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Add your resume PDF to the `public` directory:
   - Place your resume PDF file in `/public`
   - Update `resumePdfPath` in `src/content/site.json` to match your filename (e.g., `/Luke-Duran-Resume.pdf`)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Content Management

### Editing Site Content

All site content is managed through a single JSON file: `src/content/site.json`

#### Site Information
- `site`: Basic site metadata (title, description, URL)
- `person`: Personal information (name, role, location, email, social links)
- `cta`: Call-to-action button configuration (resume download)

#### Sections
- `sections.showProjects`: Set to `true` to show the Projects section, `false` to hide it
- `sections.showEducation`: Set to `true` to show the Education section, `false` to hide it

#### About Section
- `about.paragraph`: Main about paragraph
- `about.bullets`: Array of bullet points (optional)

#### Experience
Add work experience items with:
- `company`: Company name
- `title`: Job title
- `location`: Location (optional)
- `start` / `end`: Date range
- `highlights`: Array of achievement bullets
- `tech`: Array of technologies used (optional)

#### Projects
Add projects with:
- `slug`: URL-friendly identifier (e.g., "project-alpha")
- `title`: Project name
- `tagline`: Short tagline
- `summary`: Brief summary for the card
- `stack`: Array of technologies
- `links`: Object with `demo` and/or `repo` URLs (optional)
- `heroImage`: Path to hero image (optional, currently not implemented)
- `content`: Markdown-like content for the detail page

**Note**: When `showProjects` is `false`, project detail pages will show a "Coming soon" message.

#### Skills
Organize skills by category:
```json
"skills": {
  "Category Name": ["Skill 1", "Skill 2", ...]
}
```

#### Education
Add education entries with:
- `school`: School name
- `degree`: Degree name
- `dates`: Date range
- `notes`: Additional notes (optional)

## Building for Production

### Static Export

The site is configured for static export:

```bash
npm run build
```

This generates a fully static site in the `out` directory that can be deployed to any static hosting service (Vercel, AWS Amplify, Netlify, GitHub Pages, etc.).

### Deployment

#### Vercel
1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect Next.js and deploy

#### AWS Amplify
1. Push your code to GitHub
2. Connect your repository in AWS Amplify
3. Amplify will automatically detect Next.js and deploy

#### Other Static Hosts
1. Run `npm run build`
2. Upload the contents of the `out` directory to your hosting service

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with Nav and Footer
│   │   ├── page.tsx             # Home page with all sections
│   │   ├── globals.css          # Global styles and theme variables
│   │   └── projects/
│   │       └── [slug]/
│   │           ├── page.tsx     # Project detail page
│   │           └── not-found.tsx
│   ├── components/              # Reusable components
│   │   ├── Button.tsx
│   │   ├── Container.tsx
│   │   ├── Nav.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── Section.tsx
│   │   ├── Tag.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── TimelineItem.tsx
│   ├── content/
│   │   └── site.json            # Single source of truth for all content
│   └── lib/
│       ├── content.ts           # Content loading utilities
│       └── types.ts             # TypeScript types
├── public/                      # Static assets (resume PDF, images)
└── package.json
```

## Customization

### Theme Colors

Edit `src/app/globals.css` to customize the color scheme:

```css
:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --border: #e5e5e5;
  --muted: #f5f5f5;
}

.dark {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --border: #262626;
  --muted: #171717;
}
```

### Typography

The site uses Inter font from `next/font`. To change the font, edit `src/app/layout.tsx`:

```tsx
import { YourFont } from 'next/font/google';

const yourFont = YourFont({ subsets: ['latin'] });
```

### Styling

The site uses Tailwind CSS. Customize the design system in `tailwind.config.ts`.

## Adding a New Project

1. Open `src/content/site.json`
2. Add a new object to the `projects` array:

```json
{
  "slug": "my-new-project",
  "title": "My New Project",
  "tagline": "A cool project",
  "summary": "Brief description",
  "stack": ["React", "TypeScript"],
  "links": {
    "demo": "https://demo.com",
    "repo": "https://github.com/user/repo"
  },
  "content": "## Overview\n\nDetailed project description..."
}
```

3. The project will automatically appear on the home page and be accessible at `/projects/my-new-project`

## Enabling/Disabling Projects

To hide the Projects section:

1. Open `src/content/site.json`
2. Set `sections.showProjects` to `false`
3. The Projects section will be hidden from navigation and the home page
4. Project detail pages will show a "Coming soon" message

## License

This project is private and proprietary.
