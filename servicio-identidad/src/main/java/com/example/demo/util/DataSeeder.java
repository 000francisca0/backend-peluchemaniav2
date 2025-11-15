package com.example.demo.util;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.entity.Direccion;
import com.example.demo.entity.Rol;
import com.example.demo.entity.Usuario;
import com.example.demo.repository.DireccionRepository;
import com.example.demo.repository.RolRepository;
import com.example.demo.repository.UsuarioRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final DireccionRepository direccionRepository;
    private final PasswordEncoder passwordEncoder;

    // Spring inyectará automáticamente los repositorios y el 
    // PasswordEncoder que acabamos de crear.
    public DataSeeder(RolRepository rolRepository, UsuarioRepository usuarioRepository,
                      DireccionRepository direccionRepository, PasswordEncoder passwordEncoder) {
        this.rolRepository = rolRepository;
        this.usuarioRepository = usuarioRepository;
        this.direccionRepository = direccionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Usamos .count() para ver si ya hay datos
        if (rolRepository.count() == 0) {
            System.out.println("🌱 Poblando roles...");
            Rol adminRol = new Rol();
            adminRol.setNombre("Administrador");
            rolRepository.save(adminRol); // Guarda el rol admin

            Rol clienteRol = new Rol();
            clienteRol.setNombre("Cliente");
            rolRepository.save(clienteRol); // Guarda el rol cliente
        }

        if (usuarioRepository.count() == 0) {
            System.out.println("🌱 Poblando usuario administrador...");

            // Buscamos el rol "Administrador" que acabamos de crear
            Rol adminRol = rolRepository.findAll().get(0); // Simplificación, tomamos el primero

            Usuario adminUsuario = new Usuario();
            adminUsuario.setNombre("Admin");
            adminUsuario.setApellidos("Principal");
            adminUsuario.setEmail("admin@duoc.cl");
            adminUsuario.setRol(adminRol); // Asignamos el rol

            // Encriptamos la contraseña "admin123"
            adminUsuario.setPasswordHash(passwordEncoder.encode("admin123"));

            usuarioRepository.save(adminUsuario); // Guardamos el usuario

            // Creamos la dirección para el admin
            Direccion adminDireccion = new Direccion();
            adminDireccion.setCalle("Av. Siempre Viva 742");
            adminDireccion.setDepto("Oficina 101");
            adminDireccion.setRegion("Región Metropolitana de Santiago");
            adminDireccion.setComuna("Santiago");
            adminDireccion.setUsuario(adminUsuario); // Asignamos el usuario a la dirección

            direccionRepository.save(adminDireccion); // Guardamos la dirección
        }

        System.out.println("✅ Seeding completo.");
    }
}