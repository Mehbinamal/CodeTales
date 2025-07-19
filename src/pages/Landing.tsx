import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { GitBranch, BookOpen, Share2, Sparkles, Github, Users, Code } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-story -z-10" />
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="story-title mb-6">
              Every Repo Has a Story
              <br />
              <span className="text-primary">Let's Tell Yours</span>
            </h1>
            <p className="story-subtitle mb-8 max-w-2xl mx-auto">
              Transform your GitHub repositories into beautiful, visual stories. 
              Discover the journey behind your code through elegant narratives and interactive timelines.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="lg" className="animate-slide-up">
                <Link to="/generate">
                  <Sparkles className="h-5 w-5" />
                  Generate Your Story
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="animate-slide-up">
                <Link to="#how-it-works">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How CodeTales Works</h2>
            <p className="story-subtitle">Three simple steps to transform your repository into a captivating story</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="card-elegant p-6 text-center hover-scale">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Github className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect Repository</h3>
              <p className="text-muted-foreground">
                Simply paste your GitHub repository URL and let our AI analyze your commit history and codebase.
              </p>
            </Card>

            <Card className="card-elegant p-6 text-center hover-scale">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate Story</h3>
              <p className="text-muted-foreground">
                Our intelligent system creates a beautiful narrative from your commits, highlighting key milestones and evolution.
              </p>
            </Card>

            <Card className="card-elegant p-6 text-center hover-scale">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Share & Showcase</h3>
              <p className="text-muted-foreground">
                Share your code story with the world through beautiful, SEO-optimized pages perfect for portfolios.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Perfect for Developers & Teams</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Portfolio Showcase</h3>
                    <p className="text-muted-foreground">Turn your repositories into compelling portfolio pieces that tell the story of your development journey.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <GitBranch className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Project Documentation</h3>
                    <p className="text-muted-foreground">Generate beautiful, visual documentation that explains your project's evolution and key decisions.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Code className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Team Insights</h3>
                    <p className="text-muted-foreground">Understand team contributions and project milestones through visual commit timelines and analytics.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-elegant p-8 bg-background">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Ready to get started?</h3>
                <p className="text-muted-foreground mb-6">Join thousands of developers who are already telling their code stories.</p>
                <Button asChild variant="hero" size="lg" className="w-full">
                  <Link to="/generate">
                    <Sparkles className="h-5 w-5" />
                    Create Your First Story
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}