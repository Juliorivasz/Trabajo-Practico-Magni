package com.example.intrumentos.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "categoria_instrumento")
public class CategoriaInstrumento implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String denominacion;

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL, orphanRemoval = true) // Agregado cascade y orphanRemoval
    @JsonIgnoreProperties("categoria")
    private List<Instrumento> instrumentos;

    // --- Constructores ---
    public CategoriaInstrumento() {
    }

    public CategoriaInstrumento(Long id, String denominacion, List<Instrumento> instrumentos) {
        this.id = id;
        this.denominacion = denominacion;
        this.instrumentos = instrumentos;
    }

    public CategoriaInstrumento(String denominacion, List<Instrumento> instrumentos) {
        this.denominacion = denominacion;
        this.instrumentos = instrumentos;
    }

    // --- Getters ---
    public Long getId() {
        return id;
    }

    public String getDenominacion() {
        return denominacion;
    }

    public List<Instrumento> getInstrumentos() {
        return instrumentos;
    }

    // --- Setters ---
    public void setId(Long id) {
        this.id = id;
    }

    public void setDenominacion(String denominacion) {
        this.denominacion = denominacion;
    }

    public void setInstrumentos(List<Instrumento> instrumentos) {
        this.instrumentos = instrumentos;
    }

    // Métodos de conveniencia para añadir/remover instrumentos
    public void addInstrumento(Instrumento instrumento) {
        if (this.instrumentos == null) {
            this.instrumentos = new java.util.ArrayList<>();
        }
        this.instrumentos.add(instrumento);
        instrumento.setCategoria(this); // Asegura la relación bidireccional
    }

    public void removeInstrumento(Instrumento instrumento) {
        if (this.instrumentos != null) {
            this.instrumentos.remove(instrumento);
            instrumento.setCategoria(null); // Desvincula
        }
    }
}