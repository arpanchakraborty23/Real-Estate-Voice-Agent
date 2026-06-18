import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-react'
import { createContext, useContext, ReactNode } from 'react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_your_key_here'

interface AuthContextType {
  userId: string | null
  isSignedIn: boolean
  isLoaded: boolean
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    fullName: string | null
    emailAddresses: Array<{ emailAddress: string }>
    phoneNumbers: Array<{ phoneNumber: string }>
    imageUrl: string
    unsafeMetadata: Record<string, unknown>
    publicMetadata: Record<string, unknown>
  } | null
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/login"
      signUpUrl="/login"
      afterSignOutUrl="/"
    >
      <AuthProviderInner>{children}</AuthProviderInner>
    </ClerkProvider>
  )
}

function AuthProviderInner({ children }: { children: ReactNode }) {
  const { userId, isSignedIn, isLoaded, signOut } = useAuth()
  const { user } = useUser()

  return (
    <AuthContext.Provider
      value={{
        userId,
        isSignedIn,
        isLoaded,
        user,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}