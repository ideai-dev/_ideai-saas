'use client'

import { ThemeSwitcher } from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Zap,
  Home,
  Settings,
  Users,
  BarChart
} from 'lucide-react'

export default function ThemesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-bold">Theme Showcase</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Badge variant="secondary">12 Themes</Badge>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <section>
            <h1 className="text-4xl font-bold tracking-tight mb-2">shadcn/ui Theme System</h1>
            <p className="text-lg text-muted-foreground">
              Hot-reloadable themes with instant preview. Switch themes using the button in the header.
            </p>
          </section>

          {/* Component Showcase Grid */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Component Showcase</h2>
            
            <Tabs defaultValue="buttons" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="buttons">Buttons</TabsTrigger>
                <TabsTrigger value="inputs">Inputs</TabsTrigger>
                <TabsTrigger value="cards">Cards</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>

              <TabsContent value="buttons" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Button Variants</CardTitle>
                    <CardDescription>All button styles adapt to the current theme</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      <Button>Default</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="link">Link</Button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large</Button>
                      <Button size="icon"><Settings className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inputs" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Form Controls</CardTitle>
                    <CardDescription>Interactive form elements with theme support</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="name@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="••••••••" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="notifications" />
                      <Label htmlFor="notifications">Enable notifications</Label>
                    </div>
                    <div className="space-y-2">
                      <Label>Volume</Label>
                      <Slider defaultValue={[50]} max={100} step={1} />
                    </div>
                    <div className="space-y-2">
                      <Label>Progress</Label>
                      <Progress value={66} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cards" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Revenue</CardTitle>
                      <CardDescription>+20.1% from last month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$45,231.89</div>
                    </CardContent>
                    <CardFooter>
                      <Badge variant="secondary">
                        <BarChart className="h-3 w-3 mr-1" />
                        Analytics
                      </Badge>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Active Users</CardTitle>
                      <CardDescription>+180 new users this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2,350</div>
                    </CardContent>
                    <CardFooter>
                      <Badge variant="secondary">
                        <Users className="h-3 w-3 mr-1" />
                        Users
                      </Badge>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Conversion Rate</CardTitle>
                      <CardDescription>+12% from last quarter</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3.4%</div>
                    </CardContent>
                    <CardFooter>
                      <Badge variant="secondary">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Performance
                      </Badge>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>
                    This is a default alert showing informational content.
                  </AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Something went wrong. Please try again later.
                  </AlertDescription>
                </Alert>

                <Alert className="border-green-500 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Your changes have been saved successfully.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </section>

          {/* Navigation Example */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Navigation Components</h2>
            <Card>
              <CardContent className="pt-6">
                <nav className="flex items-center space-x-4 lg:space-x-6">
                  <Button variant="ghost" className="justify-start">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Team
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <BarChart className="mr-2 h-4 w-4" />
                    Analytics
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </section>

          {/* Color Palette */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Theme Colors</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary" />
                  <CardTitle className="text-sm">Primary</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary" />
                  <CardTitle className="text-sm">Secondary</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-accent" />
                  <CardTitle className="text-sm">Accent</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-muted" />
                  <CardTitle className="text-sm">Muted</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* Footer Info */}
          <section className="pt-8 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Built with shadcn/ui</p>
                <p className="text-sm text-muted-foreground">
                  All components are fully themeable and hot-reloadable
                </p>
              </div>
              <Button variant="outline" asChild>
                <a href="/">Back to Home</a>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
