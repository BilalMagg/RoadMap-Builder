import "./global.css";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
// Initialize API interceptors
import "./services/http/index";
import ProtectedRoute from "./routes/ProtectedRoute";
import Index from "./pages/index/Index";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/editProfile/EditProfile";
import Canvas from "./pages/canva/Canvas";
import RoadmapList from "./pages/roadmaps/RoadmapList";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import NotFound from "./pages/notFound/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();
const ScrollToTop = () => {
  
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // Triggers on every route change

  return null;
};
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/edit"
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roadmaps"
                element={
                  <ProtectedRoute>
                    <RoadmapList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/canvas/:id"
                element={
                  <ProtectedRoute>
                    <Canvas />
                  </ProtectedRoute>
                }
              />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// declare global {
//   interface Window {
//     __APP_ROOT?: ReturnType<typeof createRoot>;
//   }
// }

// function initApp() {
//   const rootElement = document.getElementById("root");
//   if (!rootElement) {
//     console.error("Root element not found");
//     return;
//   }

//   if (!window.__APP_ROOT) {
//     window.__APP_ROOT = createRoot(rootElement);
//   }

//   window.__APP_ROOT.render(<App />);
// }

// if (document.readyState === "loading") {
//   document.addEventListener("DOMContentLoaded", initApp);
// } else {
//   initApp();
// }

// if (import.meta.hot) {
//   import.meta.hot.dispose(() => {
//     if (window.__APP_ROOT) {
//       window.__APP_ROOT.unmount();
//       window.__APP_ROOT = undefined;
//     }
//   });
// }

export default App;