package com.example.intrumentos.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference; // Importa esta anotación
import jakarta.persistence.*;

@Entity
@Table(name = "pedido_detalle")
public class PedidoDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cantidad")
    private Integer cantidad;

    @ManyToOne(fetch = FetchType.EAGER) // Ajusta el fetch type según tu necesidad, EAGER o LAZY
    @JoinColumn(name = "instrumento_id")
    private Instrumento instrumento;

    @ManyToOne(fetch = FetchType.LAZY) // Generalmente LAZY para relaciones de padre a hijo
    @JoinColumn(name = "pedido_id")
    @JsonBackReference // <--- AÑADE ESTA ANOTACIÓN AQUÍ
    private Pedido pedido; // Referencia al pedido padre

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Instrumento getInstrumento() {
        return instrumento;
    }

    public void setInstrumento(Instrumento instrumento) {
        this.instrumento = instrumento;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }
}