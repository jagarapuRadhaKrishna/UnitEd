import React from "react";
import { Button } from "@/components/ui/button";

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

class AppErrorBoundary extends React.Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  public state: AppErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Unhandled application error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
          <h1 className="mb-3 text-2xl font-bold text-foreground">Something went wrong</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            The app hit an unexpected error. Reload the page or return to a safe route.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={this.handleRetry}>Reload</Button>
            <Button variant="outline" onClick={() => window.location.assign("/home")}>
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default AppErrorBoundary;
