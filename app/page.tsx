import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, UtensilsCrossed, Scale, TrendingUp, Sparkles, MessageCircle } from "lucide-react";

/**
 * Home page - Startup-style landing page
 * Displays hero section and key features of the fitness app
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6" />
            <span className="text-xl font-bold">Body AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm font-medium mb-6">
            <MessageCircle className="h-4 w-4 text-primary" />
            Available on WhatsApp
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Your AI Fitness Coach
            <br />
            <span className="text-primary">Right in Your WhatsApp</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Chat with your AI fitness coach directly on WhatsApp. Get personalized workout routines, nutrition advice, and track your progress—all through the messaging app you already use every day.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* WhatsApp Integration Section */}
      <section className="border-t bg-primary/5 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium mb-4">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  Main Feature
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                  Chat with Your AI Coach on WhatsApp
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  No app downloads needed. Simply start a conversation with your AI fitness coach on WhatsApp. Get instant responses, personalized workout plans, nutrition tips, and progress tracking—all in the comfort of your favorite messaging app.
                </p>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>AI-powered conversations that understand your goals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Receive daily workout routines and meal plans</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Track your progress with simple text commands</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Get instant answers to your fitness questions</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="rounded-2xl border-4 border-primary/20 bg-muted p-8 shadow-2xl">
                    <MessageCircle className="h-32 w-32 text-primary mx-auto" />
                    <p className="mt-4 text-center font-semibold">WhatsApp Integration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                AI-Powered Features
              </h2>
            </div>
            <p className="mt-4 text-lg text-muted-foreground">
              Access all these powerful features directly through WhatsApp. Leverage artificial intelligence to get personalized recommendations and insights designed to help you build healthy habits and track your progress.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Dumbbell className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>AI Workout Routines</CardTitle>
                <CardDescription>
                  Get AI-generated personalized workout routines tailored to your fitness goals, experience level, and preferences.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <UtensilsCrossed className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>AI Recipe Suggestions</CardTitle>
                <CardDescription>
                  Discover AI-recommended healthy recipes based on your dietary preferences, goals, and nutritional needs.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Scale className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Smart Weight Tracking</CardTitle>
                <CardDescription>
                  AI-powered insights analyze your weight progress patterns and provide personalized recommendations for optimal results.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>AI Nutrition Analysis</CardTitle>
                <CardDescription>
                  Get AI-calculated daily nutrition targets and real-time macro tracking with intelligent meal suggestions.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to chat with your AI coach on WhatsApp?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of users who are already transforming their lives. Start your fitness journey today—no app download required, just open WhatsApp and start chatting.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/register">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              <span className="font-semibold">Body AI</span>
            </div>
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Body AI. All rights reserved.
              </p>
              <p className="text-sm text-muted-foreground">
                Created by{" "}
                <a
                  href="https://leonardoburbano.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Leonardo Burbano
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
