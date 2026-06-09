import { useEffect, useMemo } from 'react'
import { useSession } from '@livekit/components-react'
import { TokenSource } from 'livekit-client'
import { AgentSessionProvider } from '@/components/agents-ui/agent-session-provider'
import { AgentControlBar } from '@/components/agents-ui/agent-control-bar'
import { StartAudioButton } from '@/components/agents-ui/start-audio-button'
import { AudioVisualizer } from '@/components/AudioVisualizer'
import { VoiceChat } from '@/components/VoiceChat'
import { ImageGallery } from '@/components/ImageGallery'
import { PropertyRecommendations } from '@/components/PropertyRecommendations'
import { useVoiceHandlers } from '@/components/VoiceHandlers'

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL ?? 'ws://localhost:7880'

function VoiceContent() {
  const { images, recommendations, clearImages } = useVoiceHandlers()

  return (
    <>
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center gap-4 rounded-xl bg-card p-6 shadow-warm">
            <AudioVisualizer />
            <StartAudioButton label="Start Audio" className="rounded-lg bg-terracotta px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta-hover cursor-pointer" />
            <AgentControlBar
              controls={{ microphone: true, leave: true }}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-4 rounded-xl bg-card p-6 shadow-warm">
            <VoiceChat />
          </div>
        </div>

        <div className="mt-6">
          <ImageGallery images={images} onClear={clearImages} />
        </div>

        <div className="mt-6">
          <PropertyRecommendations properties={recommendations} />
        </div>
      </div>
    </>
  )
}

export function HomePage() {
  const tokenSource = useMemo(() => TokenSource.custom(async (options) => {
    const res = await fetch('/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomName: options.roomName,
        participantName: options.participantName,
        agentName: options.agentName,
      }),
    })
    if (!res.ok) throw new Error('Failed to fetch token')
    const { token } = await res.json()
    return { serverUrl: LIVEKIT_URL, participantToken: token }
  }), [])

  const session = useSession(tokenSource, { agentName: 'new-house-agent' })

  useEffect(() => {
    session.start()
    return () => { session.end() }
  }, [session])

  return (
    <AgentSessionProvider session={session}>
      <div className="relative mx-auto max-w-6xl px-6 py-8">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl opacity-40">
          <img src="/home-hero.svg" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <svg className="size-6 text-terracotta" aria-hidden="true">
              <use href="/brand-icons.svg#icon-building" />
            </svg>
            <svg className="size-5 text-gold" aria-hidden="true">
              <use href="/brand-icons.svg#icon-star" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-ink">
            Your AI Real Estate Assistant
          </h1>
          <p className="mt-1 text-ink-muted">
            Talk to Anjali — find your dream home
          </p>
        </div>

        <VoiceContent />
      </div>
    </AgentSessionProvider>
  )
}
