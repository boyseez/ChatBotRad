package it.peoplefirs.chatboot.controller;

import it.peoplefirs.chatboot.dto.UserDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
@Slf4j
public class AuthController {

    @GetMapping("/me")
    public Mono<UserDTO> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            log.debug("Richiesta /me senza autenticazione valida");
            return Mono.empty();
        }

        Object principal = authentication.getPrincipal();
        
        if (principal instanceof OAuth2User oauth2User) {
            log.debug("Recupero info utente da OAuth2User: {}", oauth2User.getName());
            return Mono.just(UserDTO.builder()
                    .username(oauth2User.getAttribute("preferred_username"))
                    .email(oauth2User.getAttribute("email"))
                    .firstName(oauth2User.getAttribute("given_name"))
                    .lastName(oauth2User.getAttribute("family_name"))
                    .roles(authentication.getAuthorities().stream()
                            .map(GrantedAuthority::getAuthority)
                            .collect(Collectors.toSet()))
                    .build());
        }

        log.warn("Principal di tipo non supportato: {}", principal.getClass().getName());
        return Mono.empty();
    }
}
