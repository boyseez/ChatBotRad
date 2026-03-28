package it.peoplefirs.chatboot.controller;

import it.peoplefirs.chatboot.controller.api.SecurityTestApi;
import it.peoplefirs.chatboot.dto.TokenResponse;
import it.peoplefirs.chatboot.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SecurityTestController implements SecurityTestApi {

  private final AuthService authService;

  @Override
  public Mono<TokenResponse> getAdminToken() {
    log.info("Richiesta token per admin-user");

    return authService
        .login("admin-user", "adminpassword123")
        .doOnSuccess(token -> log.info("Token generato per admin-user"))
        .doOnError(error -> log.error("Errore durante login admin-user", error));
  }

  @Override
  public Mono<TokenResponse> getUserToken() {
    log.info("Richiesta token per test-user");

    return authService
        .login("test-user", "password123")
        .doOnSuccess(token -> log.info("Token generato per test-user"))
        .doOnError(error -> log.error("Errore durante login test-user", error));
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public Mono<String> getAdminData() {
    log.info("Accesso a endpoint ADMIN");
    log.error("Accesso a endpoint ADMIN", new RuntimeException());
    return Mono.just("ACCESSO AUTORIZZATO: Benvenuto Admin!")
        .doOnSuccess(res -> log.info("Risposta inviata endpoint ADMIN"))
        .doOnError(err -> log.error("Errore endpoint ADMIN", err));
  }

  @Override
  public Mono<String> getPublicInfo() {
    log.info("Accesso endpoint pubblico");

    return Mono.just("Questo endpoint è pubblico e accessibile a tutti.");
  }

  @Override
  @PreAuthorize("hasRole('USER')")
  public Mono<String> getUserData() {
    log.info("Accesso endpoint USER");

    return Mono.just("ACCESSO AUTORIZZATO: Benvenuto Utente standard!");
  }
}
