import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import VoucherList from './pages/VoucherList'
import VoucherDetail from './pages/VoucherDetail'
import VoucherCreate from './pages/VoucherCreate'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/vouchers" element={<ProtectedRoute><VoucherList/></ProtectedRoute>}></Route>
        <Route path="/vouchers/:id" element={<ProtectedRoute><VoucherDetail /></ProtectedRoute>}></Route>
        <Route path="/vouchers/create" element={<ProtectedRoute><VoucherCreate /></ProtectedRoute>}></Route>
      </Routes>
    </BrowserRouter> 
  </StrictMode>
)
