package com.example.intrumentos.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "instrumento")
public class Instrumento implements Serializable { // Implementar Serializable es buena práctica
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String instrumento;
    private String marca;
    private String modelo;
    private String imagen;
    private Double precio;

    @Column(name = "costo_envio")
    private String costoEnvio;

    @Column(name = "cantidad_vendida")
    private Integer cantidadVendida;

    @Column(length = 2000)
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    @JsonIgnoreProperties("instrumentos")
    private CategoriaInstrumento categoria;

    // --- Constructores ---
    public Instrumento() {
    }

    public Instrumento(Long id, String instrumento, String marca, String modelo, String imagen, Double precio,
                       String costoEnvio, Integer cantidadVendida, String descripcion, CategoriaInstrumento categoria) {
        this.id = id;
        this.instrumento = instrumento;
        this.marca = marca;
        this.modelo = modelo;
        this.imagen = imagen;
        this.precio = precio;
        this.costoEnvio = costoEnvio;
        this.cantidadVendida = cantidadVendida;
        this.descripcion = descripcion;
        this.categoria = categoria;
    }

    public Instrumento(String instrumento, String marca, String modelo, String imagen, Double precio,
                       String costoEnvio, Integer cantidadVendida, String descripcion, CategoriaInstrumento categoria) {
        this.instrumento = instrumento;
        this.marca = marca;
        this.modelo = modelo;
        this.imagen = imagen;
        this.precio = precio;
        this.costoEnvio = costoEnvio;
        this.cantidadVendida = cantidadVendida;
        this.descripcion = descripcion;
        this.categoria = categoria;
    }

    // --- Getters ---
    public Long getId() {
        return id;
    }

    public String getInstrumento() {
        return instrumento;
    }

    public String getMarca() {
        return marca;
    }

    public String getModelo() {
        return modelo;
    }

    public String getImagen() {
        return imagen;
    }

    public Double getPrecio() {
        return precio;
    }

    public String getCostoEnvio() {
        return costoEnvio;
    }

    public Integer getCantidadVendida() {
        return cantidadVendida;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public CategoriaInstrumento getCategoria() {
        return categoria;
    }

    // --- Setters ---
    public void setId(Long id) {
        this.id = id;
    }

    public void setInstrumento(String instrumento) {
        this.instrumento = instrumento;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public void setCostoEnvio(String costoEnvio) {
        this.costoEnvio = costoEnvio;
    }

    public void setCantidadVendida(Integer cantidadVendida) {
        this.cantidadVendida = cantidadVendida;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setCategoria(CategoriaInstrumento categoria) {
        this.categoria = categoria;
    }
}