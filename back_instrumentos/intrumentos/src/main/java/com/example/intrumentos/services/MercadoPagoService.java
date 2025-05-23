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

        PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                .id(String.valueOf(pedido.getId()))
                .title(pedido.getDetalles().getFirst().getInstrumento().getInstrumento())
                .description(pedido.getDetalles().getFirst().getInstrumento().getDescripcion())
                .pictureUrl(pedido.getDetalles().getFirst().getInstrumento().getImagen())
                .categoryId(String.valueOf(pedido.getDetalles().getFirst().getInstrumento().getCategoria().getId()))
                .quantity(pedido.getDetalles().getFirst().getCantidad())
                .currencyId("ARS")
                .unitPrice(BigDecimal.valueOf(pedido.getDetalles().getFirst().getInstrumento().getPrecio()))
                .build();

        List<PreferenceItemRequest> items = new ArrayList<>();
        items.add(itemRequest);

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

        return mpPreference;
    }
}

