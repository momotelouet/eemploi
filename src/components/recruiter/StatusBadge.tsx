
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
    case 'accepted':
      return <Badge className="bg-green-100 text-green-800">Acceptée</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800">Refusée</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};
