import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function UserHomePage() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <DashboardLayout>
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-md border-none bg-gradient-to-br from-background to-secondary/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <UserCircle className="h-6 w-6 text-secondary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold italic tracking-tight">Area Personale</CardTitle>
            <CardDescription>Il tuo assistente AI è pronto ad aiutarti.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center text-lg">
            <p>Ciao, <span className="font-semibold text-secondary-foreground">{user?.firstName || user?.username}</span>!</p>
            <p className="text-muted-foreground">
              Utilizza la barra laterale per navigare tra le tue risorse e avviare nuove conversazioni.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
