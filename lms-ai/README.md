# AI-Powered Learning Management System (LMS)

An LMS built by AI, for productivity. This modern Learning Management System is designed to deliver AI-powered learning experiences focused on workplace productivity and professional development.

## 🚀 Project Overview

This LMS provides a comprehensive learning platform featuring:

- **AI-Powered Learning**: Personalized learning paths adapted to individual pace and learning style
- **Multi-Format Content**: Support for video lessons and interactive SCORM packages
- **Progress Tracking**: Detailed analytics and insights for learning journeys
- **Practical Focus**: Real-world applications and exercises to maximize productivity
- **Modern UI/UX**: Responsive design with smooth animations and professional aesthetics

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15.4.6](https://nextjs.org)** - React framework with App Router
- **[React 19.1.0](https://reactjs.org)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org)** - Type-safe JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first CSS framework
- **[@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)** - Typography styles
- **[@tailwindcss/line-clamp](https://tailwindcss.com/docs/line-clamp)** - Line clamping utilities

### Development & Testing
- **[Vitest](https://vitest.dev)** - Testing framework
- **[@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)** - React testing utilities
- **[ESLint](https://eslint.org)** - Code linting
- **[Lighthouse](https://developers.google.com/web/tools/lighthouse)** - Performance auditing

### Content Support
- **SCORM 1.2/2004** - E-learning content standard
- **HTML5 Video** - Native video playback
- **Responsive Design** - Mobile-first approach

## 📚 Adding New Courses & Lessons

### Course Manifest Structure

Courses are defined in `src/data/courseManifest.ts`. Each course follows this structure:

```typescript
interface Course {
  id: string;              // Unique course identifier
  title: string;           // Display name for the course
  description: string;     // Course description
  lessons: Array<{
    id: string;            // Unique lesson identifier within course
    title: string;         // Lesson display name
    type: string;          // 'video' or 'scorm'
    src: string;           // Path to lesson content in /public
  }>;
}
```

### Adding a New Course

1. **Edit the manifest** (`src/data/courseManifest.ts`):
   ```typescript
   export const courseManifest: Course[] = [
     // ... existing courses
     {
       id: 'new-course-101',
       title: 'Your New Course Title',
       description: 'Course description here',
       lessons: [
         {
           id: 'lesson1',
           title: 'First Lesson',
           type: 'video',
           src: '/new-course/lesson1.mp4'
         },
         {
           id: 'lesson2',
           title: 'Interactive Content',
           type: 'scorm',
           src: '/new-course/lesson2/index.html'
         }
       ]
     }
   ];
   ```

2. **Add course assets** to `public/` directory:
   ```
   public/
   └── new-course/
       ├── lesson1.mp4          # Video file
       └── lesson2/             # SCORM package
           ├── index.html       # SCORM entry point
           ├── imsmanifest.xml  # SCORM manifest
           └── content/         # SCORM assets
   ```

### Content Types

#### Video Lessons (`type: 'video'`)
- Place video files directly in `public/[course-folder]/`
- Supported formats: MP4, WebM, OGV
- Use `src: '/course-folder/video-file.mp4'`

#### SCORM Packages (`type: 'scorm'`)
- Extract SCORM package to `public/[course-folder]/[lesson-folder]/`
- Ensure `index.html` is the entry point
- Use `src: '/course-folder/lesson-folder/index.html'`
- SCORM API is automatically injected via `public/scorm-api.js`

### Example Directory Structure

```
public/
├── pwp/                     # Personal Workplace Productivity course
│   ├── intro.mp4           # Video lesson
│   ├── content/            # SCORM package
│   │   ├── index.html
│   │   └── imsmanifest.xml
│   └── practice/           # Another SCORM package
├── tm/                      # Time Management course
│   ├── planning.mp4
│   └── priorities/
└── com/                     # Communication course
    ├── listening.mp4
    └── presentation/
```

## 🏃‍♂️ Local Development

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Git

### Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd lms-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   
   The app will be available at [http://localhost:3000](http://localhost:3000)

### Development Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run lighthouse` - Run Lighthouse performance audit

### Hot Reloading

The development server supports hot reloading:
- Changes to pages, components, and styles update instantly
- Course manifest changes require a browser refresh
- New assets in `public/` are available immediately

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Deploy automatically** on every push to main branch
3. **Environment variables** (if needed) can be set in Vercel dashboard

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Other Platforms

#### Netlify
```bash
npm run build
# Deploy the .next folder
```

#### Static Export
```bash
# Add to next.config.ts:
# output: 'export'
npm run build
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Build Output
- Static assets are optimized and cached
- SCORM content in `public/` is served directly
- Images and fonts are automatically optimized

## 📝 Additional Notes

### SCORM Compatibility
- Supports SCORM 1.2 and SCORM 2004
- SCORM API is automatically injected
- Progress tracking works with compliant content

### Performance
- Lighthouse auditing is integrated (`npm run lighthouse`)
- Images and fonts are optimized automatically
- Code splitting and lazy loading are built-in

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive Web App ready

---

## 📖 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [React Documentation](https://react.dev) - Learn React fundamentals
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [SCORM Standard](https://scorm.com/scorm-explained/) - E-learning content standard

For questions or contributions, please check the project's GitHub repository.
