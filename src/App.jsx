import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AuthLayout from './components/layout/AuthLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardHome from './pages/DashboardHome'
import Semesters from './pages/Semesters'
import SemesterDetail from './pages/SemesterDetail'
import Profile from './pages/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/semesters" element={<Semesters />} />
          <Route path="/dashboard/semesters/:id" element={<SemesterDetail />} />
          <Route path="/dashboard/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
