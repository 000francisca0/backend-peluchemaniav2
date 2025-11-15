package com.example.servicio_reportes.dto;

import lombok.Data;
import java.time.LocalDateTime;

// Esta clase es una "copia" de la Boleta del servicio de órdenes.
// Es el formato JSON que esperamos recibir.
@Data
public class BoletaDTO {
    private Integer id;
    private Integer usuarioId;
    private LocalDateTime fechaCompra;
    private Double total;
    private String calleEnvio;
    private String deptoEnvio;
    private String regionEnvio;
    private String comunaEnvio;
}