package com.example.intrumentos.controllers;

import com.example.intrumentos.Entities.CategoriaInstrumento;
import com.example.intrumentos.Entities.Instrumento;
import com.example.intrumentos.Repository.CategoriaInstrumentoRepository;
import com.example.intrumentos.Repository.InstrumentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instrumentos")
@CrossOrigin(origins = "*")
public class InstrumentoController {

    @Autowired
    private InstrumentoRepository instrumentoRepository;

    @Autowired
    private CategoriaInstrumentoRepository categoriaRepository;

    @GetMapping
    public List<Instrumento> getAll() {
        return instrumentoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Instrumento> getById(@PathVariable Long id) {
        return instrumentoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{id}")
    public List<Instrumento> getByCategoria(@PathVariable Long id) {
        return instrumentoRepository.findByCategoriaId(id);
    }

    @PostMapping("/crear")
    public ResponseEntity<Instrumento> crear(@RequestBody Instrumento instru) {
        System.out.println(instru.getCategoria().getId());
        CategoriaInstrumento categoria = categoriaRepository.findById(instru.getCategoria().getId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Instrumento instrumento = new Instrumento();
        instrumento.setInstrumento(instru.getInstrumento());
        instrumento.setMarca(instru.getMarca());
        instrumento.setModelo(instru.getModelo());
        instrumento.setImagen(instru.getImagen());
        instrumento.setPrecio(instru.getPrecio());
        instrumento.setCostoEnvio(instru.getCostoEnvio());
        instrumento.setCantidadVendida(instru.getCantidadVendida());
        instrumento.setDescripcion(instru.getDescripcion());
        instrumento.setCategoria(categoria);

        return ResponseEntity.ok(instrumentoRepository.save(instrumento));
    }


    @PostMapping
    public Instrumento save(@RequestBody Instrumento instrumento) {
        return instrumentoRepository.save(instrumento);
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<Instrumento> editar(@PathVariable Long id, @RequestBody Instrumento instru) {
        Instrumento instrumentoExistente = instrumentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instrumento no encontrado"));

        CategoriaInstrumento categoria = categoriaRepository.findById(instru.getCategoria().getId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        instrumentoExistente.setInstrumento(instru.getInstrumento());
        instrumentoExistente.setMarca(instru.getMarca());
        instrumentoExistente.setModelo(instru.getModelo());
        instrumentoExistente.setImagen(instru.getImagen());
        instrumentoExistente.setPrecio(instru.getPrecio());
        instrumentoExistente.setCostoEnvio(instru.getCostoEnvio());
        instrumentoExistente.setCantidadVendida(instru.getCantidadVendida());
        instrumentoExistente.setDescripcion(instru.getDescripcion());
        instrumentoExistente.setCategoria(categoria);

        return ResponseEntity.ok(instrumentoRepository.save(instrumentoExistente));
    }


    @PutMapping("/{id}")
    public Instrumento update(@PathVariable Long id, @RequestBody Instrumento instrumento) {
        instrumento.setId(id);
        return instrumentoRepository.save(instrumento);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        instrumentoRepository.deleteById(id);
    }}





