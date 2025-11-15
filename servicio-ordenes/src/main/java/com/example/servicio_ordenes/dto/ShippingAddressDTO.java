package com.example.servicio_ordenes.dto;

import lombok.Data;

@Data
public class ShippingAddressDTO {
    private String calle;
    private String depto;
    private String region;
    private String comuna;
}