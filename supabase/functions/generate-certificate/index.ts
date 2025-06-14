
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

    // Récupérer les informations du profil séparément
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', assessment.user_id)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      // Continuer sans le profil si non trouvé
    }

    // Combiner les données
    const assessmentWithProfile = {
      ...assessment,
      profiles: profile || { first_name: '', last_name: '' }
    };

    // Générer le contenu HTML du certificat
    const certificateHtml = generateCertificateHTML(assessmentWithProfile);

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

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificat d'Évaluation Professionnelle</title>
        <style>
            @media print {
                body { margin: 0; }
                .certificate { box-shadow: none; }
            }
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                color: #333;
            }
            .certificate {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 60px;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                position: relative;
                overflow: hidden;
            }
            .certificate::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 8px;
                background: linear-gradient(90deg, #4CAF50, #2196F3, #9C27B0);
            }
            .logo {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo h1 {
                color: #2196F3;
                font-size: 32px;
                margin: 0;
                font-weight: bold;
            }
            .logo p {
                color: #666;
                margin: 5px 0 0 0;
                font-size: 14px;
            }
            .title {
                text-align: center;
                margin-bottom: 40px;
            }
            .title h2 {
                font-size: 28px;
                color: #333;
                margin: 0 0 10px 0;
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            .title p {
                color: #666;
                font-size: 16px;
                margin: 0;
            }
            .candidate {
                text-align: center;
                margin: 40px 0;
                padding: 30px;
                background: #f8f9fa;
                border-radius: 10px;
            }
            .candidate h3 {
                font-size: 24px;
                color: #2196F3;
                margin: 0 0 10px 0;
            }
            .candidate p {
                color: #666;
                margin: 0;
                font-size: 16px;
            }
            .scores {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin: 40px 0;
            }
            .score-card {
                text-align: center;
                padding: 20px;
                border-radius: 10px;
                background: #f8f9fa;
                border-left: 4px solid;
            }
            .score-card.personality {
                border-left-color: #2196F3;
            }
            .score-card.skills {
                border-left-color: #4CAF50;
            }
            .score-card.qualities {
                border-left-color: #9C27B0;
            }
            .score-card h4 {
                margin: 0 0 10px 0;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #666;
            }
            .score-card .score {
                font-size: 32px;
                font-weight: bold;
                margin: 0;
                color: #333;
            }
            .score-card .max {
                font-size: 14px;
                color: #999;
                margin: 5px 0 0 0;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 30px;
                border-top: 2px solid #eee;
            }
            .footer p {
                color: #666;
                font-size: 14px;
                margin: 5px 0;
            }
            .validation {
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #999;
            }
            .validation p {
                margin: 2px 0;
            }
            .print-button {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #2196F3;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                z-index: 1000;
            }
            .print-button:hover {
                background: #1976D2;
            }
            @media print {
                .print-button { display: none; }
            }
        </style>
    </head>
    <body>
        <button class="print-button" onclick="window.print()">Imprimer en PDF</button>
        <div class="certificate">
            <div class="logo">
                <h1>eemploi.com</h1>
                <p>Plateforme de recrutement professionnelle</p>
            </div>
            
            <div class="title">
                <h2>Certificat d'Évaluation</h2>
                <p>Personnalité • Compétences • Qualités Professionnelles</p>
            </div>
            
            <div class="candidate">
                <h3>${candidateName}</h3>
                <p>a réussi avec succès l'évaluation professionnelle complète</p>
            </div>
            
            <div class="scores">
                <div class="score-card personality">
                    <h4>🧠 Personnalité</h4>
                    <div class="score">${personalityScore}</div>
                    <div class="max">/ 25</div>
                </div>
                <div class="score-card skills">
                    <h4>🎯 Compétences</h4>
                    <div class="score">${skillsScore}</div>
                    <div class="max">/ 25</div>
                </div>
                <div class="score-card qualities">
                    <h4>⭐ Qualités</h4>
                    <div class="score">${qualitiesScore}</div>
                    <div class="max">/ 15</div>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Score total: ${assessment.total_score}</strong></p>
                <p>Évaluation complétée le ${completedDate}</p>
                <p>Ce certificat atteste de la participation complète du candidat à notre évaluation professionnelle.</p>
            </div>
            
            <div class="validation">
                <p>Certificat ID: ${assessment.id}</p>
                <p>Généré par eemploi.com • Plateforme certifiée</p>
                <p>Ce document peut être vérifié sur notre plateforme</p>
            </div>
        </div>
    </body>
    </html>
  `;
}
