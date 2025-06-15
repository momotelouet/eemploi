
import PageLayout from '@/components/Layout/PageLayout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
    {
        question: "Comment puis-je créer un compte candidat ?",
        answer: "C'est très simple ! Cliquez sur le bouton 'S'inscrire' en haut à droite, choisissez 'Candidat', et remplissez le formulaire. Vous pourrez ensuite compléter votre profil et commencer à postuler."
    },
    {
        question: "Est-ce que l'utilisation d'eemploi est gratuite pour les candidats ?",
        answer: "Oui, la création de profil, la recherche d'emploi et la postulation à des offres sont entièrement gratuites pour les candidats. Nous proposons également des outils premium pour booster votre recherche."
    },
    {
        question: "Comment une entreprise peut-elle publier une offre d'emploi ?",
        answer: "Les entreprises doivent créer un compte recruteur. Une fois le compte validé, vous pourrez accéder à votre tableau de bord pour acheter des crédits et publier vos offres d'emploi en quelques clics."
    },
    {
        question: "Quels types d'entreprises recrutent sur eemploi ?",
        answer: "Nous collaborons avec une grande variété d'entreprises, des startups innovantes aux grands groupes nationaux et internationaux, dans tous les secteurs d'activité au Maroc."
    }
]

const FAQ = () => {
  return (
    <PageLayout title="Foire Aux Questions" subtitle="Trouvez les réponses à vos questions les plus fréquentes.">
        <Accordion type="single" collapsible className="w-full">
            {faqData.map((item, index) => (
                 <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>
                    {item.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </PageLayout>
  );
};

export default FAQ;
