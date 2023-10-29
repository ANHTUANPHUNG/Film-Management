package com.example.nail.repository;

import com.example.nail.domain.ComboProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComboProductRepository extends JpaRepository<ComboProduct,Long> {
}
