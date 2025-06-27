import { Link } from 'react-router-dom';
import { Phone, UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

const policies = [
	{ name: 'Confidentialité', path: '/legal/privacy' },
	{ name: 'Cookies', path: '/legal/cookies' },
	{ name: 'Conditions', path: '/legal/terms' },
	{ name: 'Politique de confidentialité', path: '/legal/mentions-legales' }, // à créer si besoin
];

const TopBar = () => (
	<div className="w-full bg-gradient-to-r from-eemploi-primary/90 to-eemploi-secondary/90 text-white text-xs md:text-sm py-2 px-4 flex justify-between items-center shadow-sm animate-fade-in sticky top-0 z-[60]">
		{/* Politiques à gauche sous forme de boutons */}
		<div className="flex items-center space-x-2">
			{policies.map((policy) => (
				<Link to={policy.path} key={policy.name}>
					<Button
						size="sm"
						variant="secondary"
						className="bg-white/10 text-white hover:bg-white/20 px-3 py-1 rounded-md font-semibold"
					>
						{policy.name}
					</Button>
				</Link>
			))}
		</div>
		{/* Liens à droite */}
		<div className="flex items-center space-x-2">
			<Link to="/contact">
				<Button size="sm" variant="secondary" className="bg-white/10 text-white hover:bg-white/20 px-3 py-1 rounded-md font-semibold flex items-center space-x-1">
					<span>Contact</span>
				</Button>
			</Link>
			<Link to="/auth/register">
				<Button size="sm" variant="secondary" className="bg-white/10 text-white hover:bg-white/20 px-3 py-1 rounded-md font-semibold flex items-center space-x-1">
					<span>Enregistrement</span>
				</Button>
			</Link>
			<Link to="/auth/login">
				<Button size="sm" variant="secondary" className="bg-white/10 text-white hover:bg-white/20 px-3 py-1 rounded-md font-semibold flex items-center space-x-1">
					<span>Login</span>
				</Button>
			</Link>
		</div>
	</div>
);

export default TopBar;
