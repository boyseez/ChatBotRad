package it.peoplefirs.chatboot.service;

import it.peoplefirs.chatboot.dto.TokenResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

/**
 * Servizio per l'interazione con Keycloak e la generazione dei token.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    @Value("${keycloak.token.uri}")
    private String tokenUri;

    @Value("${keycloak.client.id}")
    private String clientId;

    @Value("${keycloak.client.secret}")
    private String clientSecret;

    private final WebClient webClient;

    /**
     * Esegue il login tramite grant_type=password.
     * @param username nome utente
     * @param password password utente
     * @return Mono con la risposta del token
     */
    public Mono<TokenResponse> login(String username, String password) {
        log.info("Tentativo di autenticazione per l'utente: {} presso {}", username, tokenUri);

        return webClient.post()
                .uri(tokenUri)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("grant_type", "password")
                        .with("client_id", clientId)
                        .with("client_secret", clientSecret)
                        .with("username", username)
                        .with("password", password))
                .retrieve()
                .bodyToMono(TokenResponse.class)
                .doOnSuccess(res -> log.info("Token generato con successo per l'utente {}", username))
                .doOnError(e -> handleLoginError(e, username));
    }

    private void handleLoginError(Throwable e, String username) {
        if (e instanceof WebClientResponseException ex) {
            log.error("Errore di risposta da Keycloak per l'utente {}: {} - {} - {}", 
                username, ex.getStatusCode(), ex.getStatusText(), ex.getResponseBodyAsString());
        } else {
            log.error("Errore di connessione a Keycloak per l'utente {}: {}", username, e.getMessage());
        }
    }
}
