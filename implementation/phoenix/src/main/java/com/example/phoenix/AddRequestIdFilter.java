package com.example.phoenix;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import java.util.UUID;

@Component
public class AddRequestIdFilter extends AbstractGatewayFilterFactory<AddRequestIdFilter.Config> {

    public AddRequestIdFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String requestId = UUID.randomUUID().toString();
            ServerWebExchange modifiedExchange = exchange.mutate()
                    .request(r -> r.headers(headers -> headers.add("jp-request-id", requestId)))
                    .build();
            return chain.filter(modifiedExchange);
        };
    }

    public static class Config {
    }
}