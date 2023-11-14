package com.example.nail.service.combo.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
public class ComboEditResponse {
    private Long id;

    private String name;

    private String description;

    private BigDecimal price;
    private List<Long> productsId;
    private String poster;
    private String idPoster;
    private List<String> images;
    private List<String> idImages;

}
