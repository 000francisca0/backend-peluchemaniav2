package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.Direccion;
import java.util.List; // <-- ¡AÑADE ESTA IMPORTACIÓN!

public interface DireccionRepository extends JpaRepository<Direccion, Integer> {
    
    // --- AÑADE ESTE MÉTODO ---
    // Spring creará la consulta: SELECT * FROM direcciones WHERE usuario_id = ?
    List<Direccion> findByUsuarioId(Integer usuarioId);
}