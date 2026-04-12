import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import SkinScan from "@/pages/SkinScan";
import AnalysisResult from "@/pages/AnalysisResult";
import Recommendations from "@/pages/Recommendations";
import Questionnaire from "@/pages/Questionnaire";

const queryClient = new QueryClient();

function Router({ uploadedImageUrl, setUploadedImageUrl, scanResult, setScanResult }: { 
  uploadedImageUrl: string | null, 
  setUploadedImageUrl: (url: string|null) => void,
  scanResult: any,
  setScanResult: (res: any) => void
}) {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/scan">
        <SkinScan setUploadedImageUrl={setUploadedImageUrl} setScanResult={setScanResult} />
      </Route>
      <Route path="/result">
        <AnalysisResult uploadedImageUrl={uploadedImageUrl} scanResult={scanResult} />
      </Route>
      <Route path="/recommendation" component={Recommendations} />
      <Route path="/questionnaire" component={Questionnaire} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router 
            uploadedImageUrl={uploadedImageUrl} 
            setUploadedImageUrl={setUploadedImageUrl}
            scanResult={scanResult}
            setScanResult={setScanResult}
          />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
