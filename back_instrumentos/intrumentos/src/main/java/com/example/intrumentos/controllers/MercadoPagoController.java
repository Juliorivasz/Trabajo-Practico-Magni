package com.example.intrumentos.controllers;

import com.example.intrumentos.Entities.Pedido;
import com.example.intrumentos.Entities.PreferenceMP;
import com.example.intrumentos.services.MercadoPagoService;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MercadoPagoController {

    private final MercadoPagoService mercadoPagoService;

    @Autowired
    public MercadoPagoController(MercadoPagoService mercadoPagoService) {
        this.mercadoPagoService = mercadoPagoService;
    }

    @PostMapping("/create_preference_mp")
    public ResponseEntity<PreferenceMP> crearPreferenciaMercadoPago(@RequestBody Pedido pedido) {
        try {
            PreferenceMP preference = mercadoPagoService.crearPreferencia(pedido);
            if (preference != null && preference.getId() != null) {
                System.out.println("Created preference with ID: " + preference.getId());
                return ResponseEntity.ok(preference);
            } else {
                System.err.println("Failed to create preference - no ID returned");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (MPException | MPApiException e) {
            System.err.println("Error creating Mercado Pago preference: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
