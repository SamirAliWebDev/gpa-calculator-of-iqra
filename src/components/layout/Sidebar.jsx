import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, BookOpen, User, ChevronLeft, ChevronRight, LogOut, GraduationCap, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home', end: true },
  { to: '/dashboard/semesters', icon: BookOpen, label: 'Semesters' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
]

function SidebarLink({ to, icon: Icon, label, end, expanded, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-zinc-400 hover:text-white hover:bg-white/5'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full"
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />
          )}
          <Icon className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap overflow-hidden"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
          {!expanded && (
            <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-zinc-800 text-white text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              {label}
            </div>
          )}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ expanded, onToggle, mobileOpen, onMobileClose }) {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: expanded ? 240 : 72 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex flex-col fixed top-0 left-0 h-screen z-40 bg-zinc-950 border-r border-white/10"
      >
        {/* Brand + toggle */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <AnimatePresence mode="wait">
            {expanded ? (
              <motion.div
                key="full-brand"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-sm text-white whitespace-nowrap">GPA Calculator</span>
              </motion.div>
            ) : (
              <motion.div
                key="mini-brand"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center w-full"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {expanded && (
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {!expanded && (
          <button
            onClick={onToggle}
            className="flex items-center justify-center h-10 mx-auto mt-3 w-9 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, icon, label, end }) => (
            <SidebarLink
              key={to}
              to={to}
              icon={icon}
              label={label}
              end={end}
              expanded={expanded}
            />
          ))}
        </nav>

        {/* Bottom sign out */}
        <div className="px-3 pb-4 border-t border-white/10 pt-3">
          <button
            onClick={handleSignOut}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full',
              'text-zinc-400 hover:text-red-400 hover:bg-red-500/10'
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-screen w-[260px] z-50 bg-zinc-950 border-r border-white/10 flex flex-col lg:hidden"
            >
              {/* Mobile brand + close */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-sm text-white">GPA Calculator</span>
                </div>
                <button
                  onClick={onMobileClose}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile nav links */}
              <nav className="flex-1 px-3 py-4 space-y-1">
                {links.map(({ to, icon, label, end }) => (
                  <SidebarLink
                    key={to}
                    to={to}
                    icon={icon}
                    label={label}
                    end={end}
                    expanded={true}
                    onClick={onMobileClose}
                  />
                ))}
              </nav>

              {/* Mobile bottom sign out */}
              <div className="px-3 pb-4 border-t border-white/10 pt-3">
                <button
                  onClick={() => {
                    onMobileClose()
                    handleSignOut()
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
