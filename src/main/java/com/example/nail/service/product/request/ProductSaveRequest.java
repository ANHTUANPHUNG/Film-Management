package com.example.nail.service.product.request;

import com.example.nail.service.request.SelectOptionRequest;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.util.List;

import static org.apache.commons.lang3.StringUtils.isNumeric;

@Data
@NoArgsConstructor
public class ProductSaveRequest implements Validator {
    private String name;
    private String price;
    private String description;
    private SelectOptionRequest poster;
    private List<SelectOptionRequest> images;

    @Override
    public boolean supports(Class<?> clazz) {
        return false;
    }

    @Override
    public void validate(Object target, Errors errors) {
        ProductSaveRequest productSaveRequest = (ProductSaveRequest) target;

        String name = productSaveRequest.name;
        String description = productSaveRequest.description;
        String price = productSaveRequest.price;
        SelectOptionRequest poster = productSaveRequest.poster;

        if (name.length() < 1) {
            errors.rejectValue("name", "name.length", "Tên phải có ít nhất là 1 ký tự");
        }

        if (description.length() < 1) {
            errors.rejectValue("description", "description.length", "Miêu tả chỉ phải có ít nhất là 1 ký tự");
        }
        if ( poster.getId() == null) {
            errors.rejectValue("poster", "poster.null", "Poster không được để trống.");
        }
        if (!isNumeric(price)) {
            errors.rejectValue("price", "price.notNumeric", "Giá sản phẩm phải là một số.");
        } else {
            double priceValue = Double.parseDouble(price);
            if (priceValue < 10000 || priceValue > 1000000) {
                errors.rejectValue("price", "price.range", "Giá sản phẩm phải lớn hơn 10000 và bé hơn 1000000.");
            }
        }
    }
}
