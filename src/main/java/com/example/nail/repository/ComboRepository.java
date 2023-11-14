package com.example.nail.repository;

import com.example.nail.domain.Combo;
import com.example.nail.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface ComboRepository extends JpaRepository<Combo,Long> {
    @Query(value = "SELECT p FROM Combo p" +
            " WHERE (p.price BETWEEN :min AND :max) " +
            "AND  ( p.name LIKE %:search%  " +
            "OR p.description LIKE %:search%  )" )
    Page<Combo> searchAllByService(@Param("search") String search, Pageable pageable , @Param("min") BigDecimal min, @Param("max") BigDecimal max);

}
