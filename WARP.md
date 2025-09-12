# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.2 hair salon website built with TypeScript, Tailwind CSS v4, and shadcn/ui components. The project is set up for a Kenya hair salon business with modern styling and responsive design.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack (fast refresh)
- `npm run build` - Build production application with Turbopack optimization
- `npm run start` - Start production server (requires build first)
- `npm run lint` - Run ESLint for code quality checks

### Development Server
The development server runs on http://localhost:3000 with Turbopack enabled for faster builds and hot reloading.

## Architecture & Tech Stack

### Framework & Runtime
- **Next.js 15.5.2** with App Router architecture
- **React 19.1.0** with TypeScript for type safety
- **Turbopack** enabled for both development and build processes

### Styling System
- **Tailwind CSS v4** with PostCSS integration
- **tw-animate-css** for enhanced animations
- **CSS Variables** based theme system with dark mode support
- **shadcn/ui** component system configured with "new-york" style
- Custom design tokens using OKLCH color space

### Component Architecture
- **shadcn/ui** components configured with:
  - Components alias: `@/components`
  - Utils alias: `@/lib/utils` 
  - UI components: `@/components/ui`
  - Lucide React icons
  - CSS variables for theming
- **Class Variance Authority (CVA)** for component variants
- **clsx** and **tailwind-merge** utility for conditional styling

### Project Structure
```
app/
├── layout.tsx       # Root layout with font setup and metadata
├── page.tsx         # Home page component
├── globals.css      # Global styles, Tailwind imports, theme variables
└── favicon.ico      # Site favicon

lib/
└── utils.ts         # Utility functions (cn helper for className merging)

components/          # shadcn/ui components will be installed here
└── ui/              # Specific UI component directory

public/              # Static assets (SVG icons, images)
```

### Configuration Files
- `components.json` - shadcn/ui configuration with path aliases
- `tsconfig.json` - TypeScript config with strict mode and path mapping
- `eslint.config.mjs` - ESLint with Next.js and TypeScript rules
- `postcss.config.mjs` - PostCSS with Tailwind CSS v4 plugin
- `next.config.ts` - Next.js configuration (currently minimal)

## Theming & Design System

### Color System
The project uses OKLCH color space for consistent and perceptually uniform colors:
- Light/dark mode variants defined in CSS variables
- Theme switching capability built into the CSS architecture
- Neutral base color with customizable accent colors

### Typography
- **Geist Sans** as primary font family
- **Geist Mono** for code and monospace elements
- Automatic font optimization via next/font

## Hair Salon Specific Features

Based on the user rules, this website is specifically for a Kenya hair salon with these design requirements:
- Light and dark mode functionality
- White navigation bar (instead of black)
- Specific image positioning showing full hair, body, and elbow
- White space to the left of images instead of light pink
- Professional hair salon presentation

## Development Best Practices

### Adding shadcn/ui Components
Use the shadcn/ui CLI to add components:
```bash
npx shadcn@latest add [component-name]
```

### Styling Conventions
- Use the `cn()` utility from `@/lib/utils` for conditional classes
- Leverage CSS variables for theme-consistent styling
- Follow Tailwind CSS v4 conventions with the new @theme directive

### Type Safety
- All components should use proper TypeScript typing
- Leverage Next.js built-in TypeScript integration
- Use proper imports with path aliases configured in tsconfig.json

## Browser Testing Requirements

When making changes to this hair salon website, ensure:
1. Test responsive design across mobile and desktop
2. Verify dark/light mode switching works correctly
3. Check image positioning matches salon design requirements
4. Validate navigation styling (white background requirement)
5. Test performance with Next.js built-in optimizations

## 🚨 MANDATORY TESTING PROTOCOL

**CRITICAL RULE**: After EVERY code change, modification, or iteration, you MUST:

### 1. Browser Session Management
- Keep browser session persistent throughout the entire development process
- NEVER close the browser between tests
- Use the same browser instance for continuous validation

### 2. Required Testing After Every Change
**Immediately after each code modification, execute in this order:**

1. **Take Screenshot**: `browser_take_screenshot` - Visual confirmation of current state
2. **Capture Snapshot**: `browser_snapshot` - Get accessibility tree and element structure
3. **Evaluate Layout**: `browser_evaluate` with custom JavaScript to measure elements and validate positioning
4. **Check Console**: `browser_console_messages` - Verify no errors or warnings
5. **Network Validation**: `browser_network_requests` - Ensure all resources load correctly

### 3. Validation Checklist (Must Pass Before Declaring Complete)
- [ ] Screenshot shows expected visual result
- [ ] Elements are positioned correctly according to design requirements
- [ ] No console errors or warnings
- [ ] All network requests successful (no 404s, no failed loads)
- [ ] Navigation bar is white (not black)
- [ ] Images show full hair, body, and elbow as specified
- [ ] White space appears left of images (not light pink)
- [ ] Light/dark mode toggle works if applicable
- [ ] Responsive design works on different viewport sizes
- [ ] Typography and spacing match design requirements
- [ ] All interactive elements are functional
- [ ] Page loads without layout shift
- [ ] Colors match design specifications
- [ ] Animations/transitions work smoothly
- [ ] Text content is readable and properly styled

### 4. Error Handling Protocol
**If ANY test fails:**
- STOP immediately
- Document the specific issue found
- Fix the issue before proceeding
- Re-run ALL tests after the fix
- Do NOT report task completion until ALL tests pass

### 5. Tools Usage Priority
1. **Primary**: Use Playwright MCP tools for most comprehensive testing
   - `browser_take_screenshot` - Visual confirmation of current state
   - `browser_snapshot` - Accessibility tree and element structure
   - `browser_evaluate` - Custom JavaScript to measure elements and validate positioning
   - `browser_console_messages` - Verify no errors or warnings
   - `browser_network_requests` - Ensure all resources load correctly
   - `browser_click`, `browser_hover`, `browser_type` - Interactive testing
   - `browser_resize` - Responsive testing
   - `browser_wait`, `browser_wait_for` - Timing and loading validation

2. **Secondary**: Browser MCP tools for additional validation
   - Cross-reference findings with Playwright results
   - Use for alternative perspective on same elements

3. **Tertiary**: Puppeteer tools (if available)
   - Fallback option for browser automation
   - Use when Playwright MCP unavailable

4. **Always**: Combine all available tools for complete validation
   - Use multiple tool sets to cross-validate findings
   - Ensure consistent results across all browser automation tools

**NEVER skip testing. NEVER assume changes work without validation.**
