"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Crown, Zap, LayoutGrid, Star } from "lucide-react"
import { Settings } from "../types"

interface PremiumScreenProps {
  settings: Settings
  onClose: () => void
}

export function PremiumScreen({ settings, onClose }: PremiumScreenProps) {
  const testimonials = [
    {
      name: "Maria Silva",
      text: "Este app mudou minha vida! Consegui superar meu vício em cigarro depois de 15 anos. A interface é linda e as notificações me mantêm motivada todos os dias.",
      rating: 5,
      days: 127
    },
    {
      name: "João Pedro",
      text: "Incrível! O sistema de acompanhamento me ajudou a entender meus gatilhos. Já estou há 3 meses sem beber e me sinto renovado. Recomendo demais!",
      rating: 5,
      days: 94
    },
    {
      name: "Ana Costa",
      text: "Melhor decisão que tomei foi baixar este aplicativo. A versão premium vale cada centavo - os widgets me lembram constantemente dos meus objetivos.",
      rating: 5,
      days: 203
    },
    {
      name: "Carlos Mendes",
      text: "Simples, eficaz e motivador. Consegui parar com o vício em jogos de azar e já economizei mais de R$ 5.000. Gratidão eterna aos desenvolvedores!",
      rating: 5,
      days: 156
    },
    {
      name: "Beatriz Oliveira",
      text: "O suporte emocional através das mensagens motivacionais faz toda diferença. Estou livre do vício em compras compulsivas há 2 meses!",
      rating: 5,
      days: 68
    }
  ]

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${settings.theme === "dark" ? "bg-gray-950" : "bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onClose} variant="ghost" size="icon" className={settings.theme === "dark" ? "hover:bg-gray-800" : ""}>
            <ArrowLeft className={settings.theme === "dark" ? "text-white" : "text-gray-800"} />
          </Button>
          <h1 className={`text-3xl font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
            Premium
          </h1>
        </div>

        {/* Hero Section */}
        <Card className={`p-8 mb-6 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 border-0 text-white`}>
          <div className="text-center">
            <Crown className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Desbloqueie Todo o Potencial</h2>
            <p className="text-lg opacity-90">
              Transforme sua jornada com recursos exclusivos
            </p>
          </div>
        </Card>

        {/* Benefícios */}
        <div className="space-y-4 mb-8">
          <h3 className={`text-2xl font-bold mb-4 ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
            O que você ganha com Premium:
          </h3>

          <Card className={`p-6 ${settings.theme === "dark" ? "bg-gray-900 border-gray-800" : ""}`}>
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-red-400 to-pink-500 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className={`text-lg font-semibold mb-2 ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Sem Anúncios
                </h4>
                <p className={`${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Experiência completamente livre de interrupções. Foque 100% na sua jornada de superação sem distrações.
                </p>
              </div>
            </div>
          </Card>

          <Card className={`p-6 ${settings.theme === "dark" ? "bg-gray-900 border-gray-800" : ""}`}>
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-3 rounded-lg">
                <LayoutGrid className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className={`text-lg font-semibold mb-2 ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Vícios Ilimitados
                </h4>
                <p className={`${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Acompanhe mais de 2 vícios simultaneamente na página principal. Sem limites para sua transformação!
                </p>
              </div>
            </div>
          </Card>

          <Card className={`p-6 ${settings.theme === "dark" ? "bg-gray-900 border-gray-800" : ""}`}>
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className={`text-lg font-semibold mb-2 ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Widgets Exclusivos
                </h4>
                <p className={`${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Adicione widgets personalizados na tela inicial do seu celular. Acompanhe seu progresso sem nem abrir o app!
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Depoimentos */}
        <div className="mb-8">
          <h3 className={`text-2xl font-bold mb-4 ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
            O que nossos usuários dizem:
          </h3>
          
          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className={`p-6 ${settings.theme === "dark" ? "bg-gray-900 border-gray-800" : ""}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                    settings.theme === "dark" ? "bg-gray-800 text-white" : "bg-gradient-to-br from-purple-400 to-pink-400 text-white"
                  }`}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {testimonial.name}
                      </h4>
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className={`mb-2 ${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {testimonial.text}
                    </p>
                    <p className={`text-sm ${settings.theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                      🎉 {testimonial.days} dias livre do vício
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Card className={`p-6 ${settings.theme === "dark" ? "bg-gray-900 border-gray-800" : ""}`}>
          <div className="text-center">
            <p className={`text-lg mb-4 ${settings.theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Pronto para levar sua jornada ao próximo nível?
            </p>
            <Button 
              size="lg"
              className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 hover:from-yellow-500 hover:via-orange-500 hover:to-pink-600 text-white font-bold text-lg py-6"
            >
              <Crown className="mr-2 h-5 w-5" />
              Assinar Premium
            </Button>
            <p className={`text-sm mt-4 ${settings.theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
              Cancele quando quiser • Suporte prioritário • Atualizações exclusivas
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
