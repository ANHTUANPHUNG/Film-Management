package com.example.nail.repository;

import com.example.nail.domain.BillProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillProductRepository extends JpaRepository<BillProduct,Long> {
}
