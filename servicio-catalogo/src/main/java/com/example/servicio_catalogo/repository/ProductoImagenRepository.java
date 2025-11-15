package com.example.servicio_catalogo.repository;

import java.util.List; // Importante para el nuevo método
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.servicio_catalogo.entity.ProductoImagen;

public interface ProductoImagenRepository extends JpaRepository<ProductoImagen, Integer> {
    
    // Spring creará la consulta: SELECT * FROM producto_imagenes WHERE producto_id = ?
    List<ProductoImagen> findByProductoId(Integer productoId);
}