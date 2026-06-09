import { AgentChatTranscript } from '@/components/agents-ui/agent-chat-transcript'
import { AgentChatIndicator } from '@/components/agents-ui/agent-chat-indicator'

export function VoiceChat() {
  return (
    <div className="flex flex-col gap-2">
      <AgentChatTranscript className="max-h-80 overflow-y-auto" />
      <AgentChatIndicator />
    </div>
  )
}
