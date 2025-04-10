import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SearchBooks from "./pages/books/SearchBooks";
import IssueBook from "./pages/books/IssueBook";
import ReturnBook from "./pages/books/ReturnBook";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import { useRequireAuth } from "./hooks/use-require-auth";

const queryClient = new QueryClient();

const ProtectedRoute = ({ 
  element, 
  requiredRole 
}: { 
  element: React.ReactNode, 
  requiredRole?: "admin" | "user" 
}) => {
  const { user, isLoading } = useRequireAuth(requiredRole);
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return user ? <>{element}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/books/search" element={<ProtectedRoute element={<SearchBooks />} />} />
            <Route path="/books/issue" element={<ProtectedRoute element={<IssueBook />} />} />
            <Route path="/books/return" element={<ProtectedRoute element={<ReturnBook />} />} />
            <Route path="/books/add" element={<ProtectedRoute element={<Dashboard />} requiredRole="admin" />} />
            <Route path="/books/update" element={<ProtectedRoute element={<Dashboard />} requiredRole="admin" />} />
            <Route path="/membership/add" element={<ProtectedRoute element={<Dashboard />} requiredRole="admin" />} />
            <Route path="/membership/update" element={<ProtectedRoute element={<Dashboard />} requiredRole="admin" />} />
            <Route path="/users/manage" element={<ProtectedRoute element={<Dashboard />} requiredRole="admin" />} />
            <Route path="/unauthorized" element={<ProtectedRoute element={<Unauthorized />} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
