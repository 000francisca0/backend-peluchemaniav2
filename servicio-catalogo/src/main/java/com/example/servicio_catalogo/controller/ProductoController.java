package com.example.servicio_catalogo.controller;

import com.example.servicio_catalogo.entity.Producto;
import com.example.servicio_catalogo.service.CatalogoService;
import com.example.servicio_catalogo.dto.ProductoDetalleDTO;
import com.example.servicio_catalogo.dto.ProductoFormDTO; // <-- Importante para el CRUD

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // <-- Importante (para POST, PUT, DELETE)
import java.util.List;
import java.util.Map;

/**
 * Controlador para gestionar todas las operaciones CRUD de Productos.
 * Mapeado a la ruta base "/api/productos"
 */
@RestController
@RequestMapping("/api/productos") 
public class ProductoController {

    private final CatalogoService catalogoService;

    // Inyección de dependencias por constructor
    public ProductoController(CatalogoService catalogoService) {
        this.catalogoService = catalogoService;
    }

    // ===============================================
    // --- ENDPOINTS 'GET' (LEER) ---
    // ===============================================

    /**
     * Obtiene todos los productos.
     * Responde a: GET /api/productos
     */
    @GetMapping
    public List<Producto> getAllProductos() {
        return catalogoService.findAllProductos();
    }
    
    /**
     * Obtiene productos con stock bajo (crítico).
     * Responde a: GET /api/productos/low-stock
     */
    @GetMapping("/low-stock")
    public ResponseEntity<List<Producto>> getLowStockProductos() {
        List<Producto> productosCriticos = catalogoService.findProductosConStockBajo();
        return ResponseEntity.ok(productosCriticos);
    }
    
    /**
     * Obtiene productos marcados como "en oferta".
     * Responde a: GET /api/productos/on-sale
     */
    @GetMapping("/on-sale")
    public List<Producto> getOnSaleProductos() {
        return catalogoService.findOnSaleProductos();
    }

    /**
     * Obtiene productos filtrados por ID de categoría.
     * Responde a: GET /api/productos/category/{categoryId}
     */
    @GetMapping("/category/{categoryId}")
    public List<Producto> getProductosByCategoria(@PathVariable Integer categoryId) {
        return catalogoService.findProductosByCategoria(categoryId);
    }

    /**
     * Obtiene los detalles completos de un solo producto (para la página de detalles).
     * Responde a: GET /api/productos/{id}/details
     */
    @GetMapping("/{id}/details")
    public ResponseEntity<?> getProductoDetails(@PathVariable Integer id) {
        try {
            // El servicio devuelve el DTO con producto + imágenes
            ProductoDetalleDTO detalle = catalogoService.findProductoDetails(id);
            // El frontend espera un objeto { "data": ... }
            return ResponseEntity.ok(Map.of("data", detalle));
        } catch (Exception e) {
            // Maneja el caso de producto no encontrado
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    // ======================================================
    // --- ENDPOINTS CRUD (CREAR, ACTUALIZAR, BORRAR) ---
    // ======================================================

    /**
     * CREAR un nuevo producto.
     * Acepta un DTO (ProductoFormDTO) que coincide con lo que envía React.
     * Responde a: POST /api/productos
     */
    @PostMapping
    public Producto createProducto(@RequestBody ProductoFormDTO productoDTO) {
        // El servicio se encarga de "traducir" el DTO (con categoriaId) 
        // a una entidad Producto (con objeto Categoria)
        return catalogoService.createProducto(productoDTO);
    }

    /**
     * ACTUALIZAR un producto existente.
     * Acepta un DTO (ProductoFormDTO) con los nuevos datos.
     * Responde a: PUT /api/productos/{id}
     */
    @PutMapping("/{id}")
    public Producto updateProducto(@PathVariable Integer id, @RequestBody ProductoFormDTO productoDTO) {
        // El servicio se encarga de buscar el producto y actualizarlo
        return catalogoService.updateProducto(id, productoDTO);
    }

    /**
     * ELIMINAR un producto por su ID.
     * Responde a: DELETE /api/productos/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProducto(@PathVariable Integer id) {
        catalogoService.deleteProducto(id);
        // Devuelve 200 OK (vacío) si tiene éxito
        return ResponseEntity.ok().build();
    }
}