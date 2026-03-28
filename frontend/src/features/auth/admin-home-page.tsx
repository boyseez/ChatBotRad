import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function AdminHomePage() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <DashboardLayout>
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-primary/50 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Benvenuto, Admin</CardTitle>
            <CardDescription>Hai il controllo completo del sistema RAG Multimodale.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center text-lg">
            <p>Ciao, <span className="font-semibold text-primary">{user?.firstName} {user?.lastName}</span>!</p>
            <p className="text-muted-foreground italic">
              "Con grandi poteri derivano grandi responsabilità."
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
