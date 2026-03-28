package it.peoplefirs.chatboot.config;

import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class CorrelationIdWebFilter implements WebFilter {

    public static final String CORRELATION_ID = "correlationId";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {

        String correlationId = exchange.getRequest()
                .getHeaders()
                .getFirst("X-Correlation-Id");

        if (correlationId == null) {
            correlationId = UUID.randomUUID().toString();
        }

        String finalCorrelationId = correlationId;

        return chain.filter(exchange)
                .contextWrite(ctx -> ctx.put(CORRELATION_ID, finalCorrelationId))
                .doFirst(() -> {
                    MDC.put(CORRELATION_ID, finalCorrelationId);
                    MDC.put("service", "chatboot");
                })
                .doFinally(signal -> MDC.clear());
    }
}
