package com.example.servicio_reportes.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Bean // Esto crea la herramienta "RestTemplate" para hacer llamadas HTTP
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}