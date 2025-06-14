
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingUp } from 'lucide-react';

const SalarySimulator = () => {
  const [salaryType, setSalaryType] = useState<'brut' | 'net'>('brut');
  const [amount, setAmount] = useState('');
  const [region, setRegion] = useState('casablanca');
  const [result, setResult] = useState<number | null>(null);

  const calculateSalary = () => {
    const inputAmount = parseFloat(amount);
    if (!inputAmount) return;

    // Taux de cotisations sociales approximatifs au Maroc
    const socialChargesRate = 0.21; // 21% environ

    let calculatedResult;
    if (salaryType === 'brut') {
      // Calcul net à partir du brut
      calculatedResult = inputAmount * (1 - socialChargesRate);
    } else {
      // Calcul brut à partir du net
      calculatedResult = inputAmount / (1 - socialChargesRate);
    }

    setResult(Math.round(calculatedResult));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="w-5 h-5 mr-2" />
          Simulateur de Salaire
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Type de salaire</Label>
            <Select value={salaryType} onValueChange={(value: 'brut' | 'net') => setSalaryType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brut">Salaire Brut</SelectItem>
                <SelectItem value="net">Salaire Net</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Région</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casablanca">Casablanca</SelectItem>
                <SelectItem value="rabat">Rabat</SelectItem>
                <SelectItem value="marrakech">Marrakech</SelectItem>
                <SelectItem value="fes">Fès</SelectItem>
                <SelectItem value="tangier">Tanger</SelectItem>
                <SelectItem value="agadir">Agadir</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Montant (MAD/mois)</Label>
          <Input
            type="number"
            placeholder="Ex: 15000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <Button 
          onClick={calculateSalary} 
          className="w-full bg-eemploi-primary hover:bg-eemploi-primary/90"
          disabled={!amount}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Calculer
        </Button>

        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Résultat du calcul</h3>
            <div className="flex justify-between items-center">
              <span className="text-green-700">
                Salaire {salaryType === 'brut' ? 'Net' : 'Brut'} :
              </span>
              <span className="text-xl font-bold text-green-900">
                {result.toLocaleString()} MAD/mois
              </span>
            </div>
            <p className="text-sm text-green-600 mt-2">
              * Calcul approximatif basé sur les cotisations sociales standard au Maroc
            </p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Conseils pour négocier</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Recherchez les salaires moyens de votre secteur</li>
            <li>• Mettez en avant vos compétences uniques</li>
            <li>• Considérez les avantages en nature (assurance, formation...)</li>
            <li>• Négociez en fonction de vos résultats</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalarySimulator;
