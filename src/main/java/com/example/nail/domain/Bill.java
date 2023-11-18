package com.example.nail.domain;

import com.example.nail.domain.eNum.ELock;
import com.example.nail.domain.eNum.EPayment;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name="bills")
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    private String customerPhone;

    private String customerEmail;

    private Long customerQuantity;

    private LocalDateTime timeBook;

    private LocalDateTime appointmentTime;

    private BigDecimal price;
    private Boolean deleted;
    @Enumerated(value = EnumType.STRING)
    private EPayment ePayment;
    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "bill")
    private List<BillCombo> billCombos;

    @OneToMany(mappedBy = "bill")
    private List<BillProduct> billProducts;

}
