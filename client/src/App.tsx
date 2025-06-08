import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import Vaccines from "@/pages/vaccines";
import Diary from "@/pages/diary";
import Navigation from "@/components/navigation";

function Router() {
  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen shadow-2xl relative overflow-hidden">
      <Navigation />
      <main className="pb-20">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/tasks" component={Tasks} />
          <Route path="/vaccines" component={Vaccines} />
          <Route path="/diary" component={Diary} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
