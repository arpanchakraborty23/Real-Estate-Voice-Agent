import { useEffect, useState, useCallback } from 'react'
import { useMaybeRoomContext } from '@livekit/components-react'
import type { RpcInvocationData } from 'livekit-client'
import type { PropertyRecommendation } from '@/types'

export function useVoiceHandlers() {
  const room = useMaybeRoomContext()
  const [images, setImages] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<PropertyRecommendation[]>([])

  useEffect(() => {
    if (!room) return

    room.registerByteStreamHandler(
      'agent-images',
      async (reader) => {
        const chunks = await reader.readAll()
        const blob = new Blob(chunks as BlobPart[], { type: reader.info.mimeType })
        const url = URL.createObjectURL(blob)
        setImages((prev) => [...prev, url])
      },
    )

    room.registerRpcMethod(
      'showPropertyRecommendations',
      async (data: RpcInvocationData) => {
        const props: PropertyRecommendation[] = JSON.parse(data.payload)
        setRecommendations(props)
        return 'ok'
      },
    )

    return () => {
      room.unregisterByteStreamHandler('agent-images')
      room.unregisterRpcMethod('showPropertyRecommendations')
    }
  }, [room])

  const clearImages = useCallback(() => setImages([]), [])

  return { images, recommendations, clearImages }
}
