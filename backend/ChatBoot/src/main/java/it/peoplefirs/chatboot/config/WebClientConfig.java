package it.peoplefirs.chatboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .filter((request, next) ->
                        Mono.deferContextual(ctx -> {

                            String correlationId = ctx.getOrDefault("correlationId", "N/A");

                            return next.exchange(
                                    ClientRequest.from(request)
                                            .header("X-Correlation-Id", correlationId)
                                            .build()
                            );
                        })
                )
                .build();
    }
}
