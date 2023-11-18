package com.example.nail.repository;

import com.example.nail.domain.Bill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BillRepository extends JpaRepository<Bill,Long> {
    @Query(value = "SELECT b FROM Bill b WHERE b.deleted = false AND " +
            "(b.customerName LIKE %:search% OR " +
            "b.customerEmail LIKE %:search% OR " +
            "b.customerPhone LIKE %:search% OR " +
            "b.user.name LIKE %:search% OR " +
            "EXISTS (SELECT 1 FROM BillCombo bc WHERE bc.bill = b AND bc.combo.name LIKE %:search%) OR " +
            "EXISTS (SELECT 1 FROM BillProduct bp WHERE bp.bill = b AND bp.product.name LIKE %:search%))")
    Page<Bill> searchAllByBill(@Param("search") String search, Pageable pageable);

}
