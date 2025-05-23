package com.example.intrumentos.services;

import com.example.intrumentos.Entities.Instrumento;
import com.example.intrumentos.Repository.InstrumentoRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.HttpURLConnection;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import java.util.ArrayList;
import java.util.List;

@Service
public class PdfService {

    @Autowired
    private InstrumentoRepository instrumentoRepository;

    private static final String BACKEND_BASE_URL = "http://localhost:8080"; // Ajusta esto si tu backend no está en 8080

    public byte[] generarPdfInstrumento(Long instrumentoId) throws IOException {
        Instrumento instrumento = instrumentoRepository.findById(instrumentoId)
                .orElseThrow(() -> new RuntimeException("Instrumento no encontrado con ID: " + instrumentoId));

        PDDocument document = new PDDocument();
        PDPage page = new PDPage();
        document.addPage(page);

        // Definir fuentes usando Standard14Fonts
        PDFont fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
        PDFont fontNormal = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

        // Definir márgenes y posición inicial
        float margin = 50;
        float yStart = page.getMediaBox().getHeight() - margin;
        float contentWidth = page.getMediaBox().getWidth() - 2 * margin; // Asegurado que está declarado aquí

        // Tamaños de fuente para el nuevo diseño de la derecha (estilo Mercado Libre)
        float smallFontSize = 9; // Para "X vendidos"
        float normalFontSize = 12; // Para marca, modelo, costo de envío, categoría, descripción
        float productNameFontSize = 24; // Para el nombre del instrumento (ej. "Teclado Organo...")
        float priceFontSize = 36;  // Para el precio, ¡bien grande!

        // Espaciados entre líneas (leading)
        float leadingSmall = 1.2f * smallFontSize;
        float leadingNormal = 1.5f * normalFontSize;
        float leadingProductName = 1.1f * productNameFontSize; // Menos espacio para el título del producto
        float leadingPrice = 1.0f * priceFontSize; // Espacio ajustado para el precio

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        try {
            PDPageContentStream contentStream = new PDPageContentStream(document, page);

            // --- Título principal del PDF (arriba de todo) ---
            String mainPdfTitle = "Detalle del Instrumento";
            float mainPdfTitleFontSize = 20;
            float mainPdfTitleX = margin;
            float mainPdfTitleY = page.getMediaBox().getHeight() - 40;
            contentStream.beginText();
            contentStream.setFont(fontBold, mainPdfTitleFontSize);
            contentStream.newLineAtOffset(mainPdfTitleX, mainPdfTitleY);
            contentStream.showText(mainPdfTitle);
            contentStream.endText();

            // Altura donde empieza el contenido de las columnas (debajo del título principal)
            float columnStartContentY = mainPdfTitleY - mainPdfTitleFontSize * 2; // Más espacio desde el título

            // --- Definir áreas de la columna (izquierda para imagen, derecha para detalles) ---
            float imageColumnWidth = contentWidth * 0.45f; // 45% del ancho de contenido para la imagen
            float detailsColumnWidth = contentWidth * 0.55f - 20; // 55% para los detalles, menos el espacio entre columnas

            float imageColumnX = margin;
            float detailsColumnX = margin + imageColumnWidth + 20; // 20 es el espacio entre columnas

            float imageRenderedHeight = 0; // Para almacenar la altura real de la imagen renderizada

            // --- Imagen del instrumento (Columna Izquierda) ---
            String imageUrl = instrumento.getImagen();

            if (imageUrl != null && !imageUrl.isEmpty()) {
                URL finalImageUrl;
                try {
                    finalImageUrl = new URL(imageUrl);
                } catch (MalformedURLException e) {
                    finalImageUrl = new URL(BACKEND_BASE_URL + imageUrl);
                    System.out.println("URL de imagen corregida a: " + finalImageUrl.toString());
                }

                try {
                    BufferedImage awtImage = null;
                    HttpURLConnection connection = (HttpURLConnection) finalImageUrl.openConnection();
                    connection.setConnectTimeout(5000);
                    connection.setReadTimeout(10000);
                    connection.setRequestProperty("User-Agent", "Mozilla/5.0");

                    try (InputStream is = connection.getInputStream()) {
                        awtImage = ImageIO.read(is);
                    }

                    if (awtImage != null) {
                        PDImageXObject pdImage = LosslessFactory.createFromImage(document, awtImage);

                        float imageWidth = pdImage.getWidth();
                        float imageHeight = pdImage.getHeight();
                        float scale = 1;

                        // Escalar para caber en el ancho de la columna de imagen
                        if (imageWidth > imageColumnWidth) {
                            scale = imageColumnWidth / imageWidth;
                        }
                        // Asegurar que la imagen no se salga del límite vertical (hasta el margen inferior)
                        float maxImageHeightAllowed = columnStartContentY - margin;
                        if (imageHeight * scale > maxImageHeightAllowed) {
                            scale = (maxImageHeightAllowed / imageHeight);
                        }

                        float scaledWidth = imageWidth * scale;
                        float scaledHeight = imageHeight * scale;
                        imageRenderedHeight = scaledHeight; // Guardar la altura real

                        // Posicionar imagen en la columna izquierda, centrada horizontalmente en esa columna
                        float imageXPosition = imageColumnX + (imageColumnWidth - scaledWidth) / 2;
                        contentStream.drawImage(pdImage, imageXPosition, columnStartContentY - scaledHeight, scaledWidth, scaledHeight);
                    } else {
                        System.err.println("No se pudo leer la imagen de la URL: " + finalImageUrl.toString() + " (BufferedImage es null)");
                    }
                } catch (java.net.SocketTimeoutException e) {
                    System.err.println("Tiempo de espera agotado al cargar la imagen de la URL: " + finalImageUrl.toString() + ". " + e.getMessage());
                } catch (IOException e) {
                    System.err.println("Error de I/O al cargar la imagen: " + finalImageUrl.toString() + ". " + e.getMessage());
                } catch (Exception e) {
                    System.err.println("Error inesperado al cargar o dibujar la imagen: " + e.getMessage());
                }
            } else {
                System.out.println("No se proporcionó URL de imagen para el instrumento " + instrumentoId);
            }

            // --- Detalles del instrumento (Columna Derecha) ---
            float detailsCurrentY = columnStartContentY; // Empieza al mismo nivel que la imagen

            // "X vendidos" - con fuente pequeña, encima del nombre del producto
            if (instrumento.getCantidadVendida() > 0) {
                contentStream.beginText();
                contentStream.setFont(fontNormal, smallFontSize);
                contentStream.newLineAtOffset(detailsColumnX, detailsCurrentY);
                contentStream.showText(instrumento.getCantidadVendida() + " vendidos");
                contentStream.endText();
                detailsCurrentY -= leadingSmall + 20; // Espacio extra después de "vendidos"
            } else {
                detailsCurrentY -= leadingSmall; // Mantener un espacio similar si no hay ventas
            }

            // Nombre del Producto (ej. "Teclado Organo Electronico Musical...")
            // *** CAMBIO CLAVE AQUÍ: Usar drawTextWithLineBreaks para el nombre del producto ***
            contentStream.setFont(fontNormal, productNameFontSize); // No bold, como en Mercado Libre
            float productNameTextHeight = drawTextWithLineBreaks(contentStream, fontNormal, productNameFontSize, detailsColumnX, detailsCurrentY, detailsColumnWidth, instrumento.getInstrumento());
            detailsCurrentY -= productNameTextHeight + leadingProductName; // Ajustar la posición Y después del texto multilínea


            // Precio - ¡MUY grande!
            contentStream.beginText();
            contentStream.setFont(fontNormal, priceFontSize); // Normal font, but huge size
            contentStream.newLineAtOffset(detailsColumnX, detailsCurrentY);
            contentStream.showText("$" + String.format("%.2f", instrumento.getPrecio()));
            contentStream.endText();
            detailsCurrentY -= leadingPrice * 1; // Más espacio después del precio

            // Marca y Modelo - Normal size
            detailsCurrentY = writeKeyValue(contentStream, fontBold, fontNormal, normalFontSize, detailsColumnX, detailsCurrentY, leadingNormal, "Marca: ", instrumento.getMarca());
            detailsCurrentY = writeKeyValue(contentStream, fontBold, fontNormal, normalFontSize, detailsColumnX, detailsCurrentY, leadingNormal, "Modelo: ", instrumento.getModelo());

            detailsCurrentY -= leadingNormal; // Espacio extra antes de costo de envío

            // Costo de Envío - Normal size
            contentStream.beginText();
            contentStream.setFont(fontBold, normalFontSize);
            contentStream.newLineAtOffset(detailsColumnX, detailsCurrentY);
            contentStream.showText("Costo Envío: ");
            contentStream.setFont(fontNormal, normalFontSize);
            String costoEnvioTexto = instrumento.getCostoEnvio();
            if ("G".equalsIgnoreCase(costoEnvioTexto) || "Gratis".equalsIgnoreCase(costoEnvioTexto)) {
                contentStream.showText("Envío gratis");
            } else {
                contentStream.showText(costoEnvioTexto);
            }
            contentStream.endText();
            detailsCurrentY -= leadingNormal;


            // Categoría (si existe) - Normal size
            if (instrumento.getCategoria() != null) {
                detailsCurrentY = writeKeyValue(contentStream, fontBold, fontNormal, normalFontSize, detailsColumnX, detailsCurrentY, leadingNormal, "Categoría: ", instrumento.getCategoria().getDenominacion());
            }


            // --- Descripción (Debajo de la imagen o detalles, lo que esté más abajo) ---
            // Tomamos la posición Y más baja entre la parte inferior de la imagen y la parte inferior de los detalles de la columna derecha
            float descriptionStartY = Math.min(columnStartContentY - imageRenderedHeight, detailsCurrentY) - leadingNormal * 1; // Espacio adicional antes de la descripción

            // Asegurarse de que no nos salimos de la página por la parte inferior al inicio de la descripción
            if (descriptionStartY < margin + normalFontSize * 4) { // Dejar al menos 4 líneas de espacio en la parte inferior
                // Si no hay suficiente espacio, podrías considerar agregar una nueva página o ajustar el diseño
                // Por ahora, solo ajustaremos descriptionStartY para que no se salga de la página.
                descriptionStartY = page.getMediaBox().getHeight() - margin - (normalFontSize * 4); // Cerca del fondo
            }

            contentStream.beginText();
            contentStream.setFont(fontBold, normalFontSize);
            contentStream.newLineAtOffset(margin, descriptionStartY);
            contentStream.showText("Descripción:");
            contentStream.endText();
            descriptionStartY -= leadingNormal;

            // *** CAMBIO CLAVE AQUÍ: Modificar drawTextWithLineBreaks para devolver la altura y manejar el "overflow" ***
            drawTextWithLineBreaks(contentStream, fontNormal, normalFontSize, margin, descriptionStartY, contentWidth, instrumento.getDescripcion());

            contentStream.close();
            document.save(byteArrayOutputStream);

        } catch (Exception e) {
            System.err.println("Error general al generar el PDF: " + e.getMessage());
            throw new IOException("Fallo al generar el PDF del instrumento", e);
        } finally {
            document.close();
        }

        return byteArrayOutputStream.toByteArray();
    }

