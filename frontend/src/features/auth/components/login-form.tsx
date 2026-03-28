import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import api from "@/services/api";
import { setAuthSuccess, setAuthFailure, setAuthStart } from "@/store/slices/authSlice";
import { useLogger } from "@/hooks/use-logger";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logger = useLogger("LoginForm");

  // Inizializzazione React Hook Form con resolver Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    }
  });

  const onFormSubmit = async (values: LoginFormValues) => {
    setIsPending(true);
    setServerError(null);
    dispatch(setAuthStart());

    try {
      logger.debug("Tentativo di login per:", values.username);
      const response = await api.post("/auth/login", { 
        username: values.username, 
        password: values.password 
      });
      
      if (response.data) {
        logger.success("Login completato con successo", response.data);
        dispatch(setAuthSuccess(response.data));
        
        if (response.data.roles.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Credenziali non valide o errore di rete";
      logger.error("Fallimento login", error);
      setServerError(msg);
      dispatch(setAuthFailure(msg));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit(onFormSubmit)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold italic tracking-tight">Accedi al tuo account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Inserisci qui sotto le tue credenziali per accedere.
          </p>
        </div>
        
        {serverError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-medium text-center animate-in fade-in slide-in-from-top-2 duration-300">
            {serverError}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input 
            id="username" 
            placeholder="admin o user" 
            autoComplete="username"
            {...register("username")}
            disabled={isPending}
            className={cn(errors.username && "border-destructive ring-destructive/20 focus-visible:ring-destructive/20")}
          />
          {errors.username && <FieldError>{errors.username.message}</FieldError>}
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
              autoComplete="current-password"
              {...register("password")}
              disabled={isPending}
              className={cn(
                "pr-10",
                errors.password && "border-destructive ring-destructive/20 focus-visible:ring-destructive/20"
              )}
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
          {errors.password && <FieldError>{errors.password.message}</FieldError>}
        </Field>

        <Field>
          <Button type="submit" disabled={isPending} className="font-bold">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Accesso in corso..." : "Accedi"}
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
