package com.example.nail.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "billProducts")
public class BillProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;

    private BigDecimal productPrice;

    @ManyToOne
    private Bill bill;

    @ManyToOne
    private Product product;

    public BillProduct(Bill bill, Product product) {
        this.bill = bill;
        this.product = product;
    }


}
