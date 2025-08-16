"use client"

import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import Image from "next/image"

interface ConversationListProps {
  conversations: any[]
  activeConversation: any
  onSelectConversation: (conversation: any) => void
  currentUserId: string
}

export function ConversationList({
  conversations,
  activeConversation,
  onSelectConversation,
  currentUserId,
}: ConversationListProps) {
  const getOtherUser = (conversation: any) => {
    const isHost = conversation.host_id === currentUserId
    return isHost ? conversation.profiles : conversation.profiles
  }

  const getLastMessage = (conversation: any) => {
    if (!conversation.messages || conversation.messages.length === 0) return null
    return conversation.messages[conversation.messages.length - 1]
  }

  const getUnreadCount = (conversation: any) => {
    if (!conversation.messages) return 0
    return conversation.messages.filter((msg: any) => !msg.is_read && msg.sender_id !== currentUserId).length
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      // Less than a week
      return date.toLocaleDateString("en-US", { weekday: "short" })
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
        <p className="text-gray-600">Your booking conversations will appear here</p>
      </div>
    )
  }

  return (
    <div className="overflow-y-auto">
      {conversations.map((conversation) => {
        const otherUser = getOtherUser(conversation)
        const lastMessage = getLastMessage(conversation)
        const unreadCount = getUnreadCount(conversation)
        const isActive = activeConversation?.id === conversation.id
        const primaryPhoto =
          conversation.cars.car_photos.find((photo: any) => photo.is_primary) || conversation.cars.car_photos[0]

        return (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
              isActive ? "bg-blue-50 border-blue-200" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <Image
                  src={otherUser.profile_image_url || `/placeholder.svg?height=48&width=48&query=profile`}
                  alt={otherUser.full_name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{otherUser.full_name}</h3>
                  {lastMessage && <span className="text-xs text-gray-500">{formatDate(lastMessage.created_at)}</span>}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="relative h-6 w-8 flex-shrink-0">
                    <Image
                      src={
                        primaryPhoto?.photo_url ||
                        `/placeholder.svg?height=24&width=32&query=${conversation.cars.make || "/placeholder.svg"} ${conversation.cars.model}`
                      }
                      alt={`${conversation.cars.make} ${conversation.cars.model}`}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <span className="text-xs text-gray-600 truncate">
                    {conversation.cars.year} {conversation.cars.make} {conversation.cars.model}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={`${getStatusColor(conversation.status)} text-xs`} variant="secondary">
                    {conversation.status}
                  </Badge>
                  {unreadCount > 0 && <Badge className="bg-blue-600 text-white text-xs">{unreadCount}</Badge>}
                </div>

                {lastMessage && <p className="text-sm text-gray-600 truncate mt-1">{lastMessage.content}</p>}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
