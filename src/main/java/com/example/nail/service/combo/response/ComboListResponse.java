package com.example.nail.service.combo.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class ComboListResponse implements Validator {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String products;
    private String poster;
    private String images;

    @Override
    public boolean supports(Class<?> clazz) {
        return false;
    }

    @Override
    public void validate(Object target, Errors errors) {

    }
}
