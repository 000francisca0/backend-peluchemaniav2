package com.example.servicio_ordenes.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Importa el DTO y el Servicio
import com.example.servicio_ordenes.dto.PurchaseRequestDTO;
import com.example.servicio_ordenes.service.OrdenesService;

import java.util.Map; // Para crear el JSON de respuesta

@RestController
@RequestMapping("/api/checkout") // La ruta base que usa tu frontend
public class CheckoutController {

    private final OrdenesService ordenesService;

    // Spring inyecta el servicio que creamos
    public CheckoutController(OrdenesService ordenesService) {
        this.ordenesService = ordenesService;
    }

    /**
     * Este es el endpoint que tu frontend llama para comprar.
     * POST /api/checkout/purchase
     */
    @PostMapping("/purchase")
    public ResponseEntity<?> processPurchase(@RequestBody PurchaseRequestDTO request) {
        try {
            // Validación simple
            if (request.getCartItems() == null || request.getCartItems().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El carrito está vacío."));
            }
            
            // Llama a la lógica de negocio en el servicio
            Integer boletaId = ordenesService.processPurchase(request);

            // Éxito: Devuelve 200 OK con el ID de la boleta
            return ResponseEntity.ok(Map.of("boletaId", boletaId));

        } catch (IllegalArgumentException e) {
            // Error de validación (ej. total 0)
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            // Cualquier otro error (ej. problema de base de datos)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", "Error interno al procesar la compra: " + e.getMessage()));
        }
    }
}