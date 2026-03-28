package it.peoplefirs.chatboot.config;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Hooks;
import reactor.core.publisher.Operators;

@Component
public class ReactorMdcConfiguration {

    @PostConstruct
    public void setupHooks() {
        Hooks.onEachOperator("MDC_CONTEXT", Operators.lift((scannable, subscriber) ->
                new MdcContextLifter<>(subscriber)
        ));
    }
}
