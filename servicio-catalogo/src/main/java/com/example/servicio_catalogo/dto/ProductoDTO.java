package com.example.servicio_catalogo.dto;

import lombok.Data;

// Este DTO recibirá los datos del formulario de admin de React
@Data
public class ProductoDTO {
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private String imagenUrl;
    
    // Aquí está la clave: React envía 'categoria_id'
    // Nosotros lo recibimos como 'categoriaId' (Spring lo mapea)
    private Integer categoriaId; 
    
    private Boolean onSale;
    private Double discountPercentage;
}