    // Método auxiliar para escribir pares clave-valor (ajustado para el nuevo formato)
    private float writeKeyValue(PDPageContentStream contentStream, PDFont fontBold, PDFont fontNormal, float fontSize, float x, float y, float leading, String key, String value) throws IOException {
        contentStream.beginText();
        contentStream.setFont(fontBold, fontSize);
        contentStream.newLineAtOffset(x, y);
        contentStream.showText(key);

        // Mover el cursor a la derecha de la clave y añadir el valor
        float keyWidth = fontBold.getStringWidth(key) / 1000 * fontSize;
        contentStream.setFont(fontNormal, fontSize);
        contentStream.newLineAtOffset(keyWidth + 5, 0); // Añadir un pequeño espacio extra después de la clave
        contentStream.showText(value);
        contentStream.endText();
        return y - leading;
    }

    // Método auxiliar para dibujar texto con saltos de línea automáticos
    // *** MODIFICADO para devolver la altura total del texto dibujado ***
    private float drawTextWithLineBreaks(PDPageContentStream contentStream, PDFont font, float fontSize, float x, float y, float maxWidth, String text) throws IOException {
        if (text == null || text.isEmpty()) {
            return 0;
        }

        List<String> lines = new ArrayList<>();
        int lastSpace = -1;
        String remainingText = text;

        while (remainingText.length() > 0) {
            int spaceIndex = remainingText.indexOf(' ', lastSpace + 1);
            if (spaceIndex < 0) {
                spaceIndex = remainingText.length();
            }
            String subString = remainingText.substring(0, spaceIndex);
            float size = font.getStringWidth(subString) / 1000 * fontSize;

            if (size > maxWidth) {
                if (lastSpace < 0) { // Si una sola palabra es más larga que el ancho de la línea
                    lastSpace = subString.length() > 0 ? subString.length() - 1 : 0;
                }
                subString = remainingText.substring(0, lastSpace);
                lines.add(subString);
                remainingText = remainingText.substring(lastSpace).trim();
                lastSpace = -1;
            } else if (spaceIndex == remainingText.length()) { // Última palabra de la última línea
                lines.add(remainingText);
                remainingText = "";
            } else {
                lastSpace = spaceIndex;
            }
        }

        float initialY = y; // Guardar la Y inicial para calcular la altura total
        contentStream.setFont(font, fontSize);
        for (String line : lines) {
            if (y < 50) { // Si la posición Y está muy cerca del margen inferior, cortar el texto
                // Opcional: Podrías añadir "..." o una nota de que el texto continúa en otra página
                break;
            }
            contentStream.beginText();
            contentStream.newLineAtOffset(x, y);
            contentStream.showText(line);
            contentStream.endText();
            y -= 1.2f * fontSize;
        }
        return initialY - y; // Devolver la altura total ocupada
    }

