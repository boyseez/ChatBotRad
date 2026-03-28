import * as z from "zod";

/**
 * Schema di validazione per il form di Login.
 * Può essere riutilizzato sia nel frontend che potenzialmente in test o altri form.
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "L'username è obbligatorio")
    .min(3, "L'username deve avere almeno 3 caratteri"),
  password: z
    .string()
    .min(1, "La password è obbligatoria")
    .min(6, "La password deve avere almeno 6 caratteri"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
