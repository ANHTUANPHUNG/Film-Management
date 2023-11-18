package com.example.nail.repository;

import com.example.nail.domain.Combo;
import com.example.nail.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ComboRepository extends JpaRepository<Combo,Long> {
    @Query(value = "SELECT c FROM Combo c" +
            " WHERE (c.price BETWEEN :min AND :max)" +
            " AND c.deleted = false " +
            "AND  ( c.name LIKE %:search%  " +
            "OR c.description LIKE %:search% OR EXISTS (SELECT 1 FROM ComboProduct cp WHERE cp.combo = c AND cp.product.name LIKE :search) )" )
    Page<Combo> searchAllByService(@Param("search") String search, Pageable pageable , @Param("min") BigDecimal min, @Param("max") BigDecimal max);
    List<Combo> findAllByDeletedFalse();
}
