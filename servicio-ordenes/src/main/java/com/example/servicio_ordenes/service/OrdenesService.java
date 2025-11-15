package com.example.servicio_ordenes.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Tus DTOs (que deberías tener en la carpeta 'dto')
import com.example.servicio_ordenes.dto.CheckoutItemDTO;
import com.example.servicio_ordenes.dto.PurchaseRequestDTO;

// Tus Entidades (de la carpeta 'entity')
import com.example.servicio_ordenes.entity.Boleta;
import com.example.servicio_ordenes.entity.BoletaDetalle;

// Tus Repositorios (de la carpeta 'repository')
import com.example.servicio_ordenes.repository.BoletaRepository;
import com.example.servicio_ordenes.repository.BoletaDetalleRepository;

import java.util.ArrayList; // Importante
import java.util.List;

@Service
public class OrdenesService {

    private final BoletaRepository boletaRepository;
    private final BoletaDetalleRepository boletaDetalleRepository;

    // Spring inyectará los repositorios que ya creamos
    public OrdenesService(BoletaRepository boletaRepository, BoletaDetalleRepository boletaDetalleRepository) {
        this.boletaRepository = boletaRepository;
        this.boletaDetalleRepository = boletaDetalleRepository;
    }

    /**
     * Esta es la lógica principal para procesar una compra.
     */
    @Transactional
    public Integer processPurchase(PurchaseRequestDTO request) throws Exception {
        
        // Calcula el total desde el carrito
        Double total = request.getCartItems().stream()
            .mapToDouble(item -> item.getPrecio() * item.getQuantity())
            .sum();

        if (total <= 0) {
            throw new IllegalArgumentException("El total de la compra debe ser mayor a cero.");
        }

        // 1. Crear la Boleta (aún no guardada)
        Boleta boleta = new Boleta();
        boleta.setUsuarioId(request.getUserId());
        boleta.setTotal(total);
        boleta.setCalleEnvio(request.getShippingAddress().getCalle());
        boleta.setDeptoEnvio(request.getShippingAddress().getDepto());
        boleta.setRegionEnvio(request.getShippingAddress().getRegion());
        boleta.setComunaEnvio(request.getShippingAddress().getComuna());

        // 2. Crear la lista de detalles
        List<BoletaDetalle> detalles = new ArrayList<>();
        for (CheckoutItemDTO item : request.getCartItems()) {
            BoletaDetalle detalle = new BoletaDetalle();
            
            // Asignamos la boleta al detalle (importante para la relación)
            detalle.setBoleta(boleta); 
            
            detalle.setProductoId(item.getId());
            detalle.setNombreProducto(item.getNombre());
            detalle.setPrecioUnitario(item.getPrecio());
            detalle.setCantidad(item.getQuantity());
            detalle.setImagenUrl(item.getImagen());
            
            detalles.add(detalle);
        }
        
        // 3. Asignar la lista de detalles a la boleta
        boleta.setDetalles(detalles);

        // 4. Guardar TODO de una vez
        // (Al guardar la boleta, se guardan los detalles automáticamente)
        Boleta savedBoleta = boletaRepository.save(boleta);
        
        return savedBoleta.getId();
    }
    
    /**
     * Método para que el Admin vea las boletas
     */
    public List<Boleta> findAllBoletas() {
        return boletaRepository.findAll();
    }
}