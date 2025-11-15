package com.example.servicio_reportes.dto;

import lombok.Data;

@Data // Esto nos da getters y setters
public class ReporteSalesDTO {
    
    // Estos nombres coinciden con los que busca tu adminReportes.jsx
    private long num_boletas;
    private Double total_vendido;

    // Constructor para facilidad de uso
    public ReporteSalesDTO(long num_boletas, Double total_vendido) {
        this.num_boletas = num_boletas;
        this.total_vendido = total_vendido;
    }
}