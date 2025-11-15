package com.example.servicio_ordenes.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
// ... (otras imports)
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
// --- ¡ASEGÚRATE DE QUE ESTA IMPORTACIÓN NO ESTÉ! ---
// import com.example.servicio_ordenes.entity.Boleta; // ¡Esta línea no va aquí si la clase Boleta está en el mismo paquete!

@Data
@Entity
@Table(name = "boleta_detalles")
public class BoletaDetalle {
    // ... (id, productoId, nombreProducto, etc.)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer productoId;
    private String nombreProducto;
    private Double precioUnitario;
    private Integer cantidad;
    private String imagenUrl;

    @ManyToOne
    @JoinColumn(name = "boleta_id") 
    private Boleta boleta;
}