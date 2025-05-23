package com.example.intrumentos.services;

import com.example.intrumentos.Entities.Pedido;
import com.example.intrumentos.Entities.PedidoDetalle;
import com.example.intrumentos.Repository.PedidoRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime; // <--- AHORA IMPORTAMOS LocalDateTime
import java.time.LocalTime;    // <--- AHORA IMPORTAMOS LocalTime
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ReporteService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public byte[] generarReportePedidosExcel(LocalDate fechaDesde, LocalDate fechaHasta) throws IOException {
        // --- YA NO NECESITAMOS java.util.Date NI ZoneId.systemDefault() AQUÍ ---

        // Convertir LocalDate a LocalDateTime para definir el rango exacto
        LocalDateTime startDateTime = fechaDesde.atStartOfDay(); // 00:00:00 del fechaDesde
        LocalDateTime endDateTime = fechaHasta.atTime(LocalTime.MAX); // 23:59:59.999999999 del fechaHasta

        // Para depuración (opcional, puedes borrarlo después de verificar)
        System.out.println("Fecha Desde (Frontend): " + fechaDesde);
        System.out.println("Fecha Hasta (Frontend): " + fechaHasta);
        System.out.println("startDateTime (para filtro): " + startDateTime);
        System.out.println("endDateTime (para filtro): " + endDateTime);


        // Obtener pedidos filtrados por rango de fechas
        // EL REPOSITORIO AHORA RECIBE DIRECTAMENTE LocalDateTime
        List<Pedido> pedidos = pedidoRepository.findByFechaPedidoBetween(startDateTime, endDateTime);


        // Crear un nuevo libro de trabajo de Excel
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Reporte de Pedidos");

        // Crear estilo para la cabecera
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex());
        CellStyle headerCellStyle = workbook.createCellStyle();
        headerCellStyle.setFont(headerFont);
        headerCellStyle.setFillForegroundColor(IndexedColors.BLUE_GREY.getIndex());
        headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerCellStyle.setAlignment(HorizontalAlignment.CENTER);
        headerCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        // Crear cabecera
        Row headerRow = sheet.createRow(0);
        String[] headers = {"Fecha Pedido", "Instrumento", "Marca", "Modelo", "Cantidad", "Precio", "Subtotal"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerCellStyle);
        }

        // Llenar datos
        AtomicInteger rowNum = new AtomicInteger(1);
        CellStyle dateCellStyle = workbook.createCellStyle();
        CreationHelper createHelper = workbook.getCreationHelper();
        // POI puede manejar LocalDateTime directamente con este formato
        dateCellStyle.setDataFormat(createHelper.createDataFormat().getFormat("dd/mm/yyyy hh:mm:ss"));

        CellStyle numberCellStyle = workbook.createCellStyle();
        numberCellStyle.setDataFormat(createHelper.createDataFormat().getFormat("#,##0.00"));

        for (Pedido pedido : pedidos) {
            if (pedido.getDetalles() != null) {
                for (PedidoDetalle detalle : pedido.getDetalles()) {
                    if (detalle.getInstrumento() != null) {
                        Row row = sheet.createRow(rowNum.getAndIncrement());

                        // Fecha Pedido
                        Cell fechaCell = row.createCell(0);
                        // ¡Ahora pasamos directamente LocalDateTime!
                        fechaCell.setCellValue(pedido.getFechaPedido());
                        fechaCell.setCellStyle(dateCellStyle);

                        // Instrumento
                        row.createCell(1).setCellValue(detalle.getInstrumento().getInstrumento());
                        // Marca
                        row.createCell(2).setCellValue(detalle.getInstrumento().getMarca());
                        // Modelo
                        row.createCell(3).setCellValue(detalle.getInstrumento().getModelo());
                        // Cantidad
                        row.createCell(4).setCellValue(detalle.getCantidad());
                        // Precio
                        Cell precioCell = row.createCell(5);
                        precioCell.setCellValue(detalle.getInstrumento().getPrecio());
                        precioCell.setCellStyle(numberCellStyle);

                        // Subtotal
                        Cell subtotalCell = row.createCell(6);
                        subtotalCell.setCellValue(detalle.getCantidad() * detalle.getInstrumento().getPrecio());
                        subtotalCell.setCellStyle(numberCellStyle);
                    }
                }
            }
        }

        // Autoajustar el tamaño de las columnas
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();

        return outputStream.toByteArray();
    }
}