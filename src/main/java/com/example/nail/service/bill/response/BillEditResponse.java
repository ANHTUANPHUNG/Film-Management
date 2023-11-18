package com.example.nail.service.bill.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class BillEditResponse {
    private Long id;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private Long customerQuantity;
    private LocalDateTime timeBook;
    private LocalDateTime appointmentTime;
    private List<Long> productsId;
    private List<BigDecimal> productsPrice;
    private List<String> productsName;

    private List<Long> combosId;
    private List<BigDecimal> combosPrice;
    private List<String> combosName;
    private Long users;
    private String userName;
    private BigDecimal price;
    private String ePayment;

}
