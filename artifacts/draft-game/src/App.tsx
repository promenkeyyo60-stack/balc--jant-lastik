import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useGameStore } from "./hooks/use-game-store";

// Pages
import { SetupPhase } from "./components/game/SetupPhase";
import { DraftPhase } from "./pages/DraftPhase";
import { LeaguePhase } from "./pages/LeaguePhase";

const queryClient = new QueryClient();

function GameRouter() {
  const phase = useGameStore(s => s.phase);

  return (
    <>
      {phase === "setup" && <SetupPhase />}
      {phase === "draft" && <DraftPhase />}
      {phase === "league" && <LeaguePhase />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Global Background */}
        <div className="fixed inset-0 z-0">
           <img 
             src={`${import.meta.env.BASE_URL}images/stadium-bg.png`} 
             alt="Stadium Background" 
             className="w-full h-full object-cover opacity-30 mix-blend-overlay"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
        </div>
        
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Switch>
            <Route path="/" component={GameRouter} />
            <Route component={NotFound} />
          </Switch>
        </WouterRouter>
        <Toaster />
        <footer className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center pb-1">
          <p className="text-[10px] text-white/30 text-center px-2">
            💡 Oyuncu reytingleri ve mevkileri güncel gerçek hayat performanslarına göre Gemini Yapay Zeka ile analiz edilerek oluşturulmuştur.
          </p>
        </footer>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
