import { Button } from "@/components/ui/button";

export function UrgentSupportAlert() {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-4 mb-4">
      <div>
        <div className="font-semibold text-red-700">Support urgent&nbsp;?</div>
        <div className="text-sm text-red-600">
          Pour les questions urgentes, contactez-nous directement par téléphone ou chat en direct.
        </div>
      </div>
      <Button disabled variant="destructive" className="ml-auto">
        Appeler maintenant
      </Button>
    </div>
  );
}
