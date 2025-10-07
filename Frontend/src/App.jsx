import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute.jsx";
import { Layout } from "../components/Layout.jsx";
import { DashboardPage } from "../components/DashboardPage.jsx";
import { ExpensesPage } from "../components/ExpensesPage.jsx";
import { LimitsPage } from "../components/LimitsPage.jsx"; 
import { PageNotFound } from "../components/PageNotFound.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "../components/GoogleLogin.jsx";

function App() {

  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} >
        <GoogleLogin />
      </GoogleOAuthProvider>
    );
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" 
          element={<ProtectedRoute> <Navigate to="/dashboard" replace /> </ProtectedRoute>} 
        />

        <Route path="/login" element={<GoogleAuthWrapper />} />

        <Route element={<ProtectedRoute> <Layout/> </ProtectedRoute>} >
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/expenses" element={<ExpensesPage/>} />
          <Route path="/limits" element={<LimitsPage/>} />
        </Route>

        <Route path="*" element={<PageNotFound/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
