import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Github, Loader2, BookOpen, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RepoData {
  repo_name: string;
  owner: string;
  story: string;
  code_summary: string;
  main_language: string;
  commit_history?: any[];
}

export default function GenerateStory() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [storyData, setStoryData] = useState<RepoData | null>(null);
  const { toast } = useToast();

  const validateGitHubUrl = (url: string) => {
    const githubUrlPattern = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/;
    return githubUrlPattern.test(url);
  };

  const handleGenerate = async () => {
    if (!repoUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a GitHub repository URL.",
        variant: "destructive",
      });
      return;
    }

    if (!validateGitHubUrl(repoUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo).",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Call Supabase Edge Function to generate story
      const { data, error } = await supabase.functions.invoke('generate_story_from_repo', {
        body: { repo_url: repoUrl }
      });

      if (error) {
        throw error;
      }

      if (data) {
        setStoryData(data);
        toast({
          title: "Story Generated!",
          description: "Successfully generated repository story.",
        });
      }
    } catch (error) {
      console.error('Error generating story:', error);
      toast({
        title: "Error",
        description: "Failed to generate story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="story-title mb-4">Generate Repository Story</h1>
          <p className="story-subtitle">Transform your GitHub repository into a beautiful visual narrative</p>
        </div>

        <Card className="card-elegant p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="https://github.com/user/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="text-base"
                disabled={loading}
              />
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={loading}
              variant="hero"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Github className="h-4 w-4" />
                  Generate Story
                </>
              )}
            </Button>
          </div>
        </Card>

        {storyData && (
          <div className="space-y-6 animate-fade-in">
            {/* Repository Header */}
            <Card className="card-elegant p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                  <Github className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{storyData.repo_name}</h2>
                  <p className="text-muted-foreground mb-4">by {storyData.owner}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-primary" />
                      <span>{storyData.main_language}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>Public Repository</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Generated Story */}
            <Card className="card-elegant p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Repository Story
              </h3>
              <div className="story-body prose prose-neutral max-w-none">
                {storyData.story}
              </div>
            </Card>

            {/* Code Summary */}
            <Card className="card-elegant p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Code Analysis
              </h3>
              <div className="story-body">
                {storyData.code_summary}
              </div>
            </Card>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground mt-8">
              Powered by Supabase + GitHub + AI
            </div>
          </div>
        )}
      </div>
    </div>
  );
}