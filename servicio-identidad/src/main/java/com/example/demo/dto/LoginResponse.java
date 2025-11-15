package com.example.demo.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private Integer id;
    private String nombre;
    private String apellidos;
    private String email;
    private String rol; // El nombre del rol (ej. "Administrador")
    private DireccionDTO direccionDefault;

    // DTO anidado para la dirección
    @Data
    public static class DireccionDTO {
        private String calle;
        private String depto;
        private String region;
        private String comuna;
    }
}