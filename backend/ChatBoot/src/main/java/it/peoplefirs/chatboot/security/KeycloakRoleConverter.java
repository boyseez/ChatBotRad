package it.peoplefirs.chatboot.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Converte i ruoli dal JWT di Keycloak in GrantedAuthority di Spring Security.
 * Gestisce correttamente il prefisso ROLE_.
 */
@Component
@Slf4j
public class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    private static final String REALM_ACCESS = "realm_access";
    private static final String ROLES = "roles";
    private static final String ROLE_PREFIX = "ROLE_";

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        log.debug("Estraggo i ruoli dal token per l'utente: {}", jwt.getSubject());
        
        Map<String, Object> realmAccess = jwt.getClaim(REALM_ACCESS);
        if (realmAccess == null || realmAccess.isEmpty()) {
            log.warn("Nessun claim 'realm_access' trovato nel token JWT");
            return List.of();
        }

        @SuppressWarnings("unchecked")
        List<String> roles = (List<String>) realmAccess.get(ROLES);
        if (roles == null) {
            log.warn("Nessun ruolo trovato in 'realm_access.roles'");
            return List.of();
        }

        Collection<GrantedAuthority> authorities = roles.stream()
                .map(String::toUpperCase)
                .map(roleName -> roleName.startsWith(ROLE_PREFIX) ? roleName : ROLE_PREFIX + roleName)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        log.debug("Autorità mappate: {}", authorities);
        return authorities;
    }
}
