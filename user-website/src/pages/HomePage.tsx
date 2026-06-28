import { useMemo } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useSession, useSessionContext, useAgent } from '@livekit/components-react'
import { TokenSource } from 'livekit-client'
import { AnimatePresence, motion } from 'motion/react'
import { AgentSessionProvider } from '@/components/agents-ui/agent-session-provider'
import { AgentControlBar } from '@/components/agents-ui/agent-control-bar'
import { StartAudioButton } from '@/components/agents-ui/start-audio-button'
import { AgentAudioVisualizerAura } from '@/components/agents-ui/agent-audio-visualizer-aura'
import { AgentChatTranscript } from '@/components/agents-ui/agent-chat-transcript'
import { AgentChatIndicator } from '@/components/agents-ui/agent-chat-indicator'
import { ImageGallery } from '@/components/ImageGallery'
import { PropertyRecommendations } from '@/components/PropertyRecommendations'
import { useVoiceHandlers } from '@/components/VoiceHandlers'

const MotionWelcomeView = motion.create('div')
const MotionSessionView = motion.create('div')

const VIEW_MOTION = {
  variants: { visible: { opacity: 1 }, hidden: { opacity: 0 } },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: { duration: 0.35, ease: 'easeInOut' as const },
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
  const agent = useAgent()
  const { images, recommendations, clearImages } = useVoiceHandlers()

  return (
    <MotionSessionView {...VIEW_MOTION} className="mx-auto flex w-full max-w-lg flex-col items-center">
      <AgentAudioVisualizerAura
        size="lg"
        state={agent.state}
        color="#c1694f"
        colorShift={0.08}
        themeMode="light"
        className="mb-4"
      />

      <span className="mb-5 text-sm font-medium text-ink-muted capitalize">
        {agent.state === 'listening' ? 'Listening...' :
         agent.state === 'thinking' ? 'Thinking...' :
         agent.state === 'speaking' ? 'Speaking...' :
         agent.state === 'connecting' ? 'Connecting...' :
         agent.state === 'initializing' ? 'Initializing...' :
         agent.state === 'disconnected' ? 'Disconnected' :
         agent.state === 'failed' ? 'Connection failed' :
         'Idle'}
      </span>

      <AgentControlBar
        controls={{ microphone: true, leave: true }}
        className="w-full max-w-xs"
      />

      <div className="mt-6 w-full rounded-xl border border-border/50 bg-card p-4">
        <AgentChatTranscript className="max-h-48 overflow-y-auto text-sm" />
        <AgentChatIndicator />
      </div>

      <div className="mt-4 w-full space-y-4">
        <ImageGallery images={images} onClear={clearImages} />
        <PropertyRecommendations properties={recommendations} />
      </div>
    </MotionSessionView>
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
      <main className="grid min-h-[calc(100vh-4rem)] grid-cols-1 place-content-center px-6 py-10">
        <ViewController />
      </main>
      <StartAudioButton label="Start Audio" />
    </AgentSessionProvider>
  )
}
