package com.example.intrumentos.Entities;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime; // <--- CAMBIO IMPORTANTE: Importar LocalDateTime
import java.util.List;

@Entity
@Table(name="Pedido")
public class Pedido implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // AÑADIR @Temporal(TemporalType.TIMESTAMP) AQUI NO ES NECESARIO CON LocalDateTime.
    // JPA 2.2+ (con Spring Boot 3.x) mapea LocalDateTime a DATETIME/TIMESTAMP automáticamente.
    private LocalDateTime fechaPedido; // <--- CAMBIO IMPORTANTE: Tipo a LocalDateTime

    private Double totalPedido;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoDetalle> detalles;

    // --- Constructores ---
    public Pedido() {
    }

    public Pedido(Long id, LocalDateTime fechaPedido, Double totalPedido, List<PedidoDetalle> detalles) {
        this.id = id;
        this.fechaPedido = fechaPedido;
        this.totalPedido = totalPedido;
        this.detalles = detalles;
    }

    public Pedido(LocalDateTime fechaPedido, Double totalPedido, List<PedidoDetalle> detalles) {
        this.fechaPedido = fechaPedido;
        this.totalPedido = totalPedido;
        this.detalles = detalles;
    }

    // --- Getters ---
    public Long getId() {
        return id;
    }

    public LocalDateTime getFechaPedido() { // <--- CAMBIO: Getter retorna LocalDateTime
        return fechaPedido;
    }

    public Double getTotalPedido() {
        return totalPedido;
    }

    public List<PedidoDetalle> getDetalles() {
        return detalles;
    }

    // --- Setters ---
    public void setId(Long id) {
        this.id = id;
    }

    public void setFechaPedido(LocalDateTime fechaPedido) { // <--- CAMBIO: Setter recibe LocalDateTime
        this.fechaPedido = fechaPedido;
    }

    public void setTotalPedido(Double totalPedido) {
        this.totalPedido = totalPedido;
    }

    public void setDetalles(List<PedidoDetalle> detalles) {
        this.detalles = detalles;
    }

    // Métodos de conveniencia para añadir/remover detalles
    public void addDetalle(PedidoDetalle detalle) {
        if (this.detalles == null) {
            this.detalles = new java.util.ArrayList<>();
        }
        this.detalles.add(detalle);
        detalle.setPedido(this);
    }

    public void removeDetalle(PedidoDetalle detalle) {
        if (this.detalles != null) {
            this.detalles.remove(detalle);
            detalle.setPedido(null);
        }
    }
}