package com.example.intrumentos.controllers;

import com.example.intrumentos.services.ReporteService; // Mantén si lo usas para Excel
import com.example.intrumentos.services.PdfService; // <--- Importar el nuevo PdfService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus; // Importar HttpStatus
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "http://localhost:5173") // Ajusta el puerto de tu frontend si es diferente
public class ReporteController {

    @Autowired
    private ReporteService reporteService; // Para el Excel

    @Autowired
    private PdfService pdfService; // <--- Inyectar el nuevo PdfService

    // Endpoint existente para Excel (sin cambios)
    @GetMapping("/pedidos/excel")
    public ResponseEntity<byte[]> generarReportePedidosExcel(
            @RequestParam("fechaDesde") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaDesde,
            @RequestParam("fechaHasta") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaHasta) {
        try {
            byte[] excelBytes = reporteService.generarReportePedidosExcel(fechaDesde, fechaHasta);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "reporte_pedidos.xlsx");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelBytes);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // Nuevo Endpoint para el PDF de Instrumento
    @GetMapping("/instrumento/{id}/pdf")
    public ResponseEntity<byte[]> generarPdfInstrumento(@PathVariable Long id) {
        try {
            byte[] pdfBytes = pdfService.generarPdfInstrumento(id);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF); // Tipo de contenido para PDF
            headers.setContentDispositionFormData("inline", "instrumento_" + id + ".pdf"); // "inline" para mostrar en el navegador, "attachment" para descargar
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (RuntimeException e) { // Captura la excepción si el instrumento no se encuentra
            System.err.println("Error al generar el PDF del instrumento: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage().getBytes()); // Devolver un mensaje de error legible
        } catch (IOException e) {
            System.err.println("Error I/O al generar el PDF: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}