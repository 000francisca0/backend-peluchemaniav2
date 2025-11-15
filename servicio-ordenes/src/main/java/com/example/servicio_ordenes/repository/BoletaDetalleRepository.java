package com.example.servicio_ordenes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.servicio_ordenes.entity.BoletaDetalle;

public interface BoletaDetalleRepository extends JpaRepository<BoletaDetalle, Integer> {}