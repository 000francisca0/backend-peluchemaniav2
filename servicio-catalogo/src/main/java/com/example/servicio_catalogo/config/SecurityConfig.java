package com.example.servicio_catalogo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    public SecurityConfig() {
        System.out.println("=========================================================");
        System.out.println("### ¡CONFIG DE SEGURIDAD (MODO PERMISIVO) CARGADA! (8085) ###");
        System.out.println("=========================================================");
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Deshabilitar CSRF
            .csrf(AbstractHttpConfigurer::disable)
            
            // 2. --- ¡EL GRAN CAMBIO! ---
            // Le decimos que CUALQUIER RUTA (anyRequest) está PERMITIDA (permitAll)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() 
            )
            
            // 3. Deshabilitar el pop-up de login
            .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }
}