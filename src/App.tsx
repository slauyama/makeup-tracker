import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MakeupPage from "./pages/MakeupPage";
import DogPage from "./pages/DogPage";
import CarPage from "./pages/CarPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/makeup/*" element={<MakeupPage />} />
            <Route path="/dog" element={<DogPage />} />
            <Route path="/car" element={<CarPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
