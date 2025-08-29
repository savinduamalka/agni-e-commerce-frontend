import './App.css'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './authPages/signIn/page'
import SignUpPage from './authPages/signUp/page'
import VerifyEmailPage from './authPages/verify/page'
import HomePage from './userPages/home/page'
import CategoriesPage from './userPages/categories/page'
import ProductsPage from './userPages/products/page'
import OfferProductsPage from './userPages/offerProducts/page'
import ProductDetailPage from './userPages/productDetail/page'

function App() {
  return (
      <Routes>
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify" element={<VerifyEmailPage />} />
        <Route path="/" element={<HomePage/>} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/offers" element={<OfferProductsPage />} />
      </Routes>
  )
}

export default App
