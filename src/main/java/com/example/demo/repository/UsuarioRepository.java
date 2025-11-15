package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Usuario;

import java.util.Optional; // Importante para búsquedas que pueden no devolver nada

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // Spring Data JPA es tan inteligente que si defines un método
    // llamado "findByEmail", ¡automáticamente crea la consulta SQL
    // "SELECT * FROM usuarios WHERE email = ?" por ti!
    Optional<Usuario> findByEmail(String email);
}