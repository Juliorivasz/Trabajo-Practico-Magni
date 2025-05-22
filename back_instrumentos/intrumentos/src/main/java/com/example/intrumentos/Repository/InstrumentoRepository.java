package com.example.intrumentos.Repository;

import com.example.intrumentos.Entities.Instrumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InstrumentoRepository extends JpaRepository<Instrumento, Long> {
    List<Instrumento> findByCategoriaId(Long idCategoria);
}


