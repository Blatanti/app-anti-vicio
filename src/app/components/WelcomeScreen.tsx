"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Heart } from "lucide-react"

interface WelcomeScreenProps {
  onStart: () => void
  accentColor: string
}

export function WelcomeScreen({ onStart, accentColor }: WelcomeScreenProps) {
  const getGradientClass = (color: string) => {
    const gradients: Record<string, string> = {
      blue: "from-blue-500 via-cyan-500 to-blue-600",
      purple: "from-purple-500 via-pink-500 to-purple-600",
      pink: "from-pink-500 via-rose-500 to-pink-600",
      green: "from-green-500 via-emerald-500 to-green-600",
      orange: "from-orange-500 via-amber-500 to-orange-600",
      red: "from-red-500 via-rose-500 to-red-600"
    }
    return gradients[color] || gradients.blue
  }

  const getButtonColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "text-blue-600",
      purple: "text-purple-600",
      pink: "text-pink-600",
      green: "text-green-600",
      orange: "text-orange-600",
      red: "text-red-600"
    }
    return colors[color] || colors.blue
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br ${getGradientClass(accentColor)}`}>
      <div className="text-center space-y-8 max-w-md">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <Heart className={`w-12 h-12 ${getButtonColor(accentColor)}`} fill="currentColor" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-yellow-300" fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            Novo começo
          </h1>
          <p className="text-xl text-white/90 font-medium">
            Sua jornada de transformação começa aqui
          </p>
        </div>

        {/* Description */}
        <p className="text-white/80 text-lg leading-relaxed">
          Supere vícios e maus hábitos com apoio, motivação e acompanhamento personalizado
        </p>

        {/* Start Button */}
        <Button 
          onClick={onStart}
          size="lg"
          className={`w-full bg-white ${getButtonColor(accentColor)} hover:bg-gray-100 font-bold text-lg py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
        >
          Começar Agora
        </Button>

        {/* Footer */}
        <p className="text-white/60 text-sm">
          Você não está sozinho nessa jornada 💪
        </p>
      </div>
    </div>
  )
}
