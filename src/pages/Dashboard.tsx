import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Book, Github, Plus, Calendar, ExternalLink, Trash2 } from "lucide-react";

interface TrackedRepo {
  id: string;
  repo_url: string;
  created_at: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [trackedRepos, setTrackedRepos] = useState<TrackedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchTrackedRepos();
    }
  }, [user]);

  const fetchTrackedRepos = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tracked_repos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrackedRepos(data || []);
    } catch (error) {
      console.error('Error fetching tracked repos:', error);
      toast({
        title: "Error",
        description: "Failed to load your tracked repositories.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeTrackedRepo = async (repoId: string) => {
    try {
      const { error } = await supabase
        .from('tracked_repos')
        .delete()
        .eq('id', repoId);

      if (error) throw error;

      setTrackedRepos(prev => prev.filter(repo => repo.id !== repoId));
      toast({
        title: "Repository Removed",
        description: "The repository has been removed from your tracked list.",
      });
    } catch (error) {
      console.error('Error removing tracked repo:', error);
      toast({
        title: "Error",
        description: "Failed to remove the repository.",
        variant: "destructive",
      });
    }
  };

  const getRepoName = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 1] || 'Unknown Repository';
  };

  const getRepoOwner = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 2] || 'Unknown Owner';
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access your dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="story-title mb-2">My Code Stories</h1>
            <p className="story-subtitle">Track and manage your repository stories</p>
          </div>
          <Button 
            onClick={() => navigate("/generate")} 
            variant="hero"
            className="hover-scale"
          >
            <Plus className="h-4 w-4" />
            Generate New Story
          </Button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="card-elegant p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : trackedRepos.length === 0 ? (
          <Card className="card-elegant p-12 text-center">
            <div className="w-16 h-16 gradient-story rounded-lg flex items-center justify-center mx-auto mb-6">
              <Book className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">No Stories Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven't tracked any repositories yet. Start by generating your first code story!
            </p>
            <Button 
              onClick={() => navigate("/generate")} 
              variant="hero"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              Generate Your First Story
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trackedRepos.map((repo) => (
              <Card key={repo.id} className="card-elegant hover-scale">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                        <Github className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg truncate">{getRepoName(repo.repo_url)}</CardTitle>
                        <CardDescription className="truncate">by {getRepoOwner(repo.repo_url)}</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTrackedRepo(repo.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Tracked {new Date(repo.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="story" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(repo.repo_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Repo
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/generate?url=${encodeURIComponent(repo.repo_url)}`)}
                    >
                      <Book className="h-4 w-4" />
                      View Story
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}