import { useAgent } from '@livekit/components-react'
import { AgentAudioVisualizerBar } from '@/components/agents-ui/agent-audio-visualizer-bar'

export function AudioVisualizer() {
  const agent = useAgent()

  return (
    <div className="flex flex-col items-center gap-2">
      <AgentAudioVisualizerBar
        color="#c1694f"
        className="w-full max-w-md"
      />
      <span className="text-xs font-medium text-ink-muted capitalize">
        {agent.state === 'listening' ? 'Listening...' :
         agent.state === 'thinking' ? 'Thinking...' :
         agent.state === 'speaking' ? 'Speaking...' :
         agent.state === 'connecting' ? 'Connecting...' :
         agent.state === 'initializing' ? 'Initializing...' :
         agent.state === 'disconnected' ? 'Disconnected' :
         agent.state === 'failed' ? 'Connection failed' :
         'Idle'}
      </span>
    </div>
  )
}
