import { Outlet, useLocation } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { TooltipProvider } from '@/components/ui/tooltip'
import { LoginPrompt } from '@/components/LoginPrompt'

export function Layout() {
  const location = useLocation()
  const hideFooter = location.pathname === '/voice-agent'

  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col bg-ivory-light">
        <NavBar />
        <main className="flex-1">
          <Outlet />
        </main>
        {!hideFooter && <Footer />}
        <LoginPrompt />
      </div>
    </TooltipProvider>
  )
}
