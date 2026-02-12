# Theme System Documentation

Complete guide to the hot-reloadable theme system with 12 shadcn/ui color variations.

## Features

- 🎨 **12 Pre-configured Themes** - Light, Dark, Zinc, Slate, Stone, Gray, Neutral, Rose, Orange, Green, Blue, Yellow, Violet
- ⚡ **Hot Reloading** - Instant theme switching without page reload
- 🔧 **Fully Customizable** - Easy to add new themes or modify existing ones
- 📱 **Responsive** - Works seamlessly across all devices
- ♿ **Accessible** - Maintains proper contrast ratios and WCAG compliance
- 🚀 **Production Ready** - Optimized for performance with zero flash

## Quick Start

### View the Theme Showcase

Visit `/themes` in your browser to see all components styled with different themes:

```bash
npm run dev
# Navigate to http://localhost:3000/themes
```

### Switch Themes

Click the palette icon (🎨) in the header to open the theme picker and select any theme.

## Available Themes

### Neutral Themes
- **Light** - Clean and minimal default theme
- **Dark** - Easy on the eyes dark mode
- **Zinc** - Neutral and professional
- **Slate** - Cool and modern
- **Stone** - Warm and natural
- **Gray** - Classic and balanced
- **Neutral** - Timeless design

### Accent Themes
- **Rose** - Warm and inviting (pink primary)
- **Orange** - Bold and energetic
- **Green** - Fresh and natural
- **Blue** - Professional and trustworthy
- **Yellow** - Bright and cheerful
- **Violet** - Creative and modern

## Implementation

### How It Works

The theme system uses CSS custom properties (variables) defined in `app/globals.css`:

```css
.blue {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... other variables */
}
```

Themes are applied via a className on the `<html>` element, managed by `next-themes`:

```tsx
<html className="blue">
  <body>
    <div className="bg-background text-foreground">
      <button className="bg-primary text-primary-foreground">
        Themed Button
      </button>
    </div>
  </body>
</html>
```

### Using Themes in Your Components

Always use semantic tokens instead of hard-coded colors:

✅ **Good:**
```tsx
<div className="bg-background text-foreground">
  <Card className="bg-card text-card-foreground">
    <Button className="bg-primary text-primary-foreground">
      Click me
    </Button>
  </Card>
</div>
```

❌ **Bad:**
```tsx
<div className="bg-white text-black">
  <Card className="bg-gray-100">
    <Button className="bg-blue-500 text-white">
      Click me
    </Button>
  </Card>
</div>
```

### Add ThemeSwitcher to Your Page

```tsx
import { ThemeSwitcher } from '@/components/theme-switcher'

export default function MyPage() {
  return (
    <header>
      <nav>
        {/* Your navigation */}
        <ThemeSwitcher />
      </nav>
    </header>
  )
}
```

## Creating Custom Themes

### 1. Add Theme CSS

Add your theme variables to `app/globals.css`:

```css
.custom-theme {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 280 80% 50%; /* Your custom primary color */
  --primary-foreground: 210 40% 98%;
  --secondary: 220 14.3% 95.9%;
  --secondary-foreground: 220.9 39.3% 11%;
  --muted: 220 14.3% 95.9%;
  --muted-foreground: 220 8.9% 46.1%;
  --accent: 220 14.3% 95.9%;
  --accent-foreground: 220.9 39.3% 11%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 220 13% 91%;
  --input: 220 13% 91%;
  --ring: 280 80% 50%; /* Match primary */
}
```

### 2. Add to ThemeSwitcher

Update `components/theme-switcher.tsx`:

```tsx
const themes = [
  // ... existing themes
  { 
    name: 'Custom', 
    value: 'custom-theme', 
    description: 'Your custom theme' 
  },
]
```

### 3. Test Your Theme

1. Save the files (hot reload applies changes instantly)
2. Open the theme switcher
3. Select your custom theme
4. Visit `/themes` to see all components

## Color System

### HSL Format

All colors use HSL (Hue, Saturation, Lightness) format:

```css
--primary: 221.2 83.2% 53.3%;
/* Hue: 221.2° (blue)
   Saturation: 83.2%
   Lightness: 53.3% */
```

### Semantic Tokens

