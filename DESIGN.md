# Design System - Verlanglijstje v3

## Overview

A modern, clean, and user-friendly wishlist management platform with a focus on simplicity and ease of use.

---

## Design Principles

1. **Clean & Minimal** - Remove clutter, focus on content
2. **Mobile-First** - Design for mobile, enhance for desktop
3. **Accessible** - Everyone should be able to use the app
4. **Fast** - Instant feedback, minimal loading states
5. **Friendly** - Warm, welcoming, helpful tone

---

## Color Palette

### Primary Colors

```css
--color-primary: #4A90E2;        /* Main blue - buttons, links, accents */
--color-primary-dark: #357ABD;   /* Darker blue - hover states */
--color-primary-light: #6BA4E8;  /* Lighter blue - backgrounds */
--color-primary-pale: #E8F2FC;   /* Very light blue - subtle backgrounds */
```

### Secondary Colors

```css
--color-success: #50C878;        /* Green - success messages, available items */
--color-warning: #F39C12;        /* Orange - warnings, reserved items */
--color-danger: #E74C3C;         /* Red - errors, delete actions */
--color-info: #3498DB;           /* Info blue - informational messages */
```

### Neutral Colors

```css
--color-text-primary: #2C3E50;   /* Main text color */
--color-text-secondary: #7F8C8D; /* Secondary text, labels */
--color-text-light: #95A5A6;     /* Placeholder text, disabled */
--color-text-white: #FFFFFF;     /* Text on dark backgrounds */

--color-bg-primary: #FFFFFF;     /* Main background */
--color-bg-secondary: #F5F7FA;   /* Sidebar, cards background */
--color-bg-tertiary: #ECF0F1;    /* Dividers, borders */

--color-border: #D5DBDE;         /* Default borders */
--color-border-light: #E8ECED;   /* Light borders */
```

### Status Colors

```css
--color-status-available: #50C878;   /* Item available */
--color-status-reserved: #F39C12;    /* Item reserved */
--color-status-donated: #95A5A6;     /* Item donated */
```

---

## Typography

### Font Families

```css
--font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                "Helvetica Neue", Arial, sans-serif;
--font-secondary: Georgia, "Times New Roman", serif; /* For special headings */
--font-mono: "SF Mono", Monaco, "Cascadia Code", monospace; /* For code/IDs */
```

### Font Sizes

```css
--text-xs: 0.75rem;    /* 12px - small labels */
--text-sm: 0.875rem;   /* 14px - secondary text */
--text-base: 1rem;     /* 16px - body text */
--text-lg: 1.125rem;   /* 18px - emphasized text */
--text-xl: 1.25rem;    /* 20px - small headings */
--text-2xl: 1.5rem;    /* 24px - section headings */
--text-3xl: 1.875rem;  /* 30px - page headings */
--text-4xl: 2.25rem;   /* 36px - hero headings */
```

### Font Weights

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights

```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

---

## Spacing System

Based on 8px grid:

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
```

---

## Border Radius

```css
--radius-sm: 0.25rem;   /* 4px - small elements */
--radius-md: 0.375rem;  /* 6px - buttons, inputs */
--radius-lg: 0.5rem;    /* 8px - cards */
--radius-xl: 0.75rem;   /* 12px - modals */
--radius-full: 9999px;  /* Fully rounded - badges, avatars */
```

---

## Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

---

## Component Styles

### Buttons

**Primary Button:**
```css
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-white);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  transition: all 0.2s;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
```

**Secondary Button:**
```css
.btn-secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
}
```

**Danger Button:**
```css
.btn-danger {
  background-color: var(--color-danger);
  color: var(--color-text-white);
}
```

**Button Sizes:**
- Small: `padding: var(--space-2) var(--space-4); font-size: var(--text-sm);`
- Medium: Default
- Large: `padding: var(--space-4) var(--space-8); font-size: var(--text-lg);`

### Cards

```css
.card {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
  transition: all 0.2s;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Forms

**Input Fields:**
```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-pale);
}

.input.error {
  border-color: var(--color-danger);
}
```

**Labels:**
```css
.label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}
```

**Form Groups:**
```css
.form-group {
  margin-bottom: var(--space-5);
}
```

### Modals

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-6);
}
```

### Toasts/Notifications

```css
.toast {
  position: fixed;
  top: var(--space-6);
  right: var(--space-6);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 2000;
  animation: slideInRight 0.3s;
}

.toast-success {
  background-color: var(--color-success);
  color: white;
}

.toast-error {
  background-color: var(--color-danger);
  color: white;
}

.toast-info {
  background-color: var(--color-info);
  color: white;
}
```

### Badges

```css
.badge {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.badge-primary {
  background-color: var(--color-primary-pale);
  color: var(--color-primary-dark);
}

.badge-success {
  background-color: #d4f4e2;
  color: #2d7a4f;
}

.badge-warning {
  background-color: #fef3e2;
  color: #b8730f;
}
```

