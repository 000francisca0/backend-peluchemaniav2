package com.example.servicio_ordenes.dto;

import lombok.Data;

@Data
public class CheckoutItemDTO {
    private Integer id; // ID del producto
    private String nombre;
    private Double precio;
    private Integer quantity;
    private String imagen;
}