package com.example.intrumentos.controllers;

import com.example.intrumentos.Entities.Instrumento;
import com.example.intrumentos.Entities.Pedido;
import com.example.intrumentos.Entities.PedidoDetalle;
import com.example.intrumentos.Repository.InstrumentoRepository;
import com.example.intrumentos.Repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime; // <--- CAMBIO IMPORTANTE: Importar LocalDateTime
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {
    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private InstrumentoRepository instrumentoRepository;

    // Endpoint para crear un nuevo pedido
    @PostMapping("/crear")
    public ResponseEntity<Pedido> crearPedido(@RequestBody Pedido pedido) {
        double total = 0;

        // Establece la fecha del pedido usando LocalDateTime.now()
        // LocalDateTime.now() toma la fecha y hora de la JVM sin información de zona horaria explícita,
        // lo cual es lo que queremos para un campo DATETIME en la DB.
        pedido.setFechaPedido(LocalDateTime.now()); // <--- CAMBIO IMPORTANTE

        if (pedido.getDetalles() != null && !pedido.getDetalles().isEmpty()) {
            for (PedidoDetalle detalle : pedido.getDetalles()) {
                Instrumento instrumento = instrumentoRepository.findById(detalle.getInstrumento().getId())
                        .orElseThrow(() -> new RuntimeException("Instrumento no encontrado con ID: " + detalle.getInstrumento().getId()));

                int vendidosActuales = instrumento.getCantidadVendida() != null ? instrumento.getCantidadVendida() : 0;
                instrumento.setCantidadVendida(vendidosActuales + detalle.getCantidad());
                instrumentoRepository.save(instrumento);

                detalle.setInstrumento(instrumento);
                detalle.setPedido(pedido);

                total += instrumento.getPrecio() * detalle.getCantidad();
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        pedido.setTotalPedido(total);

        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        return new ResponseEntity<>(pedidoGuardado, HttpStatus.CREATED);
    }

    // --- NUEVOS ENDPOINTS ---

    @GetMapping
    public ResponseEntity<List<Pedido>> getAllPedidos() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        if (pedidos.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(pedidos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> getPedidoById(@PathVariable Long id) {
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        if (pedido.isPresent()) {
            return new ResponseEntity<>(pedido.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePedido(@PathVariable Long id) {
        if (pedidoRepository.existsById(id)) {
            pedidoRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}