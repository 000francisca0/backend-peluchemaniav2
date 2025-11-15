package com.example.demo.entity;

// Importa las nuevas clases para relaciones
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "direcciones")
public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String calle;
    private String depto;
    private String region;
    private String comuna;

    // --- RELACIONES ---

    // Relación Muchos-a-Uno: Muchas direcciones pertenecen a un usuario.
    @ManyToOne
    @JoinColumn(name = "usuario_id") // Esto crea la columna 'usuario_id'
    private Usuario usuario;
}