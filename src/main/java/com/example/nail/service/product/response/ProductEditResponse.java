package com.example.nail.service.product.response;

import com.example.nail.service.file.FileResponse;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
public class ProductEditResponse {
    private Long id;

    private String name;

    private String description;

    private BigDecimal price;

    private String poster;
    private List<FileResponse> images;
}
