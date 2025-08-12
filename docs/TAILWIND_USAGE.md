# Tailwind CSS Configuration & Custom Utilities

This project uses Tailwind CSS v4 with custom brand colors, utility classes, and the typography plugin for rich lesson content.

## Brand Colors

The following brand colors are available throughout the application:

- **Primary**: `brand-primary` (#2563eb - Blue-600)
- **Secondary**: `brand-secondary` (#7c3aed - Violet-600)
- **Accent**: `brand-accent` (#059669 - Emerald-600)
- **Success**: `brand-success` (#16a34a - Green-600)
- **Warning**: `brand-warning` (#d97706 - Amber-600)
- **Error**: `brand-error` (#dc2626 - Red-600)
- **Info**: `brand-info` (#0891b2 - Cyan-600)
- **Light**: `brand-light` (#f8fafc - Slate-50)
- **Dark**: `brand-dark` (#0f172a - Slate-900)
- **Muted**: `brand-muted` (#64748b - Slate-500)

### Usage Examples

```jsx
<div className="bg-brand-primary text-white">Primary Button</div>
<div className="text-brand-secondary">Secondary Text</div>
<div className="border-brand-accent">Accent Border</div>
```

## Progress Bar Utilities

### Basic Progress Bar

```jsx
<div className="progress-container">
  <div className="progress-bar" style={{ width: '60%' }}></div>
</div>
```

### Progress Bar Variations

```jsx
{/* Small progress bar */}
<div className="progress-container">
  <div className="progress-bar progress-bar-sm" style={{ width: '40%' }}></div>
</div>

{/* Large progress bar */}
<div className="progress-container">
  <div className="progress-bar progress-bar-lg" style={{ width: '80%' }}></div>
</div>

{/* Success state */}
<div className="progress-container">
  <div className="progress-bar progress-bar-success" style={{ width: '100%' }}></div>
</div>

{/* Animated and striped */}
<div className="progress-container">
  <div className="progress-bar progress-bar-animated progress-bar-striped" style={{ width: '45%' }}></div>
</div>
```

## Card Shadow Utilities

```jsx
{/* Basic card shadow */}
<div className="card-shadow p-6 rounded-lg">
  <h3>Card with hover effect</h3>
</div>

{/* Different shadow intensities */}
<div className="card-shadow-soft">Soft shadow</div>
<div className="card-shadow-medium">Medium shadow</div>
<div className="card-shadow-strong">Strong shadow</div>
<div className="card-shadow-lesson">Lesson card shadow</div>
```

## Interactive Elements

```jsx
<div className="interactive-element card-shadow p-4">
  This element will lift on hover and animate
</div>
```

## Loading States

```jsx
{/* Loading skeleton */}
<div className="loading-skeleton h-4 w-32 mb-2"></div>
<div className="loading-skeleton h-4 w-24 mb-2"></div>
<div className="loading-skeleton h-4 w-28"></div>
```

## Glassmorphism Effects

```jsx
{/* Light glassmorphism */}
<div className="glass p-6 rounded-lg">
  <h3>Glass effect</h3>
</div>

{/* Strong glassmorphism */}
<div className="glass-strong p-6 rounded-lg">
  <h3>Strong glass effect</h3>
</div>
```

## Gradient Text

```jsx
<h1 className="gradient-text text-4xl font-bold">
  Primary to Secondary Gradient
</h1>

<h2 className="gradient-text-accent text-2xl">
  Accent to Info Gradient
</h2>
```

## Typography for Lesson Content

The `prose-lesson` class provides enhanced typography for rich lesson content with the Tailwind Typography plugin:

```jsx
<article className="prose-lesson">
  <h1>Lesson Title</h1>
  <p>This paragraph will have enhanced typography with proper spacing and colors.</p>
  <blockquote>
    This blockquote will be styled with brand colors
  </blockquote>
  <pre><code>console.log('Code blocks are styled too!');</code></pre>
</article>
```

## Custom Scrollbar

```jsx
<div className="custom-scrollbar h-64 overflow-y-auto">
  <div className="h-96">
    Long content that scrolls with custom styled scrollbar
  </div>
</div>
```

## Focus States

```jsx
<button className="focus-visible px-4 py-2">
  Button with accessible focus ring
</button>
```

## Responsive Typography

```jsx
<h1 className="text-responsive-2xl">Responsive Extra Large</h1>
<h2 className="text-responsive-xl">Responsive Large</h2>
<h3 className="text-responsive-lg">Responsive Large</h3>
<p className="text-responsive-base">Responsive Base</p>
<small className="text-responsive-sm">Responsive Small</small>
```

## Animations

Available animations:
- `animate-fade-in`: Fade in animation
- `animate-slide-up`: Slide up animation
- `animate-pulse-soft`: Soft pulse animation
- `animate-progress`: Progress bar fill animation

```jsx
<div className="animate-fade-in">Fades in</div>
<div className="animate-slide-up">Slides up</div>
<div className="animate-pulse-soft">Soft pulsing</div>
```

## Print Utilities

```jsx
<div className="no-print">This won't appear in print</div>
<div className="print-break-before">Page break before this element</div>
<div className="print-break-after">Page break after this element</div>
```

## Dark Mode Support

All custom utilities automatically support dark mode through CSS variables. The theme switches automatically based on user preference or can be controlled programmatically.

## Container Configuration

The container is configured with responsive padding and max-widths:
- Default padding: 1rem
- Small screens (sm): 2rem padding, 640px max-width
- Medium screens (md): 768px max-width
- Large screens (lg): 4rem padding, 1024px max-width
- Extra large screens (xl): 5rem padding, 1280px max-width
- 2XL screens: 6rem padding, 1400px max-width

```jsx
<div className="container mx-auto">
  Content with responsive container
</div>
```
