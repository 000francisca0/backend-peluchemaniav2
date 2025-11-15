package com.example.servicio_ordenes.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
    
import com.example.servicio_ordenes.entity.Boleta;
import com.example.servicio_ordenes.service.OrdenesService;
// --- AÑADIMOS LAS IMPORTACIONES ---
import com.example.servicio_ordenes.repository.BoletaRepository;
import org.springframework.web.bind.annotation.RequestParam;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
// --- FIN DE IMPORTACIONES ---

@RestController
@RequestMapping("/api/boletas") // La ruta que tu panel de admin espera
public class BoletaController {

    private final OrdenesService ordenesService;
    private final BoletaRepository boletaRepository; // <-- AÑADIDO

    // --- CONSTRUCTOR MODIFICADO ---
    public BoletaController(OrdenesService ordenesService, BoletaRepository boletaRepository) {
        this.ordenesService = ordenesService;
        this.boletaRepository = boletaRepository; // <-- AÑADIDO
    }

    /**
     * GET /api/boletas
     * Obtiene una lista de TODAS las boletas (para adminBoletas.jsx)
     */
    @GetMapping
    public List<Boleta> getAllBoletas() {
        return ordenesService.findAllBoletas();
    }
    
    /**
     * GET /api/boletas/reporte?from=YYYY-MM-DD&to=YYYY-MM-DD
     * Obtiene boletas filtradas por rango de fecha (para adminReportes.jsx)
     */
    @GetMapping("/reporte")
    public List<Boleta> getBoletasByDateRange(
            @RequestParam(required = false) String from, // Hacemos que sean opcionales
            @RequestParam(required = false) String to) {
        
        // Si no nos dan fechas, devolvemos todo
        if (from == null || to == null || from.isEmpty() || to.isEmpty()) {
            return ordenesService.findAllBoletas();
        }
        
        // Convierte las fechas de String a LocalDateTime
        // 'from' -> YYYY-MM-DD 00:00:00
        // 'to'   -> YYYY-MM-DD 23:59:59
        LocalDateTime fromDate = LocalDate.parse(from).atStartOfDay();
        LocalDateTime toDate = LocalDate.parse(to).atTime(LocalTime.MAX);

        return boletaRepository.findByFechaCompraBetween(fromDate, toDate);
    }
}