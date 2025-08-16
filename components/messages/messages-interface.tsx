"use client"
import { ConversationList } from "./conversation-list"
import { ChatWindow } from "./chat-window"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

interface MessagesInterfaceProps {
  conversations: any[]
  selectedBookingId?: string
  selectedBooking?: any
  currentUserId: string
}

export function MessagesInterface({
  conversations,
  selectedBookingId,
  selectedBooking,
  currentUserId,
}: MessagesInterfaceProps) {
  const [activeConversation, setActiveConversation] = useState<any>(selectedBooking || conversations[0] || null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Load messages for active conversation
  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id)
    }
  }, [activeConversation])

  // Set up real-time subscription for messages
  useEffect(() => {
    if (!activeConversation) return

    const channel = supabase
      .channel(`messages:${activeConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `booking_id=eq.${activeConversation.id}`,
        },
        (payload) => {
          console.log("[v0] New message received:", payload.new)
          setMessages((prev) => [...prev, payload.new])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeConversation])

  const loadMessages = async (bookingId: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          profiles(full_name, profile_image_url)
        `)
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error loading messages:", error)
        return
      }

      setMessages(data || [])

      // Mark messages as read
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("booking_id", bookingId)
        .neq("sender_id", currentUserId)
    } catch (error) {
      console.error("Error loading messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (content: string) => {
    if (!activeConversation || !content.trim()) return

    try {
      const { error } = await supabase.from("messages").insert({
        booking_id: activeConversation.id,
        sender_id: currentUserId,
        content: content.trim(),
      })

      if (error) {
        console.error("Error sending message:", error)
        throw error
      }
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  }

  return (
    <div className="flex h-full">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
        </div>
        <ConversationList
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={setActiveConversation}
          currentUserId={currentUserId}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            messages={messages}
            onSendMessage={sendMessage}
            currentUserId={currentUserId}
            loading={loading}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.456L3 21l2.456-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
