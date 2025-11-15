package com.example.servicio_catalogo.entity; // <--- ESTA ES LA LÍNEA CORREGIDA

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;
    private String descripcion;
    private Double precio; // 'REAL' se mapea a Double
    private Integer stock;
    private String imagenUrl;

    @ManyToOne
    @JoinColumn(name = "categoria_id") // La llave foránea
    private Categoria categoria;
    
    private Boolean onSale;
    private Double discountPercentage;
}