package com.example.intrumentos.services;

import com.example.intrumentos.Entities.Pedido;
import com.example.intrumentos.Entities.PreferenceMP;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class MercadoPagoService {

    @Value("${mercadopago.access.token}")
    private String accessToken;

    public PreferenceMP crearPreferencia(Pedido pedido) throws MPException, MPApiException {

        MercadoPagoConfig.setAccessToken(this.accessToken);

        List<PreferenceItemRequest> items = new ArrayList<>();

        // Usamos forEach para recorrer cada detalle del pedido
        pedido.getDetalles().forEach(detalle -> {
            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .id(String.valueOf(detalle.getInstrumento().getId())) // Usamos el ID del instrumento como ID del ítem
                    .title(detalle.getInstrumento().getInstrumento())
                    .description(detalle.getInstrumento().getDescripcion())
                    .pictureUrl(detalle.getInstrumento().getImagen())
                    .categoryId(String.valueOf(detalle.getInstrumento().getCategoria().getId()))
                    .quantity(detalle.getCantidad())
                    .currencyId("ARS")
                    .unitPrice(BigDecimal.valueOf(detalle.getInstrumento().getPrecio()))
                    .build();
            items.add(itemRequest);
        });

        PreferenceBackUrlsRequest backURLs = PreferenceBackUrlsRequest.builder()
                .success("http://localhost:5173/aprobado")
                .pending("http://localhost:5173/pendiente")
                .failure("http://localhost:5173/fallo")
                .build();

        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(items)
                .backUrls(backURLs)
                .build();

        PreferenceClient client = new PreferenceClient();
        Preference preference = client.create(preferenceRequest);

        PreferenceMP mpPreference = new PreferenceMP();
        mpPreference.setStatusCode(preference.getResponse().getStatusCode());
        mpPreference.setId(preference.getId());

        System.out.println(mpPreference);

        return mpPreference;
    }
}