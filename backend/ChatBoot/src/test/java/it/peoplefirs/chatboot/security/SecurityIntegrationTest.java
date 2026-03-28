package it.peoplefirs.chatboot.security;

import it.peoplefirs.chatboot.config.CorrelationIdWebFilter;
import it.peoplefirs.chatboot.config.SecurityConfig;
import it.peoplefirs.chatboot.controller.SecurityTestController;
import it.peoplefirs.chatboot.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.reactive.server.WebTestClient;

import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.mockJwt;

@SpringBootTest
@AutoConfigureWebTestClient
@Import({SecurityConfig.class, KeycloakRoleConverter.class, CorrelationIdWebFilter.class})
class SecurityIntegrationTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private AuthService authService;

    @Test
    void whenAccessPublicEndpoint_thenSuccess() {
        webTestClient.get()
                .uri("/api/v1/public/info")
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class).isEqualTo("Questo endpoint è pubblico e accessibile a tutti.");
    }

    @Test
    void whenAccessAdminDataWithoutToken_thenUnauthorized() {
        webTestClient.get()
                .uri("/api/v1/admin/data")
                .exchange()
                .expectStatus().isUnauthorized();
    }

    @Test
    void whenAccessAdminDataWithUserRole_thenForbidden() {
        webTestClient.mutateWith(mockJwt()
                        .authorities(new SimpleGrantedAuthority("ROLE_USER")))
                .get()
                .uri("/api/v1/admin/data")
                .exchange()
                .expectStatus().isForbidden();
    }

    @Test
    void whenAccessAdminDataWithAdminRole_thenSuccess() {
        webTestClient.mutateWith(mockJwt()
                        .authorities(new SimpleGrantedAuthority("ROLE_ADMIN")))
                .get()
                .uri("/api/v1/admin/data")
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class).isEqualTo("ACCESSO AUTORIZZATO: Benvenuto Admin!");
    }

    @Test
    void whenAccessUserDataWithUserRole_thenSuccess() {
        webTestClient.mutateWith(mockJwt()
                        .authorities(new SimpleGrantedAuthority("ROLE_USER")))
                .get()
                .uri("/api/v1/user/data")
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class).isEqualTo("ACCESSO AUTORIZZATO: Benvenuto Utente standard!");
    }
}
