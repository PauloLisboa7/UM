import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import EstruturaDetail from "./pages/EstruturaDetail";
import Estruturas from "./pages/Estruturas";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Obras from "./pages/Obras";
import Register from "./pages/Register";
import Splash from "./pages/Splash";
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />
              <Route path="/obras" element={<Obras />} />
              <Route path="/estruturas" element={<Estruturas />} />
              <Route path="/estruturas/:id" element={<EstruturaDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<div>Página não encontrada</div>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
  );
}

export default App;
