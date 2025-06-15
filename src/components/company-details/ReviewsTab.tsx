
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const ReviewsTab = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Avis des employés</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                    <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Les avis employés seront bientôt disponibles</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ReviewsTab;
