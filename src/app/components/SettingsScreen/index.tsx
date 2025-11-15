"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Crown, Share2, MessageSquare, Shield, X } from "lucide-react"
import { PremiumScreen } from "./PremiumScreen"

interface SettingsScreenProps {
  onClose: () => void
  user: any
}

export default function SettingsScreen({ onClose, user }: SettingsScreenProps) {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)
  const [showPremium, setShowPremium] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Anti Vício',
        text: 'Conheça o Anti Vício - Um app para transformar sua vida!',
        url: window.location.href
      }).catch(() => {})
    }
  }

  const handleFeedback = () => {
    window.location.href = 'mailto:seunovocomecoav@gmail.com?subject=Novo+come%C3%A7o'
  }

  // Se mostrar Premium
  if (showPremium) {
    return (
      <PremiumScreen
        settings={{ theme: darkMode ? "dark" : "light" } as any}
        onClose={() => setShowPremium(false)}
      />
    )
  }

  // Se mostrar Política de Privacidade
  if (showPrivacyPolicy) {
    return (
      <div className={`fixed inset-0 z-50 ${darkMode ? "bg-gray-950" : "bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"}`}>
        <div className="min-h-screen p-4 sm:p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button onClick={() => setShowPrivacyPolicy(false)} variant="ghost" size="icon" className={darkMode ? "hover:bg-gray-800" : ""}>
                <ArrowLeft className={darkMode ? "text-white" : "text-gray-800"} />
              </Button>
              <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                Política de Privacidade
              </h1>
            </div>

            <Card className={`p-6 ${darkMode ? "bg-gray-900 border-gray-800" : ""}`}>
              <div className={`space-y-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                <section>
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    1. Informações que Coletamos
                  </h2>
                  <p className="mb-2">
                    O Anti Vício coleta apenas as informações necessárias para o funcionamento do aplicativo:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Dados de vícios cadastrados (nome, emoji, data de início)</li>
                    <li>Histórico de recaídas e progresso</li>
                    <li>Preferências de configuração do aplicativo</li>
                    <li>Dados de economia financeira relacionados aos vícios</li>
                  </ul>
                </section>

                <section>
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    2. Como Usamos Suas Informações
                  </h2>
                  <p className="mb-2">
                    Utilizamos suas informações exclusivamente para:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Calcular e exibir seu progresso na superação de vícios</li>
                    <li>Gerar estatísticas e relatórios personalizados</li>
                    <li>Enviar notificações motivacionais (se habilitadas)</li>
                    <li>Melhorar a experiência do usuário no aplicativo</li>
                  </ul>
                </section>

                <section>
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    3. Armazenamento de Dados
                  </h2>
                  <p>
                    Todos os seus dados são armazenados de forma segura. Não compartilhamos, 
                    vendemos ou transferimos suas informações pessoais para terceiros. Seus dados permanecem 
                    privados e sob seu controle total.
                  </p>
                </section>

                <section>
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    4. Segurança
                  </h2>
                  <p>
                    Implementamos medidas de segurança para proteger suas informações contra acesso não 
                    autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de 
                    armazenamento eletrônico é 100% seguro.
                  </p>
                </section>

                <section>
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    5. Seus Direitos
                  </h2>
                  <p className="mb-2">
                    Você tem o direito de:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Acessar todos os seus dados a qualquer momento</li>
                    <li>Excluir seus dados permanentemente</li>
                    <li>Exportar seus dados para backup</li>
                    <li>Desativar notificações e funcionalidades opcionais</li>
                  </ul>
                </section>

                <section>
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    6. Alterações nesta Política
                  </h2>
                  <p>
                    Podemos atualizar esta política periodicamente. Notificaremos você sobre mudanças 
                    significativas através do aplicativo. O uso continuado do Anti Vício após alterações 
                    constitui aceitação da nova política.
                  </p>
                </section>

                <section>
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    7. Contato
                  </h2>
                  <p>
                    Para dúvidas sobre esta política de privacidade, entre em contato através do email: 
                    <a href="mailto:seunovocomecoav@gmail.com" className="text-blue-500 hover:underline ml-1">
                      seunovocomecoav@gmail.com
                    </a>
                  </p>
                </section>

                <div className={`mt-6 p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                  <p className="text-sm">
                    <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Tela principal de configurações
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl ${darkMode ? "bg-gray-900" : "bg-white"} shadow-2xl`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 ${darkMode ? "bg-gray-900" : "bg-white"} border-b ${darkMode ? "border-gray-800" : "border-gray-200"} p-6`}>
          <div className="flex items-center justify-between">
            <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
              Configurações
            </h1>
            <Button onClick={onClose} variant="ghost" size="icon" className={darkMode ? "hover:bg-gray-800" : ""}>
              <X className={darkMode ? "text-white" : "text-gray-800"} />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Premium */}
          <Card className={`p-6 ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
            <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : ""}`}>
              👑 Premium
            </h2>
            <Button 
              onClick={() => setShowPremium(true)}
              className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 hover:from-yellow-500 hover:via-orange-500 hover:to-pink-600 text-white font-bold"
            >
              <Crown className="mr-2 h-5 w-5" />
              Ver Planos Premium
            </Button>
          </Card>

          {/* Outros */}
          <Card className={`p-6 ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
            <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : ""}`}>
              📋 Outros
            </h2>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className={`w-full justify-start ${darkMode ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600" : ""}`}
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar o App
              </Button>
              <Button 
                variant="outline" 
                className={`w-full justify-start ${darkMode ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600" : ""}`}
                onClick={handleFeedback}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Enviar Feedback
              </Button>
              <Button 
                variant="outline" 
                className={`w-full justify-start ${darkMode ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600" : ""}`}
                onClick={() => setShowPrivacyPolicy(true)}
              >
                <Shield className="mr-2 h-4 w-4" />
                Política de Privacidade
              </Button>
              <div className={`text-center text-sm pt-4 border-t ${darkMode ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}>
                <p>Anti Vício v1.0.0</p>
                <p className="mt-1">Feito com ❤️ para sua jornada</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
