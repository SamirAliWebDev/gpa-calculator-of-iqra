import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Outlet />
    </div>
  )
}
