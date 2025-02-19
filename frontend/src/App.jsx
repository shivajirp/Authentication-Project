import FloatingShape from "./components/FloatingShape.jsx"
import { Navigate, Route, Routes } from "react-router-dom"
import { Toaster, toast } from "react-hot-toast"
import { useAuthStore } from "./store/useAuthStore.js"
import { useEffect } from "react"

import Dashboard from "./pages/Dashboard.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import EmailVerificationPage from "./pages/EmailVerificationPage.jsx"
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx"


// protect routes that require authentication
const ProtectedRoute = ({children}) => {
  const {isAuthenticated, user} = useAuthStore();

  if(!isAuthenticated) {
    // toast.error("user not authenticated. Please login first")
    return <Navigate to='/login' replace />
  }
  
  if(!user.isVerified) {
    toast.error("user not verified. Please verify user mail first")
    return <Navigate to='/verify-email' replace />
  }

  return children;
}

const RedirectAuthenticatedUser = ({children}) => {
  const {isAuthenticated, user} = useAuthStore();

  if(isAuthenticated && user.isVerified) {
      return <Navigate to='/' replace />
  }

  return children;
}

function App() {

  const {checkAuth, isAuthenticated, isCheckingAuth, user} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("isAuthenticated", isAuthenticated);
  console.log("user", user)

  return (
    <div className="min-h-screen bg-gradient-to-br
    from-gray-800 via-green-900 to-gray-700 flex items-center justify-center relative overflow-hidden">
      <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
			<FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
			<FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />
    
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />   

        <Route 
          path="/signup" 
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          } 
        />    

        <Route 
          path="/login" 
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        /> 
        
        <Route 
          path="/verify-email" 
          element={
            <EmailVerificationPage />
          } 
        />

        <Route 
          path="/forgot-password"
          element={
            <ForgotPasswordPage />
          }
        />

      </Routes>
      <Toaster />

    </div>
  )
}

export default App
