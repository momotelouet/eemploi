
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  postedAt: string;
  logo?: string;
}

const JobCard = ({ id, title, company, location, type, salary, description, postedAt, logo }: JobCardProps) => {
  return (
    <Card className="hover-lift border-l-4 border-l-eemploi-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-eemploi-primary to-eemploi-secondary rounded-lg flex items-center justify-center text-white font-bold">
              {logo ? <img src={logo} alt={company} className="w-full h-full object-cover rounded-lg" /> : company[0]}
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight">{title}</h3>
              <p className="text-muted-foreground">{company}</p>
            </div>
          </div>
          <Badge variant="secondary">{type}</Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          {salary && (
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{salary}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{postedAt}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/emplois/${id}`}>Voir plus</Link>
          </Button>
          <Button size="sm" className="bg-eemploi-primary hover:bg-eemploi-primary/90">
            Postuler
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
