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
@Table(name = "producto_imagenes")
public class ProductoImagen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String imagenUrl;
    private Integer orden;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;
}