"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Share2, MessageSquare, Shield, Crown } from "lucide-react"
import { Settings } from "../types"
import { useState } from "react"

interface SettingsScreenProps {
  settings: Settings
  onUpdateSettings: (settings: Settings) => void
  onClose: () => void
  onOpenPremium: () => void
}

export function SettingsScreen({ settings, onUpdateSettings, onClose, onOpenPremium }: SettingsScreenProps) {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)

  const handleSettingChange = (key: keyof Settings, value: any) => {
    onUpdateSettings({ ...settings, [key]: value })
  }

  const handleShare = () => {
    // Tentar usar a API nativa de compartilhamento
    if (navigator.share) {
      navigator.share({
        title: 'Anti Vício',
        text: 'Conheça o Anti Vício - Um app para transformar sua vida! 🚀',
        url: window.location.href
      }).catch((error) => {
        // Se o usuário cancelar ou der erro, mostra o diálogo customizado
        if (error.name !== 'AbortError') {
          setShowShareDialog(true)
        }
      })
    } else {
      // Se o navegador não suporta, mostra o diálogo customizado
      setShowShareDialog(true)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copiado para a área de transferência! 📋')
    setShowShareDialog(false)
  }

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent('Conheça o Anti Vício - Um app para transformar sua vida! 🚀 ' + window.location.href)
    window.open(`https://wa.me/?text=${text}`, '_blank')
    setShowShareDialog(false)
  }

  const handleShareTelegram = () => {
    const text = encodeURIComponent('Conheça o Anti Vício - Um app para transformar sua vida! 🚀')
    const url = encodeURIComponent(window.location.href)
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank')
    setShowShareDialog(false)
  }

  const handleShareEmail = () => {
    const subject = encodeURIComponent('Conheça o Anti Vício')
    const body = encodeURIComponent('Olá! Descobri este aplicativo incrível para superar vícios e transformar a vida. Confira: ' + window.location.href)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
    setShowShareDialog(false)
  }

  const handleFeedback = () => {
    window.location.href = 'mailto:seunovocomecoav@gmail.com?subject=Novo+come%C3%A7o'
  }

  if (showShareDialog) {
    return (
      <div className={`min-h-screen p-4 sm:p-6 ${settings.theme === "dark" ? "bg-gray-950" : "bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"}`}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button onClick={() => setShowShareDialog(false)} variant="ghost" size="icon" className={settings.theme === "dark" ? "hover:bg-gray-800" : ""}>
              <ArrowLeft className={settings.theme === "dark" ? "text-white" : "text-gray-800"} />
            </Button>
            <h1 className={`text-3xl font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
              Compartilhar App
            </h1>
          </div>

          <Card className={`p-6 ${settings.theme === "dark" ? "bg-gray-900 border-gray-800" : ""}`}>
            <h2 className={`text-xl font-semibold mb-4 ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
              Escolha como compartilhar:
            </h2>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className={`w-full justify-start ${settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : ""}`}
                onClick={handleCopyLink}
              >
                <Share2 className="mr-2 h-4 w-4" />
                📋 Copiar Link
              </Button>
              <Button 
                variant="outline" 
                className={`w-full justify-start bg-green-600 hover:bg-green-700 text-white border-0`}
                onClick={handleShareWhatsApp}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                💬 Compartilhar no WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className={`w-full justify-start bg-blue-500 hover:bg-blue-600 text-white border-0`}
                onClick={handleShareTelegram}
              >
                <Share2 className="mr-2 h-4 w-4" />
                ✈️ Compartilhar no Telegram
              </Button>
              <Button 
                variant="outline" 
                className={`w-full justify-start ${settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : ""}`}
                onClick={handleShareEmail}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                📧 Compartilhar por Email
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (showPrivacyPolicy) {
    return (
      <div className={`min-h-screen p-4 sm:p-6 ${settings.theme === "dark" ? "bg-gray-950" : "bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"}`}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button onClick={() => setShowPrivacyPolicy(false)} variant="ghost" size="icon" className={settings.theme === "dark" ? "hover:bg-gray-800" : ""}>
              <ArrowLeft className={settings.theme === "dark" ? "text-white" : "text-gray-800"} />
            </Button>
            <h1 className={`text-3xl font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
              Política de Privacidade
            </h1>
          </div>

          <Card className={`p-6 ${settings.theme === "dark" ? "bg-gray-900 border-gray-800" : ""}`}>
            <div className={`space-y-4 ${settings.theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              <section>
                <h2 className={`text-xl font-semibold mb-2 ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}>
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
                <h2 className={`text-xl font-semibold mb-2 ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}>
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
                <h2 className={`text-xl font-semibold mb-2 ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  3. Armazenamento de Dados
                </h2>
                <p>
                  Todos os seus dados são armazenados localmente no seu dispositivo. Não compartilhamos, 
                  vendemos ou transferimos suas informações pessoais para terceiros. Seus dados permanecem 
                  privados e sob seu controle total.
                </p>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-2 ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  4. Segurança
                </h2>
                <p>
                  Implementamos medidas de segurança para proteger suas informações contra acesso não 
                  autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de 
                  armazenamento eletrônico é 100% seguro.
                </p>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-2 ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}>
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
                <h2 className={`text-xl font-semibold mb-2 ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  6. Alterações nesta Política
                </h2>
                <p>
                  Podemos atualizar esta política periodicamente. Notificaremos você sobre mudanças 
                  significativas através do aplicativo. O uso continuado do Anti Vício após alterações 
                  constitui aceitação da nova política.
                </p>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-2 ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  7. Contato
                </h2>
                <p>
                  Para dúvidas sobre esta política de privacidade, entre em contato através do email: 
                  <a href="mailto:seunovocomecoav@gmail.com" className="text-blue-500 hover:underline ml-1">
                    seunovocomecoav@gmail.com
                  </a>
                </p>
              </section>

              <div className={`mt-6 p-4 rounded-lg ${settings.theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
                <p className="text-sm">
                  <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${settings.theme === "dark" ? "bg-gray-950" : "bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onClose} variant="ghost" size="icon" className={settings.theme === "dark" ? "hover:bg-gray-800" : ""}>
            <ArrowLeft className={settings.theme === "dark" ? "text-white" : "text-gray-800"} />
          </Button>
          <h1 className={`text-3xl font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
            Configurações
          </h1>
        </div>

        <div className="space-y-6">
          {/* Configurações Gerais */}
          <Card className={`p-6 ${settings.theme === "dark" ? "bg-gray-900 border-gray-800" : ""}`}>
            <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${settings.theme === "dark" ? "text-white" : ""}`}>
              ⚙️ Configurações Gerais
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currency" className={`text-base mb-2 block ${settings.theme === "dark" ? "text-gray-300" : ""}`}>
                  Moeda
                </Label>
                <Select value={settings.currency} onValueChange={(value) => handleSettingChange("currency", value)}>
                  <SelectTrigger id="currency" className={settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={settings.theme === "dark" ? "bg-gray-800 border-gray-700" : ""}>
                    <SelectItem value="BRL" className={settings.theme === "dark" ? "text-white" : ""}>Real (R$)</SelectItem>
                    <SelectItem value="USD" className={settings.theme === "dark" ? "text-white" : ""}>Dólar ($)</SelectItem>
                    <SelectItem value="EUR" className={settings.theme === "dark" ? "text-white" : ""}>Euro (€)</SelectItem>
                    <SelectItem value="GBP" className={settings.theme === "dark" ? "text-white" : ""}>Libra (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language" className={`text-base mb-2 block ${settings.theme === "dark" ? "text-gray-300" : ""}`}>
                  Idioma
                </Label>
                <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                  <SelectTrigger id="language" className={settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={settings.theme === "dark" ? "bg-gray-800 border-gray-700" : ""}>
                    <SelectItem value="pt-BR" className={settings.theme === "dark" ? "text-white" : ""}>Português (BR)</SelectItem>
                    <SelectItem value="en-US" className={settings.theme === "dark" ? "text-white" : ""}>English (US)</SelectItem>
                    <SelectItem value="es-ES" className={settings.theme === "dark" ? "text-white" : ""}>Español</SelectItem>
                    <SelectItem value="fr-FR" className={settings.theme === "dark" ? "text-white" : ""}>Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="theme" className={`text-base mb-2 block ${settings.theme === "dark" ? "text-gray-300" : ""}`}>
                  Tema
                </Label>
                <Select value={settings.theme} onValueChange={(value: "light" | "dark") => handleSettingChange("theme", value)}>
                  <SelectTrigger id="theme" className={settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={settings.theme === "dark" ? "bg-gray-800 border-gray-700" : ""}>
                    <SelectItem value="light" className={settings.theme === "dark" ? "text-white" : ""}>☀️ Claro</SelectItem>
                    <SelectItem value="dark" className={settings.theme === "dark" ? "text-white" : ""}>🌙 Escuro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="accentColor" className={`text-base mb-2 block ${settings.theme === "dark" ? "text-gray-300" : ""}`}>
                  Cor de Destaque
                </Label>
                <Select value={settings.accentColor} onValueChange={(value) => handleSettingChange("accentColor", value)}>
                  <SelectTrigger id="accentColor" className={settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={settings.theme === "dark" ? "bg-gray-800 border-gray-700" : ""}>
                    <SelectItem value="blue" className={settings.theme === "dark" ? "text-white" : ""}>🔵 Azul</SelectItem>
                    <SelectItem value="purple" className={settings.theme === "dark" ? "text-white" : ""}>🟣 Roxo</SelectItem>
                    <SelectItem value="pink" className={settings.theme === "dark" ? "text-white" : ""}>🩷 Rosa</SelectItem>
                    <SelectItem value="green" className={settings.theme === "dark" ? "text-white" : ""}>🟢 Verde</SelectItem>
                    <SelectItem value="orange" className={settings.theme === "dark" ? "text-white" : ""}>🟠 Laranja</SelectItem>
                    <SelectItem value="red" className={settings.theme === "dark" ? "text-white" : ""}>🔴 Vermelho</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="progressFormat" className={`text-base mb-2 block ${settings.theme === "dark" ? "text-gray-300" : ""}`}>
                  Formato de Progresso
                </Label>
                <Select value={settings.progressFormat} onValueChange={(value: "circle" | "line") => handleSettingChange("progressFormat", value)}>
                  <SelectTrigger id="progressFormat" className={settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={settings.theme === "dark" ? "bg-gray-800 border-gray-700" : ""}>
                    <SelectItem value="circle" className={settings.theme === "dark" ? "text-white" : ""}>⭕ Círculo</SelectItem>
                    <SelectItem value="line" className={settings.theme === "dark" ? "text-white" : ""}>📊 Barra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Notificações */}
          <Card className={`p-6 ${settings.theme === "dark" ? "bg-gray-900 border-gray-800" : ""}`}>
            <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${settings.theme === "dark" ? "text-white" : ""}`}>
              🔔 Notificações
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="progressNotifications" className={`text-base ${settings.theme === "dark" ? "text-gray-300" : ""}`}>
                    Notificações de Progresso
                  </Label>
                  <p className={`text-sm ${settings.theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                    Receba lembretes sobre seu progresso
                  </p>
                </div>
                <Switch
                  id="progressNotifications"
                  checked={settings.progressNotifications}
                  onCheckedChange={(checked) => handleSettingChange("progressNotifications", checked)}
                />
              </div>

              <Separator className={settings.theme === "dark" ? "bg-gray-800" : ""} />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dailyQuoteNotifications" className={`text-base ${settings.theme === "dark" ? "text-gray-300" : ""}`}>
                    Frase do Dia
                  </Label>
                  <p className={`text-sm ${settings.theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                    Receba mensagens motivacionais diárias
                  </p>
                </div>
                <Switch
                  id="dailyQuoteNotifications"
                  checked={settings.dailyQuoteNotifications}
                  onCheckedChange={(checked) => handleSettingChange("dailyQuoteNotifications", checked)}
                />
              </div>
            </div>
          </Card>

          {/* Outros */}
          <Card className={`p-6 ${settings.theme === "dark" ? "bg-gray-900 border-gray-800" : ""}`}>
            <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${settings.theme === "dark" ? "text-white" : ""}`}>
              📋 Outros
            </h2>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className={`w-full justify-start bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 hover:from-yellow-500 hover:via-orange-500 hover:to-pink-600 text-white border-0 font-semibold`}
                onClick={onOpenPremium}
              >
                <Crown className="mr-2 h-4 w-4" />
                ⭐ Assinar Premium
              </Button>
              <Button 
                variant="outline" 
                className={`w-full justify-start ${settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : ""}`}
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar o App
              </Button>
              <Button 
                variant="outline" 
                className={`w-full justify-start ${settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : ""}`}
                onClick={handleFeedback}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Enviar Feedback
              </Button>
              <Button 
                variant="outline" 
                className={`w-full justify-start ${settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : ""}`}
                onClick={() => setShowPrivacyPolicy(true)}
              >
                <Shield className="mr-2 h-4 w-4" />
                Política de Privacidade
              </Button>
              <Separator className={settings.theme === "dark" ? "bg-gray-800" : ""} />
              <div className={`text-center text-sm pt-2 ${settings.theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
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
