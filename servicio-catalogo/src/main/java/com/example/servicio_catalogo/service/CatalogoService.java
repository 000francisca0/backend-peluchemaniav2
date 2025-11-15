package com.example.servicio_catalogo.service;

// Imports de Entidades
import com.example.servicio_catalogo.entity.Producto;
import com.example.servicio_catalogo.entity.Categoria; 
import com.example.servicio_catalogo.entity.ProductoImagen;

// Imports de Repositorios
import com.example.servicio_catalogo.repository.ProductoRepository;
import com.example.servicio_catalogo.repository.CategoriaRepository;
import com.example.servicio_catalogo.repository.ProductoImagenRepository;

// Imports de DTOs
import com.example.servicio_catalogo.dto.ProductoDetalleDTO;
import com.example.servicio_catalogo.dto.ProductoFormDTO; 

// Imports de Spring y Java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.lang.RuntimeException; // Para las excepciones

@Service
public class CatalogoService {

    // --- Inyección de Dependencias ---
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoImagenRepository productoImagenRepository; 

    // Constante para stock bajo
    private static final int STOCK_CRITICO = 10;
    
    // =======================================================
    // --- MÉTODOS DE PRODUCTO (LEER) ---
    // =======================================================
    
    /**
     * Devuelve todos los productos.
     * (Para GET /api/productos)
     */
    public List<Producto> findAllProductos() { 
        return productoRepository.findAll();
    }
    
    /**
     * Devuelve productos en oferta.
     * (Para GET /api/productos/on-sale)
     */
    public List<Producto> findOnSaleProductos() { 
        // Asume que findByOnSale existe en ProductoRepository
        return productoRepository.findByOnSale(true); 
    }
    
    /**
     * Devuelve productos por ID de categoría.
     * (Para GET /api/productos/category/{id})
     */
    public List<Producto> findProductosByCategoria(Integer categoryId) { 
        // Asume que findByCategoriaId existe en ProductoRepository
        return productoRepository.findByCategoriaId(categoryId); 
    }

    /**
     * Devuelve productos con stock bajo.
     * (Para GET /api/productos/low-stock)
     */
    public List<Producto> findProductosConStockBajo() {
        // Asume que findByStockLessThanEqual existe en ProductoRepository
        return productoRepository.findByStockLessThanEqual(STOCK_CRITICO);
    }
    
    /**
     * Devuelve los detalles de un producto (incluyendo imágenes).
     * (Para GET /api/productos/{id}/details)
     */
    public ProductoDetalleDTO findProductoDetails(Integer id) {
        // 1. Buscar el producto
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));

        // 2. Buscar las imágenes asociadas
        List<ProductoImagen> imagenes = productoImagenRepository.findByProductoId(id);

        // 3. Usar el constructor del DTO para combinar la info
        return new ProductoDetalleDTO(producto, imagenes);
    }
    
    // =======================================================
    // --- MÉTODOS DE PRODUCTO (ESCRIBIR: C-U-D) ---
    // =======================================================

    /**
     * CREAR un nuevo producto (usando el DTO).
     * El controlador llama a este método.
     */
    public Producto createProducto(ProductoFormDTO dto) {
        Producto producto = new Producto();
        
        // 1. Buscar la entidad Categoria usando el categoriaId del DTO
        if (dto.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + dto.getCategoriaId()));
            producto.setCategoria(categoria);
        }

        // 2. Copiar el resto de los campos del DTO a la entidad
        producto.setNombre(dto.getNombre());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        producto.setDescripcion(dto.getDescripcion());
        producto.setImagenUrl(dto.getImagenUrl());
        producto.setOnSale(dto.getOnSale());
        producto.setDiscountPercentage(dto.getDiscountPercentage());

        // 3. Guardar la nueva entidad Producto
        return productoRepository.save(producto);
    }

    /**
     * ACTUALIZAR un producto existente (usando el DTO).
     * El controlador llama a este método.
     */
    public Producto updateProducto(Integer id, ProductoFormDTO dto) {
        // 1. Buscar el producto que ya existe
        Producto productoExistente = productoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
        
        // 2. Buscar la entidad Categoria (si cambió)
        if (dto.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + dto.getCategoriaId()));
            productoExistente.setCategoria(categoria);
        } else {
            productoExistente.setCategoria(null); // Permite desasignar categoría
        }

        // 3. Copiar el resto de los campos del DTO a la entidad
        productoExistente.setNombre(dto.getNombre());
        productoExistente.setPrecio(dto.getPrecio());
        productoExistente.setStock(dto.getStock());
        productoExistente.setDescripcion(dto.getDescripcion());
        productoExistente.setImagenUrl(dto.getImagenUrl());
        productoExistente.setOnSale(dto.getOnSale());
        productoExistente.setDiscountPercentage(dto.getDiscountPercentage());

        // 4. Guardar los cambios en la entidad existente
        return productoRepository.save(productoExistente);
    }

    /**
     * ELIMINAR un producto de la BD.
     * El controlador llama a este método.
     */
    public void deleteProducto(Integer id) {
        // 1. Buscar el producto
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
        
        // 2. Borramos las imágenes asociadas primero (Buena práctica)
        List<ProductoImagen> imagenes = productoImagenRepository.findByProductoId(id);
        if (imagenes != null && !imagenes.isEmpty()) {
            productoImagenRepository.deleteAll(imagenes);
        }
        
        // 3. Ahora sí, borramos el producto
        productoRepository.delete(producto);
    }

    // =======================================================
    // --- MÉTODOS DE CATEGORIA (CRUD Completo) ---
    // =======================================================

    /**
     * Devuelve todas las categorías.
     * (Para GET /api/categorias)
     */
    public List<Categoria> findAllCategorias() {
        return categoriaRepository.findAll();
    }

    /**
     * Crea una nueva categoría.
     * (Para POST /api/categorias)
     */
    public Categoria createCategoria(Categoria categoria) {
        // Aquí no usamos DTO porque la entidad Categoria es simple
        return categoriaRepository.save(categoria);
    }

    /**
     * Actualiza una categoría existente.
     * (Para PUT /api/categorias/{id})
     */
    public Categoria updateCategoria(Integer id, Categoria categoriaDetails) {
        // 1. Buscar la categoría
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + id));
        
        // 2. Actualizar campos
        categoria.setNombre(categoriaDetails.getNombre());
        // (Añade más campos si los tienes, ej: categoria.setDescripcion(...))
        
        // 3. Guardar
        return categoriaRepository.save(categoria);
    }

    /**
     * Elimina una categoría por su ID.
     * (Para DELETE /api/categorias/{id})
     */
    public void deleteCategoria(Integer id) {
        // 1. Verificar que existe
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + id));
        
        // 2. Eliminar
        // (CUIDADO: Si tienes productos con esta categoría, esto podría fallar
        // si no tienes 'ON DELETE SET NULL' en tu base de datos)
        categoriaRepository.delete(categoria);
    }
}
