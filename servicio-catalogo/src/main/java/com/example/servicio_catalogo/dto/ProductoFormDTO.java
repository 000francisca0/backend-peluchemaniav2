package com.example.servicio_catalogo.dto;

import lombok.Data;

/**
 * DTO (Data Transfer Object) que representa los datos que el formulario
 * del admin (React) envía al backend al CREAR o EDITAR un producto.
 * * La clave es que acepta 'categoriaId' (un número) en lugar 
 * de un objeto Categoria completo, solucionando el error 400.
 */
@Data // Lombok genera getters, setters, toString, etc.
public class ProductoFormDTO {
    
    // Usamos los mismos nombres de campos que tu React envía
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private String imagenUrl;
    private Boolean onSale;
    private Double discountPercentage;

    // ¡La clave está aquí!
    // Aceptamos el ID de la categoría (un número)
    private Integer categoriaId; 
    
    // No necesitamos constructores, @Data de Lombok se encarga
    // de crear el constructor por defecto y los setters que 
    // Spring usará para "deserializar" el JSON.
}