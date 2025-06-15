import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { assessmentId } = await req.json();
    
    if (!assessmentId) {
      throw new Error('Assessment ID is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Récupérer les données de l'évaluation
    const { data: assessment, error: assessmentError } = await supabase
      .from('candidate_assessments')
      .select('*')
      .eq('id', assessmentId)
      .single();

    if (assessmentError) {
      console.error('Assessment error:', assessmentError);
      throw assessmentError;
    }

    // Récupérer les informations du profil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', assessment.user_id)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
    }

    // Récupérer les réponses détaillées avec les questions
    const { data: responses, error: responsesError } = await supabase
      .from('assessment_responses')
      .select(`
        *,
        assessment_questions (
          question_text,
          category,
          question_type,
          options
        )
      `)
      .eq('assessment_id', assessmentId)
      .order('created_at');

    if (responsesError) {
      console.error('Responses error:', responsesError);
      throw responsesError;
    }

    // Combiner les données
    const assessmentWithDetails = {
      ...assessment,
      profiles: profile || { first_name: '', last_name: '' },
      responses: responses || []
    };

    // Générer le contenu HTML du certificat
    const certificateHtml = generateCertificateHTML(assessmentWithDetails);

    return new Response(
      JSON.stringify({ 
        success: true, 
        html: certificateHtml,
        message: 'Certificate generated successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error generating certificate:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function generateCertificateHTML(assessment: any): string {
  const candidateName = `${assessment.profiles?.first_name || ''} ${assessment.profiles?.last_name || ''}`.trim() || 'Candidat';
  const completedDate = new Date(assessment.completed_at).toLocaleDateString('fr-FR');
  
  const personalityScore = assessment.personality_score?.score || 0;
  const skillsScore = assessment.skills_score?.score || 0;
  const qualitiesScore = assessment.qualities_score?.score || 0;

  // Grouper les réponses par catégorie
  const responsesByCategory = {
    personality: assessment.responses?.filter(r => r.assessment_questions?.category === 'personality') || [],
    skills: assessment.responses?.filter(r => r.assessment_questions?.category === 'skills') || [],
    qualities: assessment.responses?.filter(r => r.assessment_questions?.category === 'qualities') || []
  };

  const formatResponse = (response: any) => {
    const question = response.assessment_questions;
    if (!question) return { text: 'Réponse non disponible', display: 'N/A' };

    if (question.question_type === 'scale') {
      const options = question.options as { min: number; max: number; labels: string[] };
      const responseValue = parseInt(response.response_value);
      return {
        text: question.question_text,
        display: `${options.labels[responseValue - 1]} (${responseValue}/${options.max})`,
        score: response.score
      };
    } else if (question.question_type === 'choice') {
      return {
        text: question.question_text,
        display: response.response_value,
        score: response.score
      };
    }
    return { text: question.question_text, display: 'N/A', score: 0 };
  };

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificat d'Évaluation Professionnelle - eemploi.com</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap');
            
            @media print {
                body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .certificate { box-shadow: none; border: none; margin: 0; max-width: 100%; border-radius: 0; }
                .print-button { display: none; }
            }
            
            body {
                font-family: 'Inter', sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f0f9ff;
                min-height: 100vh;
                color: #1e293b;
            }
            
            .certificate {
                max-width: 900px;
                margin: 20px auto;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 153, 204, 0.15);
                position: relative;
                overflow: hidden;
                border: 1px solid #e2e8f0;
            }
            
            .header {
                background: linear-gradient(135deg, #0cc0df 0%, #0099cc 100%);
                color: white;
                padding: 40px 50px;
                text-align: center;
                position: relative;
            }
            
            .header h1 {
                font-family: 'Inter', sans-serif;
                font-weight: 700;
                font-size: 28px;
                margin: 0 0 5px 0;
                letter-spacing: 1px;
            }
            
            .header p {
                font-size: 16px;
                margin: 0;
                opacity: 0.9;
            }
            
            .content {
                padding: 40px 50px;
            }
            
            .title-section {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .title-section h2 {
                font-family: 'Playfair Display', serif;
                font-size: 36px;
                color: #0099cc;
                margin: 0 0 10px 0;
            }
            
            .title-section p {
                color: #475569;
                font-size: 16px;
                margin: 0;
            }
            
            .candidate-section {
                text-align: center;
                margin: 40px 0;
                padding: 30px;
                background-color: #e0f2fe;
                border-radius: 10px;
                border: 2px solid #0cc0df;
                position: relative;
            }
            
            .candidate-section h3 {
                font-family: 'Playfair Display', serif;
                font-size: 28px;
                color: #003d4d;
                margin: 0 0 10px 0;
            }
            
            .candidate-section p {
                color: #005f73;
                margin: 0;
                font-size: 16px;
                font-weight: 500;
            }
            
            .global-score {
                text-align: center;
                margin: 40px 0;
                padding: 30px;
                background: linear-gradient(135deg, #003d4d 0%, #005f73 100%);
                color: white;
                border-radius: 10px;
            }
            
            .global-score h3 {
                font-family: 'Inter', sans-serif;
                font-size: 20px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin: 0 0 10px 0;
                opacity: 0.8;
            }
            
            .global-score .score-value {
                font-size: 48px;
                font-weight: 700;
                margin: 0;
                line-height: 1;
            }
            
            .categories-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 30px;
                margin: 40px 0;
            }
            
            .category-section {
                border-radius: 10px;
                overflow: hidden;
                background: #f8fafc;
                box-shadow: 0 4px 12px rgba(0, 153, 204, 0.08);
                border: 1px solid #e2e8f0;
            }
            
            .category-header {
                padding: 15px 25px;
                font-weight: 600;
                color: white;
                font-size: 18px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .category-header.personality {
                background: linear-gradient(135deg, #0cc0df 0%, #0099cc 100%);
            }
            
            .category-header.skills {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            }
            
            .category-header.qualities {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            }
            
            .category-score {
                font-size: 20px;
                font-weight: 700;
            }
            
            .responses-list {
                padding: 25px;
            }
            
            .response-item {
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid #e2e8f0;
            }

            .response-item:last-child {
                margin-bottom: 0;
                padding-bottom: 0;
                border-bottom: none;
            }
            
            .response-question {
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 6px;
                font-size: 15px;
            }
            
            .response-answer {
                color: #475569;
                margin-bottom: 6px;
                font-size: 14px;
            }
            
            .response-score {
                color: #0099cc;
                font-weight: 600;
                font-size: 14px;
            }
            
            .footer {
                text-align: center;
                margin-top: 40px;
                padding: 30px 20px;
                border-top: 3px solid #0cc0df;
                background-color: #e0f2fe;
            }
            
            .footer p {
                color: #005f73;
                font-size: 14px;
                margin: 5px 0;
                font-weight: 500;
            }
            
            .validation {
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #64748b;
                border-top: 1px solid #e2e8f0;
                padding-top: 20px;
            }
            
            .validation p {
                margin: 4px 0;
            }
            
            .print-button {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #0cc0df 0%, #0099cc 100%);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 600;
                z-index: 1000;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                transition: all 0.2s ease-in-out;
            }
            
            .print-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(0,0,0,0.15);
            }
        </style>
    </head>
    <body>
        <button class="print-button" onclick="window.print()">📄 Imprimer ou Sauvegarder</button>
        
        <div class="certificate">
            <div class="header">
                <h1>🇲🇦 eemploi.com</h1>
                <p>Plateforme de Recrutement Professionnelle du Maroc</p>
            </div>
            
            <div class="content">
                <div class="title-section">
                    <h2>Certificat d'Évaluation</h2>
                    <p>Personnalité • Compétences • Qualités Professionnelles</p>
                </div>
                
                <div class="candidate-section">
                    <h3>${candidateName}</h3>
                    <p>a complété avec succès l'évaluation professionnelle</p>
                </div>
                
                <div class="global-score">
                    <h3>Score Global</h3>
                    <p class="score-value">${assessment.total_score} pts</p>
                </div>
                
                <div class="categories-grid">
                    <div class="category-section">
                        <div class="category-header personality">
                            <span>🧠 Personnalité</span>
                            <span class="category-score">${personalityScore} pts</span>
                        </div>
                        <div class="responses-list">
                            ${responsesByCategory.personality.map(response => {
                              const formatted = formatResponse(response);
                              return `
                                <div class="response-item">
                                    <div class="response-question">${formatted.text}</div>
                                    <div class="response-answer">Réponse: ${formatted.display}</div>
                                    <div class="response-score">Score: ${formatted.score} points</div>
                                </div>
                              `;
                            }).join('')}
                        </div>
                    </div>
                    
                    <div class="category-section">
                        <div class="category-header skills">
                            <span>🎯 Compétences</span>
                            <span class="category-score">${skillsScore} pts</span>
                        </div>
                        <div class="responses-list">
                            ${responsesByCategory.skills.map(response => {
                              const formatted = formatResponse(response);
                              return `
                                <div class="response-item">
                                    <div class="response-question">${formatted.text}</div>
                                    <div class="response-answer">Réponse: ${formatted.display}</div>
                                    <div class="response-score">Score: ${formatted.score} points</div>
                                </div>
                              `;
                            }).join('')}
                        </div>
                    </div>
                    
                    <div class="category-section">
                        <div class="category-header qualities">
                            <span>⭐ Qualités</span>
                            <span class="category-score">${qualitiesScore} pts</span>
                        </div>
                        <div class="responses-list">
                            ${responsesByCategory.qualities.map(response => {
                              const formatted = formatResponse(response);
                              return `
                                <div class="response-item">
                                    <div class="response-question">${formatted.text}</div>
                                    <div class="response-answer">Réponse: ${formatted.display}</div>
                                    <div class="response-score">Score: ${formatted.score} points</div>
                                </div>
                              `;
                            }).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="validation">
                    <p>Certificat ID: ${assessment.id}</p>
                    <p>Date d'émission: ${completedDate}</p>
                    <p>Ce document est généré par eemploi.com et peut être vérifié sur notre plateforme.</p>
                </div>
            </div>

            <div class="footer">
                <p><strong>eemploi.com</strong></p>
                <p>Votre passerelle vers l'emploi au Maroc</p>
            </div>
        </div>
    </body>
    </html>
  `;
}
