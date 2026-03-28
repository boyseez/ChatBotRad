package it.peoplefirs.chatboot.controller.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.peoplefirs.chatboot.dto.TokenResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import reactor.core.publisher.Mono;

@Tag(
    name = "Security Test",
    description = "Endpoint per la validazione del sistema di sicurezza e dei permessi RBAC")
public interface SecurityTestApi {

  @PostMapping("/auth/login/admin")
  @Operation(
      summary = "Login Admin",
      security = {},
      description = "Simula login amministrativo per ottenere un JWT valido")
  Mono<TokenResponse> getAdminToken();

  @PostMapping("/auth/login/user")
  @Operation(
      summary = "Login User",
      security = {},
      description = "Simula login utente per ottenere un JWT valido")
  Mono<TokenResponse> getUserToken();

  @GetMapping("/admin/data")
  @Operation(
      summary = "Dati riservati ADMIN",
      description = "Restituisce dati protetti accessibili solo con ruolo ROLE_ADMIN")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Successo"),
    @ApiResponse(responseCode = "403", description = "Permessi insufficienti"),
    @ApiResponse(responseCode = "401", description = "Non autorizzato")
  })
  Mono<String> getAdminData();

  @GetMapping("/user/data")
  @Operation(
      summary = "Dati riservati USER",
      description = "Restituisce dati protetti accessibili con ruolo ROLE_USER")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Successo"),
    @ApiResponse(responseCode = "403", description = "Permessi insufficienti")
  })
  Mono<String> getUserData();

  @GetMapping("/public/info")
  @Operation(
      summary = "Informazioni Pubbliche",
      security = {},
      description = "Accessibile senza autenticazione")
  Mono<String> getPublicInfo();
}
