import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { logoutSuccess } from "@/store/slices/authSlice";
import api from "@/services/api";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  User as UserIcon,
  MessageSquare,
  ChevronUp,
  Power,
  ShieldCheck,
  Users,
  Database,
  BarChart
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      dispatch(logoutSuccess());
    } catch (error) {
      console.error("Errore durante logout", error);
      dispatch(logoutSuccess()); 
    }
  };

  const userInitials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || user.username[0]}`.toUpperCase() : "??";
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader className="flex items-center justify-center p-4">
          <div className="flex items-center gap-2 font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              {import.meta.env.VITE_APP_COMPANY_NAME?.[0] || "C"}
            </div>
            <span className="group-data-[collapsible=icon]:hidden text-xl tracking-tight">
              {import.meta.env.VITE_APP_COMPANY_NAME || "ChatBot"}
            </span>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          {/* Menu principale comune */}
          <SidebarGroup>
            <SidebarGroupLabel>Generale</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Chat">
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat AI</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Menu specifico per ADMIN */}
          {isAdmin && (
            <SidebarGroup>
              <SidebarGroupLabel>Amministrazione</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Gestione Utenti">
                      <Users className="h-4 w-4" />
                      <span>Utenti</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Knowledge Base">
                      <Database className="h-4 w-4" />
                      <span>Documenti</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Statistiche">
                      <BarChart className="h-4 w-4" />
                      <span>Analisi</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" />
                  }
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">{user?.firstName} {user?.lastName}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="top" align="end" sideOffset={4}>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarFallback className="rounded-lg bg-primary/10 text-primary">{userInitials}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">{user?.username}</span>
                          <span className="truncate text-xs text-muted-foreground">{user?.roles.join(", ")}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profilo
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Impostazioni
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive font-medium">
                    <LogOut className="mr-2 h-4 w-4" />
                    Esci
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-background/95 backdrop-blur-md sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1 font-medium text-sm text-muted-foreground">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Area Amministratore
              </div>
            ) : "Area Utente"}
          </div>
          
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                {/* 
                  FIX: Usiamo 'render' invece di 'asChild' per evitare nesting di button.
                  Il componente Button emette già un tag <button>.
                */}
                <TooltipTrigger
                  render={
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleLogout}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    />
                  }
                >
                  <Power className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Esci dal sistema</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-8 overflow-auto bg-background/50">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
