
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import ApplicationListCard from "./ApplicationListCard";
import CompactApplicationListCard from "./CompactApplicationListCard";
import type { ApplicationWithJobAndProfile } from "@/hooks/useJobApplications";

interface ApplicationsTabsProps {
  applications: ApplicationWithJobAndProfile[];
  pendingApplications: ApplicationWithJobAndProfile[];
  acceptedApplications: ApplicationWithJobAndProfile[];
  rejectedApplications: ApplicationWithJobAndProfile[];
  onViewDetails: (application: ApplicationWithJobAndProfile) => void;
}

const ApplicationsTabs = ({
  applications,
  pendingApplications,
  acceptedApplications,
  rejectedApplications,
  onViewDetails,
}: ApplicationsTabsProps) => {
  const renderApplicationList = (list: ApplicationWithJobAndProfile[], type: 'full' | 'pending' | 'accepted' | 'rejected', emptyState: React.ReactNode) => {
    if (list.length === 0) {
      return emptyState;
    }
    return (
      <div className="space-y-4">
        {list.map((application) =>
          type === 'full' ? (
            <ApplicationListCard
              key={application.id}
              application={application}
              onViewDetails={onViewDetails}
            />
          ) : (
            <CompactApplicationListCard
              key={application.id}
              application={application}
              onViewDetails={onViewDetails}
              type={type}
            />
          )
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <div className="border-b">
            <TabsList className="grid w-full grid-cols-4 bg-transparent">
              <TabsTrigger value="all">Toutes ({applications.length})</TabsTrigger>
              <TabsTrigger value="pending">En attente ({pendingApplications.length})</TabsTrigger>
              <TabsTrigger value="accepted">Acceptées ({acceptedApplications.length})</TabsTrigger>
              <TabsTrigger value="rejected">Refusées ({rejectedApplications.length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Toutes les candidatures</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </div>
              {renderApplicationList(
                applications,
                'full',
                (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune candidature reçue</h3>
                    <p className="text-muted-foreground">
                      Les candidatures pour vos offres d'emploi apparaîtront ici.
                    </p>
                  </div>
                )
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Candidatures en attente</h3>
              {renderApplicationList(
                pendingApplications,
                'pending',
                (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucune candidature en attente</p>
                  </div>
                )
              )}
            </div>
          </TabsContent>

          <TabsContent value="accepted" className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Candidatures acceptées</h3>
              {renderApplicationList(
                acceptedApplications,
                'accepted',
                (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucune candidature acceptée</p>
                  </div>
                )
              )}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Candidatures refusées</h3>
              {renderApplicationList(
                rejectedApplications,
                'rejected',
                (
                  <div className="text-center py-8">
                    <XCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucune candidature refusée</p>
                  </div>
                )
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApplicationsTabs;
