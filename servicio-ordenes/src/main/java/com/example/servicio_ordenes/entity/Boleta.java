package com.example.servicio_ordenes.entity;

// --- ¡AÑADE ESTAS IMPORTACIONES! ---
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
// ---
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "boletas")
public class Boleta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer usuarioId;
    private LocalDateTime fechaCompra = LocalDateTime.now();
    private Double total;

    private String calleEnvio;
    private String deptoEnvio;
    private String regionEnvio;
    private String comunaEnvio;

    // --- ¡AÑADE ESTA RELACIÓN! ---
    // Una Boleta tiene muchos Detalles
    // "mappedBy" le dice a Spring que la 'boleta' en BoletaDetalle es la dueña
    // "CascadeType.ALL" le dice a Spring: "Si guardo esta Boleta, guarda todos sus detalles también"
    @OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL)
    private List<BoletaDetalle> detalles;
    // --- FIN ---
}