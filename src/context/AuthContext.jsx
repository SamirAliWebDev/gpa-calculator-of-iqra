import { createContext, useContext } from 'react'
import db from '../lib/db'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { isLoading, user, error } = db.useAuth()

  const sendMagicCode = async (email) => {
    return db.auth.sendMagicCode({ email })
  }

  const signInWithMagicCode = async (email, code) => {
    return db.auth.signInWithMagicCode({ email, code })
  }

  const signOut = async () => {
    return db.auth.signOut()
  }

  const value = {
    isLoading,
    user,
    error,
    isAuthenticated: !!user,
    sendMagicCode,
    signInWithMagicCode,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
