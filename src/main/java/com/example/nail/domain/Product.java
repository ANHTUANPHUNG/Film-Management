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

//    @NotBlank(message = "Tên không được để trống")
//    @Size(min = 8, max = 8, message = "Tên phải có đúng 8 ký tự!")
    private String name;

    private BigDecimal price;

    private String description;

    @ManyToOne
    @NotNull(message = "Not null")
    private File poster;

    @OneToMany(mappedBy = "product")
    private List<File> images;

    @OneToMany(mappedBy = "product")
    private List<ComboProduct> comboProducts;

}
