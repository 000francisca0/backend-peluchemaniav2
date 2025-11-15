package com.example.servicio_catalogo.util;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.servicio_catalogo.entity.Categoria;
import com.example.servicio_catalogo.entity.Producto;
import com.example.servicio_catalogo.repository.CategoriaRepository;
import com.example.servicio_catalogo.repository.ProductoRepository;

@Component
public class CatalogoDataSeeder implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    public CatalogoDataSeeder(CategoriaRepository categoriaRepository, ProductoRepository productoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        Categoria catOsos = null;
        Categoria catAnimales = null;
        Categoria catFantasia = null;

        // 1. POBLAR CATEGORÍAS
        if (categoriaRepository.count() == 0) {
            System.out.println("🌱 Poblando categorías...");
            
            Categoria c1 = new Categoria();
            c1.setNombre("Osos");
            catOsos = categoriaRepository.save(c1); // Guarda y asigna

            Categoria c2 = new Categoria();
            c2.setNombre("Animales");
            catAnimales = categoriaRepository.save(c2); // Guarda y asigna

            Categoria c3 = new Categoria();
            c3.setNombre("Fantasía");
            catFantasia = categoriaRepository.save(c3); // Guarda y asigna
        } else {
            // Si ya existen, solo las buscamos
            catOsos = categoriaRepository.findById(1).orElse(null);
            catAnimales = categoriaRepository.findById(2).orElse(null);
            catFantasia = categoriaRepository.findById(3).orElse(null);
        }

        // 2. POBLAR PRODUCTOS
        if (productoRepository.count() == 0) {
            System.out.println("🌱 Poblando 6 productos...");

            // --- Producto 1 (EN OFERTA) ---
            Producto p1 = new Producto();
            p1.setNombre("Oso Clásico de Peluche");
            p1.setDescripcion("El clásico y fiel amigo de peluche.");
            p1.setPrecio(19990.0);
            p1.setStock(15);
            p1.setImagenUrl("/osito.jpg");
            p1.setCategoria(catOsos);
            p1.setOnSale(true); // ¡En oferta!
            p1.setDiscountPercentage(0.25);
            productoRepository.save(p1);

            // --- Producto 2 (EN OFERTA) ---
            Producto p2 = new Producto();
            p2.setNombre("Conejo Saltarin Suave");
            p2.setDescripcion("Ideal para abrazar, orejas largas.");
            p2.setPrecio(15990.0);
            p2.setStock(22);
            p2.setImagenUrl("/conejo.jpg");
            p2.setCategoria(catAnimales);
            p2.setOnSale(true); // ¡En oferta!
            p2.setDiscountPercentage(0.10); // Démosle un 10%
            productoRepository.save(p2);

            // --- Producto 3 (Dinosaurio - NO en oferta) ---
            Producto p3 = new Producto();
            p3.setNombre("Dinosaurio Rex Amigable");
            p3.setDescripcion("Un T-Rex muy amigable.");
            p3.setPrecio(22990.0);
            p3.setStock(5);
            p3.setImagenUrl("/dinosaurio.jpg");
            p3.setCategoria(catAnimales);
            p3.setOnSale(false);
            p3.setDiscountPercentage(0.10);
            productoRepository.save(p3);

            // --- Producto 4 (Unicornio - NO en oferta) ---
            Producto p4 = new Producto();
            p4.setNombre("Unicornio Mágico Brillante");
            p4.setDescripcion("Brilla con magia.");
            p4.setPrecio(24990.0);
            p4.setStock(8);
            p4.setImagenUrl("/unicornio.jpg");
            p4.setCategoria(catFantasia);
            p4.setOnSale(false);
            p4.setDiscountPercentage(0.15);
            productoRepository.save(p4);
            
            // --- Producto 5 (Panda - NO en oferta) ---
            Producto p5 = new Producto();
            p5.setNombre("Panda");
            p5.setDescripcion("Panda de bambú suave.");
            p5.setPrecio(18990.0);
            p5.setStock(12);
            p5.setImagenUrl("/panda.jpg");
            p5.setCategoria(catOsos); // Categoría Osos (según tu data original)
            p5.setOnSale(false);
            p5.setDiscountPercentage(0.20);
            productoRepository.save(p5);
            
            // --- Producto 6 (Perezoso - EN OFERTA) ---
            Producto p6 = new Producto();
            p6.setNombre("Perezoso");
            p6.setDescripcion("Para abrazos lentos.");
            p6.setPrecio(21990.0);
            p6.setStock(10);
            p6.setImagenUrl("/peresozo.jpg"); // Asumo que el nombre de archivo es este
            p6.setCategoria(catAnimales);
            p6.setOnSale(true); // ¡En oferta!
            p6.setDiscountPercentage(0.30); // Démosle un 30%
            productoRepository.save(p6);
        }

        System.out.println("✅ Seeding de catálogo completo.");
    }
}