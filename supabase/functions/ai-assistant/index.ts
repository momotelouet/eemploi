
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, context, type } = await req.json();

    let systemPrompt = '';
    
    switch (type) {
      case 'cv-optimization':
        systemPrompt = 'Tu es un expert en ressources humaines qui aide à optimiser les CV. Donne des conseils précis et pratiques en français.';
        break;
      case 'job-description':
        systemPrompt = 'Tu es un expert en recrutement qui aide à créer des descriptions de poste attractives et complètes en français.';
        break;
      case 'interview-prep':
        systemPrompt = 'Tu es un coach en entretien d\'embauche qui aide à préparer les candidats avec des questions et conseils pratiques en français.';
        break;
      case 'candidate-analysis':
        systemPrompt = 'Tu es un expert RH qui analyse les profils candidats et donne des insights pour les recruteurs en français.';
        break;
      case 'job-matching':
        systemPrompt = 'Tu es un expert en matching emploi qui analyse la compatibilité entre candidats et postes en français.';
        break;
      default:
        systemPrompt = 'Tu es un assistant IA spécialisé en ressources humaines qui aide candidats et recruteurs en français.';
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://eemploi.lovable.app',
        'X-Title': 'eemploi AI Assistant',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `${context ? `Contexte: ${context}\n\n` : ''}${prompt}` }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
