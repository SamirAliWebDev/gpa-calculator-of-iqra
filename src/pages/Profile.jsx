import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, GraduationCap, Save, CheckCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import db from '../lib/db'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function Profile() {
  const { user } = useAuth()
  const { data } = db.useQuery(
    user ? { profiles: {} } : null
  )
  const profile = data?.profiles?.[0]

  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile?.name) {
      setName(profile.name)
    }
  }, [profile?.name])

  const displayName = profile?.name || 'Student'
  const displayEmail = user?.email || 'Not available'

  const hasChanges = name.trim() && name.trim() !== profile?.name

  const handleSave = async () => {
    if (!user || !profile || !name.trim()) return
    setSaving(true)
    setSaved(false)
    try {
      await db.transact(db.tx.profiles[profile.id].update({ name: name.trim() }))
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error('Failed to save profile:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && hasChanges && !saving) {
      handleSave()
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage your account information</p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
        className="bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{displayName}</p>
            <p className="text-sm text-zinc-400">{displayEmail}</p>
            <p className="text-xs text-zinc-500 mt-1">Iqra University</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your name"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="email"
              value={displayEmail}
              readOnly
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 text-sm cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">University</label>
          <div className="relative">
            <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value="Iqra University"
              readOnly
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 text-sm cursor-not-allowed"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={saving || !hasChanges}
          >
            {saved ? (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Saved!
              </span>
            ) : saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </span>
            )}
          </Button>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-accent"
            >
              Profile updated successfully!
            </motion.span>
          )}
        </div>
      </motion.div>
    </div>
  )
}
