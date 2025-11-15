package com.example.demo.config; // O tu paquete correspondiente

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// Imports para el nuevo método
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

// Imports para el método que ya tenías
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
public class SecurityConfig {

    /**
     * Este Bean crea el encriptador de contraseñas (bcrypt).
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        // Este método ya lo tenías
        return new BCryptPasswordEncoder();
    }

    /**
     * Este Bean configura la seguridad de tus rutas HTTP.
     * Aquí es donde deshabilitamos el pop-up y hacemos públicas las rutas.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Deshabilitar CSRF (necesario para APIs REST)
            .csrf(AbstractHttpConfigurer::disable)
            
            // 2. Definir permisos para las rutas
            .authorizeHttpRequests(auth -> auth
                // Permitir que CUALQUIERA (permitAll) se registre o inicie sesión
                .requestMatchers("/api/auth/register").permitAll()
                .requestMatchers("/api/auth/login").permitAll()
                
                // Pedir autenticación para cualquier otra ruta
                .anyRequest().authenticated()
            )
            
            // 3. Deshabilitar el pop-up de autenticación básica del navegador
            .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }
}