package com.example.intrumentos.controllers;

import com.example.intrumentos.Entities.CategoriaInstrumento;
import com.example.intrumentos.Repository.CategoriaInstrumentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoriaInstrumentoController {

    @Autowired
    private CategoriaInstrumentoRepository categoriaRepo;

    @GetMapping
    public List<CategoriaInstrumento> getAllCategorias() {
        return categoriaRepo.findAll();
    }
}


