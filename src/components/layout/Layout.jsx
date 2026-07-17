import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Navbar />
      <main className="flex-1 flex flex-col pt-12 lg:pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
