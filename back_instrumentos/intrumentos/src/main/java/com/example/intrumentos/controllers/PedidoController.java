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

import java.util.Date;
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

        pedido.setFechaPedido(new Date()); // Establece la fecha del pedido

        if (pedido.getDetalles() != null && !pedido.getDetalles().isEmpty()) { // Añadido check de .isEmpty()
            for (PedidoDetalle detalle : pedido.getDetalles()) {
                // Busca el instrumento por su ID
                Instrumento instrumento = instrumentoRepository.findById(detalle.getInstrumento().getId())
                        .orElseThrow(() -> new RuntimeException("Instrumento no encontrado con ID: " + detalle.getInstrumento().getId()));

                // Actualiza la cantidad vendida del instrumento
                int vendidosActuales = instrumento.getCantidadVendida() != null ? instrumento.getCantidadVendida() : 0;
                instrumento.setCantidadVendida(vendidosActuales + detalle.getCantidad());
                instrumentoRepository.save(instrumento); // Guarda el instrumento actualizado

                detalle.setInstrumento(instrumento); // Asigna la instancia completa del instrumento
                detalle.setPedido(pedido); // Vincula el detalle al pedido padre

                total += instrumento.getPrecio() * detalle.getCantidad();
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Si no hay detalles
        }

        pedido.setTotalPedido(total); // Calcula y establece el total

        Pedido pedidoGuardado = pedidoRepository.save(pedido); // Guarda el pedido completo

        return new ResponseEntity<>(pedidoGuardado, HttpStatus.CREATED); // Devuelve el pedido guardado
    }

    // --- NUEVOS ENDPOINTS ---

    // Endpoint para obtener todos los pedidos
    @GetMapping // Por defecto en /api/pedidos
    public ResponseEntity<List<Pedido>> getAllPedidos() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        if (pedidos.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Código 204 si no hay contenido
        }
        return new ResponseEntity<>(pedidos, HttpStatus.OK); // Código 200 con la lista de pedidos
    }

    // Endpoint para obtener un pedido por su ID
    @GetMapping("/{id}") // Ejemplo: /api/pedidos/1
    public ResponseEntity<Pedido> getPedidoById(@PathVariable Long id) { // Usar Long para ID de BBDD
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        if (pedido.isPresent()) {
            return new ResponseEntity<>(pedido.get(), HttpStatus.OK); // Código 200 con el pedido
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Código 404 si no se encuentra
        }
    }

    // Endpoint para eliminar un pedido por su ID
    @DeleteMapping("/{id}") // Ejemplo: /api/pedidos/1
    public ResponseEntity<Void> deletePedido(@PathVariable Long id) { // Usar Long para ID de BBDD
        if (pedidoRepository.existsById(id)) {
            pedidoRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Código 204 si la eliminación fue exitosa
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Código 404 si no se encuentra
        }
    }
}