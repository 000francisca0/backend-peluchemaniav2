package com.example.servicio_catalogo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.servicio_catalogo.entity.Categoria;
import com.example.servicio_catalogo.service.CatalogoService;
import java.util.List;

// --- AÑADE ESTAS IMPORTACIONES ---
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;
// --- FIN DE IMPORTACIONES ---

@RestController
@RequestMapping("/api/categorias") // Ruta base para categorías
public class CategoriaController {

    private final CatalogoService catalogoService;

    public CategoriaController(CatalogoService catalogoService) {
        this.catalogoService = catalogoService;
    }

    // GET (Este ya lo tenías)
    @GetMapping
    public List<Categoria> getAllCategorias() {
        return catalogoService.findAllCategorias();
    }
    
    // --- AÑADE LOS NUEVOS ENDPOINTS CRUD ---

    // CREAR (POST /api/categorias)
    @PostMapping
    public Categoria createCategoria(@RequestBody Categoria categoria) {
        return catalogoService.createCategoria(categoria);
    }

    // ACTUALIZAR (PUT /api/categorias/1)
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> updateCategoria(@PathVariable Integer id, @RequestBody Categoria categoriaDetails) {
        try {
            Categoria updatedCategoria = catalogoService.updateCategoria(id, categoriaDetails);
            return ResponseEntity.ok(updatedCategoria);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // BORRAR (DELETE /api/categorias/1)
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteCategoria(@PathVariable Integer id) {
        try {
            catalogoService.deleteCategoria(id);
            return ResponseEntity.ok(Map.of("deleted", true));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}