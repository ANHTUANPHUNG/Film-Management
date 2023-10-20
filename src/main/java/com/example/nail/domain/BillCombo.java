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
@Table(name = "billCombos")
public class BillCombo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String comboName;

    private BigDecimal comboPrice;

    @ManyToOne
    private Combo combo;

    @ManyToOne
    private Bill bill;
}
