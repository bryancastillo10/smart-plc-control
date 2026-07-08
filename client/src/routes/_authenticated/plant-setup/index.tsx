import { createFileRoute } from '@tanstack/react-router'
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { PlantSetupWizard } from '@/components/plant-setup/PlantSetupWizard';

export const Route = createFileRoute('/_authenticated/plant-setup/')({
  component: PlantSetupPage,
})

function PlantSetupPage() {
  const { isAllowed } = useRoleGuard(["ADMIN"]);

  if (!isAllowed) {
    return null;
  }

  return <PlantSetupWizard />;
}

