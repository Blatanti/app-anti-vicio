'use client'

import { X, AlertTriangle } from 'lucide-react'

interface Addiction {
  id: string
  name: string
  emoji: string
  color: string
}

interface UrgencyPanelProps {
  addiction: Addiction
  onClose: () => void
}

const URGENCY_CONTENT: Record<string, { title: string; content: string }> = {
  'pornografia': {
    title: 'Protegendo Seu Caminho Digital',
    content: `Você está prestes a entrar em um ambiente online vasto e, às vezes, arriscado. Para ajudar a manter sua jornada digital segura e saudável, este aplicativo monitorará sua atividade na internet. Você receberá relatórios regulares sobre seus hábitos de navegação, permitindo que você reflita sobre suas escolhas e tome decisões mais conscientes. Sua privacidade e segurança são nossa prioridade. Ao continuar, você concorda em utilizar essa ferramenta para fomentar um uso mais responsável e equilibrado da internet.

Vamos começar sua jornada para um uso digital mais saudável!`
  },
  'comida': {
    title: 'Olá! Pronto para cuidar da sua saúde hoje?',
    content: `1. Registro de Refeições: O que você comeu hoje? Adicione suas refeições para acompanhar calorias e nutrientes.

2. Atividade Física: Que atividades você fez? Basta digitar ou selecionar da lista para monitorar seu progresso.

3. Hidratação: Quantos copos de água você bebeu hoje? Manter-se hidratado é fundamental!

4. Metas de Saúde: O que você quer alcançar? Controle seu progresso e ajuste suas metas quando necessário.

Vamos juntos transformar seus hábitos!`
  },
  'alcool': {
    title: 'Bem-vindo ao Caminho da Sobriedade!',
    content: `Como você se sente hoje?

Reflexão Diária: Compartilhe suas emoções e pensamentos. O que foi desafiador hoje? O que te fez sentir grato?

Habilidades e Estratégias: Quais técnicas você usou para enfrentar os desafios hoje? Compartilhe suas estratégias de coping.

Metas Pessoais: Quais são suas metas para os próximos dias? Escreva seus objetivos e lembre-se de que você não está sozinho nessa jornada.

Lembre-se: Cada dia é uma nova oportunidade!`
  }
}

export default function UrgencyPanel({ addiction, onClose }: UrgencyPanelProps) {
  const getContent = () => {
    const name = addiction.name.toLowerCase()
    
    if (name.includes('pornografia') || name.includes('pornô')) {
      return URGENCY_CONTENT['pornografia']
    }
    if (name.includes('comida') || name.includes('alimentação') || name.includes('comer')) {
      return URGENCY_CONTENT['comida']
    }
    if (name.includes('álcool') || name.includes('alcool') || name.includes('bebida')) {
      return URGENCY_CONTENT['alcool']
    }
    
    // Conteúdo padrão para outros vícios
    return {
      title: 'Momento de Urgência',
      content: `Você está passando por um momento difícil, mas você é forte!

Respire fundo e lembre-se:
• Você já chegou até aqui
• Cada momento de resistência é uma vitória
• Você não está sozinho nessa jornada
• Amanhã você vai agradecer por ter resistido hoje

O que você pode fazer agora:
1. Respire profundamente por 5 minutos
2. Beba um copo de água
3. Faça uma caminhada rápida
4. Ligue para alguém de confiança
5. Escreva seus sentimentos

Você consegue! 💪`
    }
  }

  const content = getContent()

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-red-500 to-orange-500 shadow-2xl z-40 animate-slide-down">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-white/20 p-3 rounded-2xl">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{addiction.emoji}</span>
                <h2 className="text-2xl font-bold text-white">
                  {content.title}
                </h2>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <p className="text-white whitespace-pre-line leading-relaxed">
                  {content.content}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors flex-shrink-0"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
