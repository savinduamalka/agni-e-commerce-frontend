import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './authPages/signIn/page'
import SignUpPage from './authPages/signUp/page'
import VerifyEmailPage from './authPages/verify/page'
import HomePage from './userPages/home/page'
import CategoriesPage from './userPages/categories/page'
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify" element={<VerifyEmailPage />} />
        <Route path="/" element={<HomePage/>} />
        <Route path="/categories" element={<CategoriesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
