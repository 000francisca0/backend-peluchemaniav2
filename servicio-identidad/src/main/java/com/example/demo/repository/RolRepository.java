package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Rol;

public interface RolRepository extends JpaRepository<Rol, Integer> {
    // Con solo esto, ya tenemos:
    // save() - (para crear/actualizar roles)
    // findById() - (para buscar por id)
    // findAll() - (para listar todos)
    // deleteById() - (para borrar)
}