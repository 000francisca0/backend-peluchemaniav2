package com.example.servicio_ordenes.dto;

import lombok.Data;
import java.util.List;

@Data
public class PurchaseRequestDTO {
    private Integer userId;
    private List<CheckoutItemDTO> cartItems;
    private ShippingAddressDTO shippingAddress;
}