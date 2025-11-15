package com.example.servicio_catalogo.dto;

import com.example.servicio_catalogo.entity.Categoria;
import com.example.servicio_catalogo.entity.Producto;
import com.example.servicio_catalogo.entity.ProductoImagen; // Importa ProductoImagen
import lombok.Data;
import java.util.List;
import java.util.stream.Collectors;

@Data // Lombok nos da getters y setters
public class ProductoDetalleDTO {
    
    // Campos del Producto
    private Integer id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private Categoria categoria;
    private Boolean onSale;
    private Double discountPercentage;

    // Lista de imágenes
    private List<String> images; // Tu React espera un campo "images"

    /**
     * Constructor para crear este DTO a partir de un Producto y su lista de imágenes.
     */
    public ProductoDetalleDTO(Producto producto, List<ProductoImagen> imagenes) {
        this.id = producto.getId();
        this.nombre = producto.getNombre();
        this.descripcion = producto.getDescripcion();
        this.precio = producto.getPrecio();
        this.stock = producto.getStock();
        this.categoria = producto.getCategoria(); // El objeto Categoria completo
        this.onSale = producto.getOnSale();
        this.discountPercentage = producto.getDiscountPercentage();

        // Convertimos la lista de objetos ProductoImagen a una lista de Strings (URLs)
        this.images = imagenes.stream()
                              .map(ProductoImagen::getImagenUrl) // Extrae solo la URL
                              .collect(Collectors.toList());
        
        // BACKUP: Si no hay imágenes en la tabla 'producto_imagenes',
        // usamos la 'imagenUrl' principal de la tabla 'productos'.
        if (this.images.isEmpty() && producto.getImagenUrl() != null) {
            this.images.add(producto.getImagenUrl());
        }
    }
}