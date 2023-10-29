package com.example.nail.service.product.request;

import com.example.nail.service.request.SelectOptionRequest;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ProductSaveRequest {
    private String name;
    private String price;
    private String description;
    private SelectOptionRequest poster;
    private List<SelectOptionRequest> images;
}
