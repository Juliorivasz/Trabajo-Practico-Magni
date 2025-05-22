package com.example.intrumentos.Repository;

import com.example.intrumentos.Entities.CategoriaInstrumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaInstrumentoRepository extends JpaRepository<CategoriaInstrumento, Long> {
}



