import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, LogIn, KeyRound, CheckCircle } from 'lucide-react'
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

export default function Login() {
  const navigate = useNavigate()
  const { sendMagicCode, signInWithMagicCode } = useAuth()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendCode = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    try {
      await sendMagicCode(email.trim())
      setStep('code')
    } catch (err) {
      setError(err.message || 'Failed to send magic code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError('')
    try {
      const result = await signInWithMagicCode(email.trim(), code.trim())
      const userId = result?.user?.id
      if (!userId) throw new Error('Failed to sign in.')

      const { data } = await db.queryOnce({ profiles: {} })
      const hasProfile = data?.profiles?.some((p) => p.userId === userId)

      if (!hasProfile) {
        await db.auth.signOut()
        setError("You don't have an account yet. Please sign up first.")
        setStep('email')
        setCode('')
        return
      }

      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setStep('email')
    setCode('')
    setError('')
  }

  return (
    <div className="flex-1 flex items-center justify-center relative px-4 py-20">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
          {/* Header */}
          <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible" className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              {step === 'email' ? (
                <LogIn className="w-7 h-7 text-primary" />
              ) : (
                <KeyRound className="w-7 h-7 text-primary" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">
              {step === 'email' ? 'Welcome Back' : 'Check Your Email'}
            </h1>
            <p className="text-zinc-400 text-sm mt-2">
              {step === 'email'
                ? 'Sign in to track your GPA'
                : `We sent a code to ${email}`}
            </p>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Email Step */}
          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible">
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending code...
                    </span>
                  ) : (
                    'Send Magic Code'
                  )}
                </Button>
              </motion.div>
            </form>
          )}

          {/* Code Step */}
          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible">
                <label htmlFor="code" className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
                  <input
                    id="code"
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm tracking-[0.5em] text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Verify & Sign In
                    </span>
                  )}
                </Button>
              </motion.div>

              <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full text-sm text-zinc-400 hover:text-white transition-colors py-2"
                >
                  Use a different email
                </button>
              </motion.div>
            </form>
          )}

          {/* Footer link */}
          <motion.p variants={fadeUp} custom={4} initial="hidden" animate="visible" className="text-center text-sm text-zinc-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-dark font-medium transition-colors">
              Sign up free
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
