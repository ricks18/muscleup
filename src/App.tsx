import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import { LoginForm } from "./components/auth/LoginForm";
import routes from "tempo-routes";
import { useAuth } from "./lib/auth";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="text-foreground">Carregando...</p>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<p className="text-foreground">Carregando...</p>}>
        <>
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/login"
              element={!user ? <LoginForm /> : <Navigate to="/" replace />}
            />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </div>
  );
}

export default App;