### Item Cards

```css
.item-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  margin-bottom: var(--space-4);
  transition: all 0.2s;
}

.item-card:hover {
  border-color: var(--color-primary-light);
  box-shadow: var(--shadow-md);
}

.item-card.donated {
  opacity: 0.7;
  background-color: var(--color-bg-secondary);
}

.item-name {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.item-description {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  margin-bottom: var(--space-3);
}

.item-meta {
  display: flex;
  gap: var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}
```

### Priority Indicator

```css
.priority-bar {
  width: 60px;
  height: 6px;
  background-color: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.priority-bar-fill {
  height: 100%;
  background: linear-gradient(
    to right,
    var(--color-success) 0%,
    var(--color-warning) 50%,
    var(--color-danger) 100%
  );
  transition: width 0.3s;
}
```

---

## Layout

### Container

```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}
```

### Grid System

```css
.grid {
  display: grid;
  gap: var(--space-6);
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

/* Responsive */
@media (max-width: 768px) {
  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr;
  }
}
```

### Main Layout

```css
.app-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
}

.sidebar {
  background-color: var(--color-bg-secondary);
  padding: var(--space-6);
  border-right: 1px solid var(--color-border);
}

.main-content {
  padding: var(--space-8);
}

/* Mobile */
@media (max-width: 768px) {
  .app-layout {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: fixed;
    left: -280px;
    top: 0;
    bottom: 0;
    width: 280px;
    z-index: 100;
    transition: left 0.3s;
  }
  
  .sidebar.open {
    left: 0;
  }
}
```

---

## Icons

Use simple SVG icons or a lightweight icon library like:
- Feather Icons
- Heroicons
- Lucide Icons

Common icons needed:
- Plus (add)
- Edit (pencil)
- Delete (trash)
- Share (share-2)
- Search (search)
- User (user)
- List (list)
- Check (check)
- X (close)
- Menu (hamburger)
- Star (priority)
- Link (external link)
- Mail (email)
- Eye (view)
- Lock (private)
- Globe (public)

---

## Animations

### Transitions

```css
.transition-all {
  transition: all 0.2s ease-in-out;
}

.transition-colors {
  transition: color 0.2s, background-color 0.2s, border-color 0.2s;
}
```

### Keyframes

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideInDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

---

## Responsive Breakpoints

```css
/* Mobile First Approach */

/* Small devices (phones, less than 768px) */
/* This is the default, no media query needed */

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  /* Tablet styles */
}

/* Large devices (desktops, 1024px and up) */
@media (min-width: 1024px) {
  /* Desktop styles */
}

/* Extra large devices (large desktops, 1280px and up) */
@media (min-width: 1280px) {
  /* Large desktop styles */
}
```

---

## Loading States

### Skeleton Loader

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-bg-tertiary) 25%,
    var(--color-bg-secondary) 50%,
    var(--color-bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-text {
  height: 1rem;
  margin-bottom: var(--space-2);
}

.skeleton-heading {
  height: 2rem;
  width: 60%;
}
```

### Spinner

```css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-bg-tertiary);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

---

## Empty States

```css
.empty-state {
  text-align: center;
  padding: var(--space-16) var(--space-8);
}

.empty-state-icon {
  font-size: 4rem;
  color: var(--color-text-light);
  margin-bottom: var(--space-4);
}

.empty-state-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.empty-state-description {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
}
```

---

## Accessibility

### Focus States

```css
*:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

*:focus:not(:focus-visible) {
  outline: none;
}
```

### Screen Reader Only

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Dark Mode (Future Enhancement)

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-text-primary: #E8ECED;
    --color-text-secondary: #95A5A6;
    --color-bg-primary: #1A1D23;
    --color-bg-secondary: #2C3E50;
    --color-bg-tertiary: #34495E;
    --color-border: #445566;
  }
}
```

---

## Design Assets

### Logo
- Primary logo: Full color on white background
- Reverse logo: White on dark background
- Icon only: For favicon and app icon
- Sizes: 16x16, 32x32, 64x64, 128x128, 256x256

### Illustrations (Optional)
- Empty states
- Error pages (404, 500)
- Onboarding/welcome

---

## UI Patterns

### Loading Button

```css
.btn-loading {
  position: relative;
  color: transparent;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
```

### Confirmation Dialog

```css
.dialog-confirm {
  text-align: center;
}

.dialog-confirm-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-4);
  color: var(--color-warning);
}

.dialog-confirm-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  margin-top: var(--space-6);
}
```

---

## Print Styles (Future)

```css
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    color: #000;
    background: #fff;
  }
  
  a {
    text-decoration: underline;
  }
  
  .item-card {
    page-break-inside: avoid;
  }
}
```

---

## Summary

This design system provides:
- Consistent visual language
- Reusable components
- Responsive layouts
- Accessible patterns
- Performance considerations
- Future-proof architecture

Use these guidelines to maintain consistency throughout the application!
