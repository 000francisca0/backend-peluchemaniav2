package com.example.demo.dto;

import lombok.Data;

@Data // Lombok nos crea getters/setters
public class RegistroRequest {
    // Coincide con tu JSON de Node
    private String nombre;
    private String apellidos;
    private String email;
    private String password;

    // Datos de la dirección
    private String calle;
    private String depto;
    private String region;
    private String comuna;
}