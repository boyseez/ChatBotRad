package it.peoplefirs.chatboot.config;

import org.reactivestreams.Subscription;
import org.slf4j.MDC;
import reactor.core.CoreSubscriber;
import reactor.util.context.Context;

import java.util.Map;

public class MdcContextLifter<T> implements CoreSubscriber<T> {

    private final CoreSubscriber<T> coreSubscriber;

    public MdcContextLifter(CoreSubscriber<T> coreSubscriber) {
        this.coreSubscriber = coreSubscriber;
    }

    @Override
    public Context currentContext() {
        return coreSubscriber.currentContext();
    }

    @Override
    public void onSubscribe(Subscription s) {
        coreSubscriber.onSubscribe(s);
    }

    @Override
    public void onNext(T t) {
        copyToMdc();
        coreSubscriber.onNext(t);
    }

    @Override
    public void onError(Throwable t) {
        copyToMdc();
        coreSubscriber.onError(t);
    }

    @Override
    public void onComplete() {
        copyToMdc();
        coreSubscriber.onComplete();
    }

    private void copyToMdc() {
        Context context = coreSubscriber.currentContext();

        if (context.hasKey("correlationId")) {
            MDC.put("correlationId", context.get("correlationId"));
        }
    }
}
