"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Bot, User, AlertCircle } from "lucide-react"
import { Addiction, Settings } from "../types"

interface AIChatScreenProps {
  settings: Settings
  addictions: Addiction[]
  onClose: () => void
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIChatScreen({ settings, addictions, onClose }: AIChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Mensagem inicial personalizada
    const totalDays = addictions.reduce((acc, addiction) => {
      const startDate = new Date(addiction.startDate)
      const now = new Date()
      const days = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      return acc + days
    }, 0)

    let greeting = "Olá! Sou seu assistente de apoio. Estou aqui para te ajudar a manter-se firme na sua jornada. Como você está se sentindo hoje? 💙"
    
    if (addictions.length > 0) {
      greeting = `Olá! Vi que você já está há ${totalDays} dias na sua jornada de superação. Isso é incrível! 🌟 Como posso te ajudar hoje?`
    }

    setMessages([{
      id: "1",
      role: "assistant",
      content: greeting,
      timestamp: new Date()
    }])
  }, [addictions])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    // Chat desabilitado temporariamente
    return
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={`min-h-screen flex flex-col ${settings.theme === "dark" ? "bg-gray-950" : "bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"}`}>
      <div className="max-w-4xl mx-auto w-full flex flex-col h-screen">
        {/* Header */}
        <div className={`p-4 border-b ${settings.theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white/80 backdrop-blur-sm border-gray-200"}`}>
          <div className="flex items-center gap-4">
            <Button onClick={onClose} variant="ghost" size="icon" className={settings.theme === "dark" ? "hover:bg-gray-800" : ""}>
              <ArrowLeft className={settings.theme === "dark" ? "text-white" : "text-gray-800"} />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  Novo começo
                </h1>
                <p className={`text-sm ${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Powered by OpenAI GPT-4
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 m-4 rounded">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === "user" 
                  ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                  : "bg-gradient-to-r from-blue-500 to-purple-500"
              }`}>
                {message.role === "user" ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              <Card className={`p-4 max-w-[80%] ${
                message.role === "user"
                  ? settings.theme === "dark" 
                    ? "bg-green-900/50 border-green-800" 
                    : "bg-green-50 border-green-200"
                  : settings.theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white"
              }`}>
                <p className={`text-sm whitespace-pre-wrap ${
                  settings.theme === "dark" ? "text-gray-100" : "text-gray-800"
                }`}>
                  {message.content}
                </p>
                <p className={`text-xs mt-2 ${
                  settings.theme === "dark" ? "text-gray-500" : "text-gray-500"
                }`}>
                  {message.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </Card>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <Card className={`p-4 ${settings.theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                <div className="flex gap-1">
                  <div className={`w-2 h-2 rounded-full animate-bounce ${settings.theme === "dark" ? "bg-gray-400" : "bg-gray-600"}`} style={{ animationDelay: "0ms" }}></div>
                  <div className={`w-2 h-2 rounded-full animate-bounce ${settings.theme === "dark" ? "bg-gray-400" : "bg-gray-600"}`} style={{ animationDelay: "150ms" }}></div>
                  <div className={`w-2 h-2 rounded-full animate-bounce ${settings.theme === "dark" ? "bg-gray-400" : "bg-gray-600"}`} style={{ animationDelay: "300ms" }}></div>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input - Desabilitado */}
        <div className={`p-4 border-t ${settings.theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white/80 backdrop-blur-sm border-gray-200"}`}>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Chat temporariamente desabilitado..."
              disabled
              className={`flex-1 ${settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" : ""}`}
            />
            <Button 
              onClick={handleSend} 
              disabled
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:opacity-90"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className={`text-xs mt-2 text-center ${settings.theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
            Chat temporariamente desabilitado
          </p>
        </div>
      </div>
    </div>
  )
}
