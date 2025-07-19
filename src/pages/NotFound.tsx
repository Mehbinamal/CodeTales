import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Book, Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="card-elegant p-8 text-center max-w-md">
        <div className="w-16 h-16 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-6">
          <Book className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-xl font-semibold mb-4">Story Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist. Perhaps this story is yet to be written?
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="hero" className="flex-1">
            <Link to="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to="/generate">
              <Search className="h-4 w-4" />
              Generate Story
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
