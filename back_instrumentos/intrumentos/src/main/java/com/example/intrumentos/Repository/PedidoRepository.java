package com.example.intrumentos.Repository;

import com.example.intrumentos.Entities.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime; // <--- CAMBIO IMPORTANTE: Importar LocalDateTime
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    // Este método buscará pedidos cuya fecha_pedido esté entre startDate y endDate
    // Los parámetros ahora son LocalDateTime
    List<Pedido> findByFechaPedidoBetween(LocalDateTime startDate, LocalDateTime endDate); // <--- CAMBIO IMPORTANTE
}