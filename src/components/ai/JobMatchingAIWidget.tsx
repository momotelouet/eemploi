import React, { useState } from 'react';
import AIChat from './AIChat';
import { useUserType } from '@/hooks/useUserType';

const JobMatchingAIWidget = () => {
  const userType = useUserType();
  const [open, setOpen] = useState(true);

  // Détection automatique du contexte pour l'IA
  let title = "Assistant IA Emploi";
  let placeholder = "Décrivez le poste recherché ou le profil souhaité...";
  let type: 'job-matching' | 'candidate-analysis' = 'job-matching';

  if (userType === 'recruteur') {
    title = "Assistant IA : Trouver des candidats";
    placeholder = "Décrivez le profil recherché, les compétences, l'expérience, etc.";
    type = 'candidate-analysis';
  } else {
    title = "Assistant IA : Trouver un emploi";
    placeholder = "Décrivez le poste, le secteur, la ville, les compétences...";
    type = 'job-matching';
  }

  return (
    <div className={`fixed bottom-4 left-4 z-50 w-[320px] max-w-full animate-fade-in-up transition-all duration-300 shadow-2xl rounded-xl ${open ? '' : 'opacity-60 pointer-events-none scale-90'}`}
      style={{ minHeight: open ? 0 : 40 }}
    >
      <div className="flex items-center justify-between bg-eemploi-primary/90 text-white px-3 py-2 rounded-t-xl cursor-pointer select-none" onClick={() => setOpen(o => !o)}>
        <span className="font-semibold text-sm">Assistant IA</span>
        <button className="ml-2 text-white/80 hover:text-white" aria-label="Réduire ou ouvrir">
          {open ? <svg width="18" height="18" viewBox="0 0 20 20"><path fill="currentColor" d="M5 12l5-5 5 5H5z"/></svg> : <svg width="18" height="18" viewBox="0 0 20 20"><path fill="currentColor" d="M5 8l5 5 5-5H5z"/></svg>}
        </button>
      </div>
      {open && <AIChat title={title} placeholder={placeholder} type={type} />}
    </div>
  );
};

export default JobMatchingAIWidget;
