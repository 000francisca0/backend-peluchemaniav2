package com.example.demo.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.Direccion;
import com.example.demo.entity.Rol;
import com.example.demo.entity.Usuario;
import com.example.demo.dto.RegistroRequest;
import com.example.demo.dto.LoginRequest;  // Importar DTO de Login
import com.example.demo.dto.LoginResponse; // Importar DTO de Login
import com.example.demo.repository.DireccionRepository;
import com.example.demo.repository.RolRepository;
import com.example.demo.repository.UsuarioRepository;

import java.util.List; // Importar List
import java.util.Optional; // Importar Optional

@Service // Marca esto como una clase de servicio
public class AuthService {

    // Inyectamos todos los componentes que necesitamos
    private final UsuarioRepository usuarioRepository;
    private final DireccionRepository direccionRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository, DireccionRepository direccionRepository,
                       RolRepository rolRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.direccionRepository = direccionRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Lógica para el endpoint POST /api/auth/register
     */
    @Transactional // Asegura que si algo falla, se hace un "ROLLBACK"
    public Usuario registrarUsuario(RegistroRequest request) throws Exception {
        
        // 1. Revisar si el email ya existe
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            // Lanzamos una excepción que el controlador atrapará
            throw new Exception("El correo ya está registrado.");
        }

        // 2. Buscar el rol "Cliente" (ID 2, según nuestro Seeder)
        Rol rolCliente = rolRepository.findById(2).orElseThrow(() -> new Exception("Rol 'Cliente' no encontrado"));

        // 3. Crear el nuevo usuario
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(request.getNombre());
        nuevoUsuario.setApellidos(request.getApellidos());
        nuevoUsuario.setEmail(request.getEmail());
        nuevoUsuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        nuevoUsuario.setRol(rolCliente);

        // Guardamos el usuario para obtener su ID
        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

        // 4. Crear la dirección
        Direccion nuevaDireccion = new Direccion();
        nuevaDireccion.setCalle(request.getCalle());
        nuevaDireccion.setDepto(request.getDepto());
        nuevaDireccion.setRegion(request.getRegion());
        nuevaDireccion.setComuna(request.getComuna());
        nuevaDireccion.setUsuario(usuarioGuardado); // Lo asignamos al usuario recién creado

        // Guardamos la dirección
        direccionRepository.save(nuevaDireccion);

        return usuarioGuardado;
    }

    /**
     * Lógica para el endpoint POST /api/auth/login
     * (Esta es la versión CORREGIDA Y RÁPIDA)
     */
    public LoginResponse loginUsuario(LoginRequest request) throws Exception {
    
        // 1. Buscar al usuario por email
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new Exception("Credenciales incorrectas."));

        // 2. Comparar la contraseña (usando el PasswordEncoder)
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new Exception("Credenciales incorrectas.");
        }

        // 3. Si todo está OK, construir la respuesta
        LoginResponse response = new LoginResponse();
        response.setId(usuario.getId());
        response.setNombre(usuario.getNombre());
        response.setApellidos(usuario.getApellidos());
        response.setEmail(usuario.getEmail());
        response.setRol(usuario.getRol().getNombre()); // Obtenemos el nombre del rol

        // 4. Buscar su dirección por defecto (usando el método rápido del repo)
        List<Direccion> direcciones = direccionRepository.findByUsuarioId(usuario.getId());

        if (!direcciones.isEmpty()) {
            Direccion dir = direcciones.get(0); // Tomamos la primera dirección
            LoginResponse.DireccionDTO dirDto = new LoginResponse.DireccionDTO();
            dirDto.setCalle(dir.getCalle());
            dirDto.setDepto(dir.getDepto());
            dirDto.setRegion(dir.getRegion());
            dirDto.setComuna(dir.getComuna());
            response.setDireccionDefault(dirDto);
        }

        return response;
    }
}