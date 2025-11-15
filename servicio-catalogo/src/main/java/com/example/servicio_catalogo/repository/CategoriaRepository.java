package com.example.servicio_catalogo.repository;

import com.example.servicio_catalogo.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    // No necesitas añadir nada aquí por ahora
}