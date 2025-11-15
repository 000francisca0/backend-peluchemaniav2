package com.example.servicio_catalogo.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.servicio_catalogo.entity.Producto;
import org.springframework.stereotype.Repository; // <-- AÑADIR IMPORT

@Repository // <-- AÑADIR ANOTACIÓN
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    
    // Este ya lo tenías (para /on-sale)
    List<Producto> findByOnSale(Boolean onSale);

    // Este lo añadiste (para /category/{id})
    // Spring creará la consulta: SELECT * FROM productos WHERE categoria_id = ?
    List<Producto> findByCategoriaId(Integer categoriaId);

    // --- ¡AQUÍ ESTÁ LA LÍNEA QUE FALTA PARA ARREGLAR ADMINPRODUCTOS! ---
    /**
     * Spring Data JPA crea la consulta automáticamente:
     * "SELECT * FROM producto WHERE stock <= ?"
     * Este es necesario para el endpoint /low-stock
     */
    List<Producto> findByStockLessThanEqual(int stockMinimo);
}