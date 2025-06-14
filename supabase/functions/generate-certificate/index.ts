
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
        <title>Certificat d'Évaluation Professionnelle</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
            
            @media print {
                body { margin: 0; }
                .certificate { box-shadow: none; }
                .print-button { display: none; }
            }
            
            body {
                font-family: 'Inter', sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
                min-height: 100vh;
                color: #333;
            }
            
            .certificate {
                max-width: 900px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                box-shadow: 0 25px 50px rgba(0,0,0,0.15);
                position: relative;
                overflow: hidden;
            }
            
            .moroccan-border {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: 
                    radial-gradient(circle at 20px 20px, #dc2626 2px, transparent 2px),
                    radial-gradient(circle at 60px 20px, #1e3a8a 2px, transparent 2px),
                    radial-gradient(circle at 20px 60px, #1e3a8a 2px, transparent 2px),
                    radial-gradient(circle at 60px 60px, #dc2626 2px, transparent 2px);
                background-size: 80px 80px;
                opacity: 0.1;
                pointer-events: none;
            }
            
            .header {
                background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
                color: white;
                padding: 40px 60px;
                text-align: center;
                position: relative;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="star" patternUnits="userSpaceOnUse" width="20" height="20"><polygon points="10,1 6,19 20,8 0,8 14,19" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23star)"/></svg>');
                opacity: 0.3;
            }
            
            .header h1 {
                font-family: 'Playfair Display', serif;
                font-size: 36px;
                margin: 0 0 10px 0;
                font-weight: 700;
                position: relative;
                z-index: 1;
            }
            
            .header p {
                font-size: 16px;
                margin: 0;
                opacity: 0.9;
                position: relative;
                z-index: 1;
            }
            
            .content {
                padding: 60px;
                position: relative;
                z-index: 1;
            }
            
            .title-section {
                text-align: center;
                margin-bottom: 50px;
            }
            
            .title-section h2 {
                font-family: 'Playfair Display', serif;
                font-size: 32px;
                color: #1e3a8a;
                margin: 0 0 15px 0;
                text-transform: uppercase;
                letter-spacing: 3px;
            }
            
            .title-section p {
                color: #666;
                font-size: 18px;
                margin: 0;
            }
            
            .candidate-section {
                text-align: center;
                margin: 50px 0;
                padding: 40px;
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border-radius: 15px;
                border: 3px solid #dc2626;
                position: relative;
            }
            
            .candidate-section::before {
                content: '✦';
                position: absolute;
                top: -15px;
                left: 50%;
                transform: translateX(-50%);
                background: white;
                color: #dc2626;
                font-size: 30px;
                padding: 0 20px;
            }
            
            .candidate-section h3 {
                font-family: 'Playfair Display', serif;
                font-size: 28px;
                color: #1e3a8a;
                margin: 0 0 15px 0;
            }
            
            .candidate-section p {
                color: #666;
                margin: 0;
                font-size: 18px;
                font-weight: 500;
            }
            
            .global-score {
                text-align: center;
                margin: 40px 0;
                padding: 30px;
                background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
                color: white;
                border-radius: 15px;
                position: relative;
            }
            
            .global-score h3 {
                font-family: 'Playfair Display', serif;
                font-size: 24px;
                margin: 0 0 10px 0;
            }
            
            .global-score .score-value {
                font-size: 48px;
                font-weight: 700;
                margin: 0;
            }
            
            .categories-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 40px;
                margin: 50px 0;
            }
            
            .category-section {
                border: 2px solid #e5e7eb;
                border-radius: 15px;
                overflow: hidden;
                background: white;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            
            .category-header {
                padding: 20px 30px;
                font-weight: 600;
                color: white;
                font-size: 18px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .category-header.personality {
                background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            }
            
            .category-header.skills {
                background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            }
            
            .category-header.qualities {
                background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
            }
            
            .category-score {
                font-size: 24px;
                font-weight: 700;
            }
            
            .responses-list {
                padding: 30px;
            }
            
            .response-item {
                margin-bottom: 25px;
                padding: 20px;
                background: #f9fafb;
                border-radius: 10px;
                border-left: 4px solid #e5e7eb;
            }
            
            .response-item.personality {
                border-left-color: #1e3a8a;
            }
            
            .response-item.skills {
                border-left-color: #059669;
            }
            
            .response-item.qualities {
                border-left-color: #7c3aed;
            }
            
            .response-question {
                font-weight: 600;
                color: #374151;
                margin-bottom: 8px;
                font-size: 16px;
            }
            
            .response-answer {
                color: #6b7280;
                margin-bottom: 8px;
                font-size: 15px;
            }
            
            .response-score {
                color: #1f2937;
                font-weight: 600;
                font-size: 14px;
            }
            
            .footer {
                text-align: center;
                margin-top: 50px;
                padding: 40px 0;
                border-top: 3px solid #dc2626;
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            }
            
            .footer p {
                color: #374151;
                font-size: 16px;
                margin: 8px 0;
                font-weight: 500;
            }
            
            .validation {
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
                border-top: 1px solid #e5e7eb;
                padding-top: 20px;
            }
            
            .validation p {
                margin: 5px 0;
            }
            
            .print-button {
                position: fixed;
                top: 30px;
                right: 30px;
                background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 600;
                z-index: 1000;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                transition: transform 0.2s;
            }
            
            .print-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(0,0,0,0.15);
            }
            
            .moroccan-pattern {
                position: absolute;
                width: 60px;
                height: 60px;
                opacity: 0.1;
            }
            
            .pattern-1 {
                top: 20px;
                left: 20px;
                background: radial-gradient(circle, #dc2626 30%, transparent 30%);
            }
            
            .pattern-2 {
                top: 20px;
                right: 20px;
                background: radial-gradient(circle, #1e3a8a 30%, transparent 30%);
            }
            
            .pattern-3 {
                bottom: 20px;
                left: 20px;
                background: radial-gradient(circle, #1e3a8a 30%, transparent 30%);
            }
            
            .pattern-4 {
                bottom: 20px;
                right: 20px;
                background: radial-gradient(circle, #dc2626 30%, transparent 30%);
            }
        </style>
    </head>
    <body>
        <button class="print-button" onclick="window.print()">📄 Imprimer en PDF</button>
        
        <div class="certificate">
            <div class="moroccan-border"></div>
            <div class="moroccan-pattern pattern-1"></div>
            <div class="moroccan-pattern pattern-2"></div>
            <div class="moroccan-pattern pattern-3"></div>
            <div class="moroccan-pattern pattern-4"></div>
            
            <div class="header">
                <h1>🇲🇦 eemploi.com</h1>
                <p>Plateforme de Recrutement Professionnelle du Maroc</p>
            </div>
            
            <div class="content">
                <div class="title-section">
                    <h2>Certificat d'Évaluation</h2>
                    <p>Évaluation Complète de Personnalité • Compétences • Qualités Professionnelles</p>
                </div>
                
                <div class="candidate-section">
                    <h3>${candidateName}</h3>
                    <p>a réussi avec succès l'évaluation professionnelle complète</p>
                </div>
                
                <div class="global-score">
                    <h3>Score Global</h3>
                    <div class="score-value">${assessment.total_score} pts</div>
                </div>
                
                <div class="categories-grid">
                    <div class="category-section">
                        <div class="category-header personality">
                            <span>🧠 Évaluation de Personnalité</span>
                            <span class="category-score">${personalityScore} pts</span>
                        </div>
                        <div class="responses-list">
                            ${responsesByCategory.personality.map(response => {
                              const formatted = formatResponse(response);
                              return `
                                <div class="response-item personality">
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
                            <span>🎯 Évaluation des Compétences</span>
                            <span class="category-score">${skillsScore} pts</span>
                        </div>
                        <div class="responses-list">
                            ${responsesByCategory.skills.map(response => {
                              const formatted = formatResponse(response);
                              return `
                                <div class="response-item skills">
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
                            <span>⭐ Évaluation des Qualités</span>
                            <span class="category-score">${qualitiesScore} pts</span>
                        </div>
                        <div class="responses-list">
                            ${responsesByCategory.qualities.map(response => {
                              const formatted = formatResponse(response);
                              return `
                                <div class="response-item qualities">
                                    <div class="response-question">${formatted.text}</div>
                                    <div class="response-answer">Réponse: ${formatted.display}</div>
                                    <div class="response-score">Score: ${formatted.score} points</div>
                                </div>
                              `;
                            }).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>✦ Évaluation complétée le ${completedDate} ✦</strong></p>
                    <p>Ce certificat atteste de la participation complète et des résultats obtenus</p>
                    <p>lors de l'évaluation professionnelle sur la plateforme eemploi.com</p>
                </div>
                
                <div class="validation">
                    <p>Certificat ID: ${assessment.id}</p>
                    <p>Généré par eemploi.com • Plateforme Certifiée du Royaume du Maroc</p>
                    <p>Ce document peut être vérifié sur notre plateforme officielle</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}