| Token | Usage | Example |
|-------|-------|---------|
| `background` | Page background | Main canvas |
| `foreground` | Main text color | Body text |
| `card` | Card backgrounds | Content cards |
| `card-foreground` | Card text | Card content |
| `popover` | Popover backgrounds | Dropdowns, tooltips |
| `primary` | Primary actions | Main buttons |
| `secondary` | Secondary actions | Alt buttons |
| `muted` | Muted backgrounds | Disabled states |
| `accent` | Accent elements | Highlights |
| `destructive` | Danger/delete | Delete buttons |
| `border` | Borders | Dividers, outlines |
| `input` | Input borders | Form fields |
| `ring` | Focus rings | Focus states |

## Best Practices

### 1. Always Use Semantic Tokens

```tsx
// ✅ Adapts to all themes
<div className="bg-background text-foreground border border-border">

// ❌ Breaks in dark themes
<div className="bg-white text-black border border-gray-200">
```

### 2. Override Text Colors When Changing Backgrounds

```tsx
// ✅ Ensures proper contrast
<div className="bg-primary text-primary-foreground">
  High contrast text
</div>

// ❌ May have poor contrast
<div className="bg-primary">
  Default text color may not be visible
</div>
```

### 3. Test in Multiple Themes

Always test your components in:
- Light and Dark themes (contrast)
- Colorful themes like Rose/Blue (color harmony)
- Neutral themes like Zinc/Slate (subtlety)

### 4. Use Theme-Aware Icons

```tsx
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

function ThemeIcon() {
  const { theme } = useTheme()
  return theme === 'dark' ? <Moon /> : <Sun />
}
```

## Programmatic Theme Control

### Get Current Theme

```tsx
'use client'
import { useTheme } from 'next-themes'

function MyComponent() {
  const { theme, setTheme, themes } = useTheme()
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('dark')}>
        Switch to Dark
      </button>
    </div>
  )
}
```

### Detect Theme Changes

```tsx
'use client'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

function MyComponent() {
  const { theme } = useTheme()
  
  useEffect(() => {
    console.log('Theme changed to:', theme)
    // React to theme changes
  }, [theme])
  
  return <div>Theme: {theme}</div>
}
```

## Advanced Usage

### Persistent Theme Preference

Themes are automatically persisted to localStorage:

```typescript
// Automatically saved
localStorage.getItem('theme') // 'blue'
```

### System Theme Detection

Enable system theme detection:

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system" // Follow OS preference
  enableSystem={true}
>
  {children}
</ThemeProvider>
```

### Custom Theme Transitions

Disable transitions during theme switch:

```tsx
<ThemeProvider
  disableTransitionOnChange={true} // No flash
>
  {children}
</ThemeProvider>
```

## Troubleshooting

### Theme Not Applying

**Problem:** Theme changes but components don't update

**Solution:**
1. Ensure you're using semantic tokens (`bg-background` not `bg-white`)
2. Check `suppressHydrationWarning` is on `<html>` element
3. Verify ThemeProvider wraps your app

### Flash of Wrong Theme

**Problem:** Brief flash of wrong theme on load

**Solution:**
1. Set `disableTransitionOnChange={false}` in ThemeProvider
2. Ensure `next-themes` script runs before hydration
3. Use `suppressHydrationWarning` on html element

### Colors Look Wrong

**Problem:** Custom theme colors don't match design

**Solution:**
1. Use HSL color picker to get exact values
2. Test lightness values (40-60% for primary colors)
3. Ensure all foreground colors have proper contrast

## Resources

- [shadcn/ui Themes](https://ui.shadcn.com/themes)
- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [HSL Color Picker](https://hslpicker.com)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Examples

### Landing Page with Theme Switcher

```tsx
import { ThemeSwitcher } from '@/components/theme-switcher'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="container flex justify-between py-4">
          <Logo />
          <ThemeSwitcher />
        </nav>
      </header>
      <main className="container py-16">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome
        </h1>
      </main>
    </div>
  )
}
```

### Dashboard with Multiple Cards

```tsx
export default function Dashboard() {
  return (
    <div className="bg-background p-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              $12,345
            </p>
          </CardContent>
        </Card>
        {/* More cards */}
      </div>
    </div>
  )
}
```

## Next Steps

1. ✅ Visit `/themes` to see all themes in action
2. ✅ Add ThemeSwitcher to your navigation
3. ✅ Test your existing components in different themes
4. ✅ Create a custom theme for your brand
5. ✅ Share your theme with the team
