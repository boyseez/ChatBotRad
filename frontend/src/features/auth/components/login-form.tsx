import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import api from "@/services/api";
import { setAuthSuccess, setAuthFailure, setAuthStart } from "@/store/slices/authSlice";
import { useLogger } from "@/hooks/use-logger";
import { Loader2, Eye, EyeOff } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logger = useLogger("LoginForm");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setLocalError(null);
    dispatch(setAuthStart());

    try {
      logger.debug("Tentativo di login per:", username);
      const response = await api.post("/auth/login", { username, password });
      
      if (response.data) {
        logger.success("Login completato con successo", response.data);
        dispatch(setAuthSuccess(response.data));
        
        // Reindirizzamento basato sul ruolo
        if (response.data.roles.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Credenziali non valide o errore di rete";
      logger.error("Fallimento login", error);
      setLocalError(msg);
      dispatch(setAuthFailure(msg));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Accedi al tuo account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Inserisci qui sotto le tue credenziali per accedere.
          </p>
        </div>
        
        {localError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-medium text-center animate-in fade-in slide-in-from-top-2 duration-300">
            {localError}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input 
            id="username" 
            type="text" 
            placeholder="admin o user" 
            required 
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isPending}
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Hai dimenticato la password?
            </a>
          </div>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              required 
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors outline-none focus:text-primary"
              disabled={isPending}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">
                {showPassword ? "Nascondi password" : "Mostra password"}
              </span>
            </button>
          </div>
        </Field>
        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Accesso in corso..." : "Login"}
          </Button>
        </Field>
        
        <FieldSeparator>Oppure</FieldSeparator>
        
        <Field>
          <Button variant="outline" type="button" disabled={true}>
            SSO Aziendale (Keycloak)
          </Button>
          <FieldDescription className="text-center italic">
            Configura VITE_USE_MOCKS=true per testare con username 'admin' o 'user'.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
