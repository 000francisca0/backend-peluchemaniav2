package com.example.servicio_ordenes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.servicio_ordenes.entity.Boleta;
import java.time.LocalDateTime; // <-- AÑADE ESTA IMPORTACIÓN
import java.util.List; // <-- AÑADE ESTA IMPORTACIÓN

public interface BoletaRepository extends JpaRepository<Boleta, Integer> {

    // --- AÑADE ESTE MÉTODO ---
    // Spring creará la consulta:
    // SELECT * FROM boletas WHERE fecha_compra BETWEEN ? AND ?
    List<Boleta> findByFechaCompraBetween(LocalDateTime from, LocalDateTime to);
}