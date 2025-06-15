
import React from "react";
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Briefcase, TrendingUp, Star } from 'lucide-react';

interface CandidateQuickStatsProps {
  cvCount: number;
  applicationsCount: number;
  interviewCount: number;
  profileCompletion: number;
  loading?: boolean;
  applicationsLoading?: boolean;
  candidateLoading?: boolean;
  cvLoading?: boolean;
}

const CandidateQuickStats: React.FC<CandidateQuickStatsProps> = ({
  cvCount,
  applicationsCount,
  interviewCount,
  profileCompletion,
  loading,
  applicationsLoading,
  candidateLoading,
  cvLoading
}) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center">
          <FileText className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
          <div className="ml-2 md:ml-4">
            <p className="text-xs md:text-sm font-medium text-muted-foreground">CV Créés</p>
            <p className="text-lg md:text-2xl font-bold">
              {cvLoading ? '...' : cvCount}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center">
          <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
          <div className="ml-2 md:ml-4">
            <p className="text-xs md:text-sm font-medium text-muted-foreground">Candidatures</p>
            <p className="text-lg md:text-2xl font-bold">
              {applicationsLoading ? '...' : applicationsCount}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center">
          <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
          <div className="ml-2 md:ml-4">
            <p className="text-xs md:text-sm font-medium text-muted-foreground">Entretiens</p>
            <p className="text-lg md:text-2xl font-bold">
              {applicationsLoading ? '...' : interviewCount}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center">
          <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />
          <div className="ml-2 md:ml-4">
            <p className="text-xs md:text-sm font-medium text-muted-foreground">Profil Complété</p>
            <p className="text-lg md:text-2xl font-bold">
              {candidateLoading ? '...' : `${profileCompletion}%`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default CandidateQuickStats;
