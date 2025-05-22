package com.example.intrumentos.Entities;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@Table(name="Pedido")
public class Pedido implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date fechaPedido;

    private Double totalPedido;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true) // Agregado orphanRemoval
    private List<PedidoDetalle> detalles;

    // --- Constructores ---
    public Pedido() {
    }

    public Pedido(Long id, Date fechaPedido, Double totalPedido, List<PedidoDetalle> detalles) {
        this.id = id;
        this.fechaPedido = fechaPedido;
        this.totalPedido = totalPedido;
        this.detalles = detalles;
    }

    public Pedido(Date fechaPedido, Double totalPedido, List<PedidoDetalle> detalles) {
        this.fechaPedido = fechaPedido;
        this.totalPedido = totalPedido;
        this.detalles = detalles;
    }

    // --- Getters ---
    public Long getId() {
        return id;
    }

    public Date getFechaPedido() {
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

    public void setFechaPedido(Date fechaPedido) {
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
        detalle.setPedido(this); // Asegura la relación bidireccional
    }

    public void removeDetalle(PedidoDetalle detalle) {
        if (this.detalles != null) {
            this.detalles.remove(detalle);
            detalle.setPedido(null); // Desvincula
        }
    }
}