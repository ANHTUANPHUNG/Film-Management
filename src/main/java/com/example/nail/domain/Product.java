package com.example.nail.domain;
import jakarta.persistence.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Table(name = "products")
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private BigDecimal price;

    private String description;

    private Boolean deleted;

    @ManyToOne
    @NotNull(message = "Not null")
    private File poster;

    @OneToMany(mappedBy = "product")
    private List<File> images;

    @OneToMany(mappedBy = "product")
    private List<ComboProduct> comboProducts;

    public Product(Long id) {
        this.id = id;
    }



}
