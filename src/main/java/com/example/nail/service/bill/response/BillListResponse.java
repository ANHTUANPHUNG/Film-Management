package com.example.nail.service.bill.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class BillListResponse implements Validator {
    private Long id;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private Long customerQuantity;
    private LocalDateTime timeBook;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private String appointmentTime;
    private String products;
    private String combos;
    private String user;
    private BigDecimal price;
    private String ePayment;
    @Override
    public boolean supports(Class<?> clazz) {
        return false;
    }

    @Override
    public void validate(Object target, Errors errors) {

    }
}
