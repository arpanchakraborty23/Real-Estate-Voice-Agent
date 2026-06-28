import { useMemo } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useSession, useSessionContext } from '@livekit/components-react'
import { TokenSource } from 'livekit-client'
import { AnimatePresence, motion } from 'motion/react'
import { AgentSessionProvider } from '@/components/agents-ui/agent-session-provider'
import { StartAudioButton } from '@/components/agents-ui/start-audio-button'
import { AgentSessionView_01 } from '@/components/agents-ui/blocks/agent-session-view-01'
import { ImageGallery } from '@/components/ImageGallery'
import { PropertyRecommendations } from '@/components/PropertyRecommendations'
import { useVoiceHandlers } from '@/components/VoiceHandlers'

const MotionWelcomeView = motion.create('div')
const MotionSessionView = motion.create(AgentSessionView_01)

const VIEW_MOTION = {
  variants: { visible: { opacity: 1 }, hidden: { opacity: 0 } },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: { duration: 0.5, ease: 'linear' as const },
}

function WelcomeView({ onStartCall, startButtonText }: { onStartCall: () => void; startButtonText: string }) {
  return (
    <MotionWelcomeView {...VIEW_MOTION} className="flex flex-col items-center justify-center text-center">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-4 text-terracotta">
        <path d="M32 4a12 12 0 0 0-12 12v16a12 12 0 0 0 24 0V16A12 12 0 0 0 32 4z" fill="currentColor" opacity="0.3" />
        <path d="M44 28v4a12 12 0 0 1-24 0v-4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M32 44v8m-6 0h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="16" r="4" fill="currentColor" />
      </svg>

      <h2 className="font-display text-xl font-bold text-ink">Real Estate Consulting</h2>
      <p className="mt-1 text-sm text-ink-muted max-w-xs">
        Chat live with Anjali, your AI property expert
      </p>

      <button
        onClick={onStartCall}
        className="mt-6 inline-flex h-12 w-64 cursor-pointer items-center justify-center rounded-full bg-terracotta text-xs font-bold tracking-wider text-white uppercase shadow-md shadow-terracotta/20 transition-all hover:bg-terracotta-hover hover:shadow-lg hover:shadow-terracotta/25 active:scale-[0.97]"
      >
        {startButtonText}
      </button>
    </MotionWelcomeView>
  )
}

function SessionView() {
  const { images, recommendations, clearImages } = useVoiceHandlers()
  const hasDynamic = images.length > 0 || recommendations.length > 0

  return (
    <div className="relative h-full w-full">
      <MotionSessionView
        {...VIEW_MOTION}
        supportsChatInput
        isPreConnectBufferEnabled
        audioVisualizerColor="#c1694f"
        audioVisualizerColorShift={0.08}
        className="fixed inset-0"
      />

      {hasDynamic && (
        <div className="fixed bottom-[140px] left-1/2 z-[70] w-full max-w-2xl -translate-x-1/2 px-4 md:bottom-[170px] md:px-0">
          <div className="max-h-[40vh] space-y-3 overflow-y-auto rounded-xl border border-border/50 bg-card p-3 shadow-warm-lg">
            <ImageGallery images={images} onClear={clearImages} />
            <PropertyRecommendations properties={recommendations} />
          </div>
        </div>
      )}
    </div>
  )
}

function ViewController() {
  const { isConnected, start } = useSessionContext()

  return (
    <AnimatePresence mode="wait">
      {!isConnected ? (
        <WelcomeView key="welcome" startButtonText="Start Consultation" onStartCall={start} />
      ) : (
        <SessionView key="session-view" />
      )}
    </AnimatePresence>
  )
}

export function HomePage() {
  const { getToken } = useAuth()

  const tokenSource = useMemo(
    () => TokenSource.custom(async (options) => {
      const clerkToken = await getToken()
      const response = await fetch('/api/v1/agent/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${clerkToken}`,
        },
        body: JSON.stringify({
          room_name: options.roomName,
          participant_identity: options.participantIdentity,
          participant_attributes: options.participantAttributes,
          room_config: options.agentName ? {
            agents: [{ agent_name: options.agentName }],
          } : undefined,
        }),
      })
      if (!response.ok) throw new Error(`Token fetch failed: ${response.status}`)
      const data = await response.json()
      return {
        serverUrl: data.server_url,
        participantToken: data.participant_token,
      }
    }),
    [getToken],
  )

  const session = useSession(tokenSource, { agentName: 'new-house-agent' })

  return (
    <AgentSessionProvider session={session}>
      <main className="grid h-svh grid-cols-1 place-content-center">
        <ViewController />
      </main>
      <StartAudioButton label="Start Audio" />
    </AgentSessionProvider>
  )
}
