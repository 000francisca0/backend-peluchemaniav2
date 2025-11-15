package com.example.servicio_ordenes.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // Importa HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    /**
     * Este es el constructor.
     * Imprimirá un mensaje en la terminal SÓLO SI Spring lee este archivo.
     * Esta es nuestra prueba para ver si el servidor está cargando la configuración.
     */
    public SecurityConfig() {
        System.out.println("=====================================================");
        System.out.println("### ¡CONFIG DE SEGURIDAD DE ORDENES CARGADA! (8082) ###");
        System.out.println("=====================================================");
    }

    /**
     * Este es el Bean que configura las reglas de seguridad.
     * Aquí le decimos que permita las rutas de checkout.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Deshabilitar CSRF (necesario para APIs REST)
            .csrf(AbstractHttpConfigurer::disable)
            
            // 2. Definir permisos
            .authorizeHttpRequests(auth -> auth
                // Permitir que CUALQUIERA acceda a las rutas de checkout y boletas
                .requestMatchers("/api/checkout/**").permitAll() 
                .requestMatchers(HttpMethod.GET, "/api/boletas/**").permitAll()
                
                // Pedir autenticación para cualquier otra cosa
                .anyRequest().authenticated()
            )
            
            // 3. Deshabilitar el pop-up de login del navegador
            .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }
}