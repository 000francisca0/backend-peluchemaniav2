package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.RegistroRequest;
import com.example.demo.entity.Usuario;
import com.example.demo.service.AuthService;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;

@RestController // Le dice a Spring que esta clase es un controlador de API REST
@RequestMapping("/api/auth") // Todas las rutas aquí empiezan con /api/auth
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Define el endpoint POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistroRequest registroRequest) {
        try {
            Usuario usuario = authService.registrarUsuario(registroRequest);
            // Si funciona, devolvemos 201 Created (es mejor que 200 OK para registros)
            return new ResponseEntity<>(usuario, HttpStatus.CREATED);

        } catch (Exception e) {
            // Si el email ya existe (de nuestro "throw new Exception...")
            if (e.getMessage().contains("El correo ya está registrado")) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT); // 409 Conflict
            }
            // Cualquier otro error
            return new ResponseEntity<>("Error al registrar: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
        }
    }

    // --- ENDPOINT DE LOGIN (NUEVO) ---
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authService.loginUsuario(loginRequest);
            // Si funciona, devolvemos 200 OK con los datos del usuario
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Si las credenciales son malas
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED); // 401 Unauthorized
        }
    }
}