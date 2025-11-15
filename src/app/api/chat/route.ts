import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { messages, addictions } = await request.json()

    // Criar contexto sobre os vícios do usuário
    const addictionsContext = addictions.map((addiction: any) => {
      const startDate = new Date(addiction.startDate)
      const now = new Date()
      const daysSober = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      
      return `- ${addiction.name} ${addiction.emoji}: ${daysSober} dias limpo, economia de ${addiction.currency} ${addiction.savings.toFixed(2)}`
    }).join('\n')

    const systemPrompt = `Você é um assistente de apoio compassivo e motivacional para pessoas que estão superando vícios. Seu papel é:

1. Oferecer suporte emocional genuíno e empático
2. Fornecer estratégias práticas para lidar com desejos e gatilhos
3. Celebrar conquistas e progresso, por menor que seja
4. Ajudar a identificar padrões e gatilhos
5. Sugerir técnicas de enfrentamento saudáveis
6. Nunca julgar ou criticar - apenas apoiar e encorajar

CONTEXTO DO USUÁRIO:
${addictionsContext || 'Usuário ainda não cadastrou vícios'}

DIRETRIZES:
- Seja breve e direto (máximo 3-4 frases por resposta)
- Use emojis ocasionalmente para tornar a conversa mais amigável
- Faça perguntas abertas para entender melhor a situação
- Ofereça técnicas específicas quando o usuário estiver em crise
- Celebre cada vitória, por menor que seja
- Seja realista mas sempre otimista
- Use linguagem informal e acolhedora

TÉCNICAS ÚTEIS PARA SUGERIR:
- Respiração profunda (4-7-8)
- Técnica dos 5 sentidos (grounding)
- Caminhada ou exercício leve
- Ligar para alguém de confiança
- Beber água e comer algo saudável
- Escrever sentimentos em um diário
- Lembrar dos motivos para parar
- Visualizar o futuro sem o vício

Responda sempre em português brasileiro.`

    // Chamar a API da OpenAI usando a chave interna da Lasy
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', response.status, errorText)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid API response:', data)
      throw new Error('Invalid response from OpenAI')
    }

    const aiMessage = data.choices[0].message.content

    return NextResponse.json({ message: aiMessage })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Erro ao processar mensagem. Tente novamente.' },
      { status: 500 }
    )
  }
}
