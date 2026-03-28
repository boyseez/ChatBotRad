import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ChatInterface } from '@/features/chat/components/chat-interface';

export default function UserHomePage() {
  return (
    <DashboardLayout>
      <div className="flex h-full w-full items-center justify-center p-0 md:p-4 lg:p-6 overflow-hidden">
        <ChatInterface />
      </div>
    </DashboardLayout>
  );
}
