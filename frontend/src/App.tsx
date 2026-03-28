import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";
import LoginPage from "@/features/auth/login-page";
import AdminHomePage from "@/features/auth/admin-home-page";
import UserHomePage from "@/features/auth/user-home-page";
import { useBffAuth } from "@/features/auth/useBffAuth";
import { isMockEnabled } from "@/services/api";
import { useLogger } from "@/hooks/use-logger";
import { LottieLoader } from "@/components/ui/lottie-loader";

/**
 * Componente per proteggere le rotte che richiedono autenticazione.
 */
function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: string }) {
  const { isAuthenticated, loading, user } = useBffAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <LottieLoader message="Verifica sessione in corso..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && !user?.roles?.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export function App() {
  const { isAuthenticated, loading, user } = useBffAuth();
  const logger = useLogger("System");

  useEffect(() => {
    if (isMockEnabled) {
      logger.warn("API MODE: MOCK (Simulazione attiva)");
    } else {
      logger.success("API MODE: REAL (Connessione al Backend)");
    }
  }, [logger]);

  // Determina la home corretta in base al ruolo
  const getHomeRoute = () => {
    if (!isAuthenticated) return "/login";
    return user?.roles?.includes("ROLE_ADMIN") ? "/admin" : "/home";
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Reindirizzamento dinamico della Root */}
        <Route path="/" element={
          loading ? (
            <div className="flex h-screen items-center justify-center bg-background">
              <LottieLoader message="Inizializzazione ChatBot..." />
            </div>
          ) : (
            <Navigate to={getHomeRoute()} replace />
          )
        } />

        {/* Rotta Pubblica - Accessibile anche durante il loading della sessione per permettere al form di mostrare i propri stati */}
        <Route 
          path="/login" 
          element={
            !loading && isAuthenticated ? <Navigate to={getHomeRoute()} replace /> : <LoginPage />
          } 
        />

        {/* Rotta protetta Admin */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminHomePage />
            </ProtectedRoute>
          } 
        />

        {/* Rotta protetta User standard */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <UserHomePage />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
