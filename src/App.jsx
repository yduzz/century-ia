import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/ui/UserNotRegisteredError';
import AppLayout from './components/chat/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import PropertyPresentation from './pages/PropertyPresentation';
import SocialMedia from './pages/SocialMedia';
import ImagemGenerator from './pages/ImagemGenerator';
import AgentAssistant from './pages/AgentAssistant';
import ConversationHistory from './pages/ConversationHistory';
import PropertyAnalysis from './pages/PropertyAnalysis';
import PosseGenerator from './pages/PosseGenerator';
import VercelAuthCallback from './pages/VercelAuthCallback';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/auth/vercel/callback" element={<VercelAuthCallback />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/property-presentation" element={<PropertyPresentation />} />
        <Route path="/social-media" element={<SocialMedia />} />
        <Route path="/image-generator" element={<ImagemGenerator />} />
        <Route path="/agent-assistant" element={<AgentAssistant />} />
        <Route path="/history" element={<ConversationHistory />} />
        <Route path="/property-analysis" element={<PropertyAnalysis />} />
        <Route path="/pose-generator" element={<PosseGenerator />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App