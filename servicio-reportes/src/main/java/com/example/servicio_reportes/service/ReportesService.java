package com.example.servicio_reportes.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.example.servicio_reportes.dto.BoletaDTO;
import com.example.servicio_reportes.dto.ReporteSalesDTO; // <-- IMPORTA EL NUEVO DTO

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class ReportesService {

    private final RestTemplate restTemplate;

    @Value("${app.services.ordenes_url}")
    private String ordenesServiceUrl;

    public ReportesService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // --- MÉTODO MODIFICADO ---
    // Ahora devuelve el OBJETO de resumen, no la lista
    public ReporteSalesDTO getReporteVentas(Optional<String> from, Optional<String> to) {
        // 1. Define la URL a la que llamaremos (la ruta de reporte en 8082)
        String url = ordenesServiceUrl + "/api/boletas/reporte";

        // 2. Añade los parámetros de fecha si existen
        if (from.isPresent() && to.isPresent() && !from.get().isEmpty() && !to.get().isEmpty()) {
            url += "?from=" + from.get() + "&to=" + to.get();
        }

        // 3. Llama a la API del puerto 8082 y pide la lista de boletas
        BoletaDTO[] boletas = restTemplate.getForObject(url, BoletaDTO[].class);

        // 4. --- LÓGICA DE CÁLCULO ---
        if (boletas == null || boletas.length == 0) {
            // Si no hay boletas, devuelve un resumen en cero
            return new ReporteSalesDTO(0, 0.0);
        }

        // Calcula el total de boletas
        long numeroDeBoletas = boletas.length;
        
        // Calcula el total vendido sumando todos los 'total' de las boletas
        Double totalVendido = Arrays.stream(boletas)
                                    .mapToDouble(BoletaDTO::getTotal)
                                    .sum();

        // 5. Devuelve el objeto de resumen
        return new ReporteSalesDTO(numeroDeBoletas, totalVendido);
    }
}