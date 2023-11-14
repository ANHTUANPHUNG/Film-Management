package com.example.nail.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="combos")
public class Combo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private BigDecimal price;

    private String description;

    @ManyToOne
    private File posterCombo;
    private Boolean deleted;

    @OneToMany(mappedBy = "combo")
    private List<File> imageCombo;

    @OneToMany(mappedBy = "combo")
    private List<ComboProduct> comboProducts;
}
