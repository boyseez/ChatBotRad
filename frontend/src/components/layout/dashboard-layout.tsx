import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { logoutSuccess } from "@/store/slices/authSlice";
import { setActiveChat, setChatLoading, setMessages } from "@/store/slices/chatSlice";
import api from "@/services/api";
import { useTheme } from "@/components/theme-provider";
import { getRoleLabel } from "@/lib/validations/roles";
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
  SidebarGroupContent,
  SidebarMenuAction
} from "@/components/ui/sidebar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  Plus,
  Trash2,
  X,
  History,
  Sun,
  Moon,
  Monitor,
  Check
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Chat {
  id: string;
  title: string;
  date: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { activeChatId } = useSelector((state: RootState) => state.chat);
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await api.get("/chats");
        setChats(response.data);
      } catch (err) {
        console.error("Errore caricamento chat", err);
      }
    };
    if (user && !user.roles.includes("ROLE_ADMIN")) {
      fetchChats();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      dispatch(logoutSuccess());
    } catch (error) {
      dispatch(logoutSuccess()); 
    }
  };

  const handleNewChat = () => {
    dispatch(setActiveChat(null));
  };

  const handleSelectChat = async (id: string) => {
    dispatch(setActiveChat(id));
    dispatch(setChatLoading(true));
    try {
      const response = await api.get(`/chats/${id}/messages`);
      dispatch(setMessages(response.data));
    } catch (err) {
      console.error("Errore caricamento messaggi chat", err);
    } finally {
      dispatch(setChatLoading(false));
    }
  };

  const deleteSingleChat = async (id: string) => {
    try {
      await api.delete(`/chats/${id}`);
      setChats(prev => prev.filter(c => c.id !== id));
      if (activeChatId === id) {
        dispatch(setActiveChat(null));
      }
    } catch (err) {
      console.error("Errore eliminazione chat", err);
    }
  };

  const clearAllChats = async () => {
    try {
      await api.delete("/chats");
      setChats([]);
      dispatch(setActiveChat(null));
    } catch (err) {
      console.error("Errore svuotamento cronologia", err);
    }
  };

  const userInitials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || user.username[0]}`.toUpperCase() : "??";
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  return (
    <SidebarProvider className="h-full overflow-hidden">
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader className="flex items-center justify-center p-4">
          <div className="flex items-center gap-2 font-bold text-primary">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold shadow-lg">
              {import.meta.env.VITE_APP_COMPANY_NAME?.[0] || "C"}
            </div>
            <span className="group-data-[collapsible=icon]:hidden text-xl tracking-tighter text-foreground">
              {import.meta.env.VITE_APP_COMPANY_NAME || "ChatBot"}
            </span>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          {isAdmin ? (
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 py-2 text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">Amministrazione</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Dashboard Generale">
                      <LayoutDashboard className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground text-sm">Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Gestione Utenti">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground text-sm">Utenti</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Knowledge Base">
                      <Database className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground text-sm">Documenti</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            <>
              <SidebarGroup>
                <SidebarGroupContent className="px-2 py-2 mt-2">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        tooltip="Inizia una nuova conversazione"
                        onClick={handleNewChat}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-md h-10 font-bold justify-center md:justify-start ring-1 ring-primary/20"
                      >
                        <Plus className="h-4 w-4 shrink-0 stroke-[3px]" />
                        <span className="group-data-[collapsible=icon]:hidden ml-2 text-sm">New Chat</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <div className="flex items-center justify-between px-4 py-2 group-data-[collapsible=icon]:hidden">
                  <SidebarGroupLabel className="p-0 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">Cronologia</SidebarGroupLabel>
                  {chats.length > 0 && (
                    <AlertDialog>
                      <AlertDialogTrigger 
                        render={
                          <button className="text-[10px] text-muted-foreground hover:text-destructive font-bold flex items-center gap-1 transition-colors opacity-50 hover:opacity-100" />
                        }
                      >
                        <Trash2 className="h-3 w-3" />
                        Svuota
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Sei assolutamente sicuro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Questa azione eliminerà permanentemente l'intera cronologia delle tue conversazioni.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annulla</AlertDialogCancel>
                          <AlertDialogAction onClick={clearAllChats} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold">
                            Elimina Tutto
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-1 px-2">
                    {chats.map((chat) => (
                      <SidebarMenuItem key={chat.id} className="group/item relative">
                        <SidebarMenuButton 
                          tooltip={chat.title}
                          isActive={activeChatId === chat.id}
                          onClick={() => handleSelectChat(chat.id)}
                          className="h-auto py-3 px-3 hover:bg-sidebar-accent transition-all duration-200 rounded-lg pr-8 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                        >
                          <MessageSquare className={cn("h-4 w-4 shrink-0 mt-0.5", activeChatId === chat.id ? "text-primary" : "text-muted-foreground")} />
                          <div className="flex flex-col items-start overflow-hidden ml-1 text-left">
                            <span className="truncate w-full font-medium text-sm leading-tight">{chat.title}</span>
                            <span className="text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden mt-1 font-semibold opacity-70 italic">{chat.date}</span>
                          </div>
                        </SidebarMenuButton>
                        
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <SidebarMenuAction
                                showOnHover
                                className="hover:text-destructive text-muted-foreground/40"
                              />
                            }
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Elimina chat</span>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminare questa chat?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Stai per eliminare la conversazione "{chat.title}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annulla</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteSingleChat(chat.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Elimina
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </SidebarMenuItem>
                    ))}
                    {chats.length === 0 && (
                      <div className="px-4 py-8 text-[11px] text-muted-foreground italic group-data-[collapsible=icon]:hidden text-center opacity-50 flex flex-col items-center gap-2">
                        <History className="h-6 w-6 opacity-20" />
                        Nessuna chat recente
                      </div>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </>
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
                  <Avatar className="h-8 w-8 rounded-lg border-2 border-primary/20 shadow-sm">
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-black text-xs">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-1">
                    <span className="truncate font-bold text-foreground">{user?.firstName} {user?.lastName}</span>
                    <span className="truncate text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">
                      {getRoleLabel(user?.roles)}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden opacity-50" />
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="top" align="end" sideOffset={4}>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg border shadow-sm">
                          <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-xs">{userInitials}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">{user?.username}</span>
                          <span className="truncate text-xs text-muted-foreground">
                            {getRoleLabel(user?.roles)} • {user?.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      Il mio Profilo
                    </DropdownMenuItem>
                    
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        {theme === 'light' && <Sun className="mr-2 h-4 w-4 text-muted-foreground" />}
                        {theme === 'dark' && <Moon className="mr-2 h-4 w-4 text-muted-foreground" />}
                        {theme === 'system' && <Monitor className="mr-2 h-4 w-4 text-muted-foreground" />}
                        Aspetto
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                          <Sun className="mr-2 h-4 w-4" />
                          Chiaro
                          {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                          <Moon className="mr-2 h-4 w-4" />
                          Scuro
                          {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                          <Monitor className="mr-2 h-4 w-4" />
                          Sistema
                          {theme === "system" && <Check className="ml-auto h-4 w-4" />}
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                      Impostazioni
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive font-bold">
                    <LogOut className="mr-2 h-4 w-4" />
                    Esci dal sistema
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="md:m-2 md:rounded-[var(--radius)] overflow-hidden shadow-sm border relative">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-background/95 backdrop-blur-md sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1 font-medium text-sm text-muted-foreground">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Area Amministratore
              </div>
            ) : (
              <div className="flex items-center gap-2 italic">
                <MessageSquare className={cn("h-4 w-4", activeChatId ? "text-primary" : "")} />
                {activeChatId ? `Conversazione #${activeChatId}` : "Nuova Conversazione"}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
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
        <main className="flex flex-1 flex-col overflow-hidden bg-background/50">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
