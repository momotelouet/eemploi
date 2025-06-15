
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import 'https://deno.land/x/xhr@0.1.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json()

    const openrouterApiKey = Deno.env.get('OPENROUTER_API_KEY')
    if (!openrouterApiKey) {
      throw new Error('OPENROUTER_API_KEY is not set')
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${openrouterApiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "mistralai/mistral-7b-instruct:free", // A good free model on OpenRouter
            messages: [
              { role: 'system', content: "You are a helpful customer support agent for eemploi, a job board website. Be friendly and concise. Respond in French." },
              ...messages
            ],
        })
    });

    const chatCompletion = await response.json();
    const assistantResponse = chatCompletion.choices[0].message.content;

    return new Response(JSON.stringify({ response: assistantResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