    // Nuevo método auxiliar para calcular la altura del texto con saltos de línea
    // Este método ya no es estrictamente necesario si drawTextWithLineBreaks devuelve la altura
    // pero lo mantenemos por si lo quieres usar en otros cálculos predictivos.
    private float calculateTextHeight(PDFont font, float fontSize, float maxWidth, String text) throws IOException {
        if (text == null || text.isEmpty()) {
            return 0;
        }

        List<String> lines = new ArrayList<>();
        int lastSpace = -1;
        String remainingText = text;

        while (remainingText.length() > 0) {
            int spaceIndex = remainingText.indexOf(' ', lastSpace + 1);
            if (spaceIndex < 0) {
                spaceIndex = remainingText.length();
            }
            String subString = remainingText.substring(0, spaceIndex);
            float size = font.getStringWidth(subString) / 1000 * fontSize;

            if (size > maxWidth) {
                if (lastSpace < 0) {
                    lastSpace = subString.length() > 0 ? subString.length() - 1 : 0;
                }
                subString = remainingText.substring(0, lastSpace);
                lines.add(subString);
                remainingText = remainingText.substring(lastSpace).trim();
                lastSpace = -1;
            } else if (spaceIndex == remainingText.length()) {
                lines.add(remainingText);
                remainingText = "";
            } else {
                lastSpace = spaceIndex;
            }
        }
        return lines.size() * (1.2f * fontSize); // Alto total del texto
    }
}