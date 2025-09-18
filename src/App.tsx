import './App.css'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './authPages/signIn/page'
import SignUpPage from './authPages/signUp/page'
import VerifyEmailPage from './authPages/verify/page'
import HomePage from './userPages/home/page'
import CategoriesPage from './userPages/categories/page'
import ProductsPage from './userPages/products/page'
import OfferProductsPage from './userPages/offerProducts/page'
import ProductDetailPage from './userPages/productDetail/page'
import CartPage from './userPages/cart/page'
import ContactUsPage from './userPages/contactUs/page'
import ScrollToTop from './components/shared/ScrollToTop'

function App() {
  return (
    <>
      <ScrollToTop />
      <main className="flex-grow">
        <Routes>
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify" element={<VerifyEmailPage />} />
          <Route path="/" element={<HomePage/>} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/offers" element={<OfferProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
