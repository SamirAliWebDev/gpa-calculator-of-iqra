import { Menu, Bell, Search, GraduationCap } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useAuth } from '../../context/AuthContext'
import db from '../../lib/db'

export default function DashboardTopbar({ sidebarExpanded, onMobileMenuToggle }) {
  const { user } = useAuth()
  const { data } = db.useQuery(
    user ? { profiles: {} } : null
  )
  const profile = data?.profiles?.[0]
  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'S'

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 transition-all duration-300',
        'bg-transparent lg:bg-zinc-950/80 lg:backdrop-blur-xl lg:border-b lg:border-white/10',
        sidebarExpanded ? 'lg:left-60' : 'lg:left-[72px]'
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search semesters..."
            className="bg-transparent text-sm text-white placeholder-zinc-500 outline-none w-48 lg:w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </button>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
          {initials}
        </div>
      </div>
    </header>
  )
}
