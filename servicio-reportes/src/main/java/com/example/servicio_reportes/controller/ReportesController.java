package com.example.servicio_reportes.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
// Importamos el DTO de respuesta
import com.example.servicio_reportes.dto.ReporteSalesDTO; 
import com.example.servicio_reportes.service.ReportesService;
    
import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/reportes")
public class ReportesController {

    private final ReportesService reportesService;

    public ReportesController(ReportesService reportesService) {
        this.reportesService = reportesService;
    }

    // --- ENDPOINT MODIFICADO ---
    // Ahora devuelve un ReporteSalesDTO, no una List<BoletaDTO>
    @GetMapping("/sales")
    public ReporteSalesDTO getReporteVentas(
            @RequestParam Optional<String> from,
            @RequestParam Optional<String> to) {
        
        // Pasa las fechas al servicio
        return reportesService.getReporteVentas(from, to);
    }

    // --- ENDPOINT /top-products (sigue pendiente) ---
    @GetMapping("/top-products")
    public List<?> getTopProducts(
            @RequestParam Optional<String> from,
            @RequestParam Optional<String> to) {
        
        // TODO: Implementar esta lógica más adelante
        return List.of(); 
    }
}