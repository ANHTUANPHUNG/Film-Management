package com.example.nail.repository;

import com.example.nail.domain.File;
import com.example.nail.domain.Product;
import com.example.nail.service.product.response.ProductListResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product,Long> {
    List<Product> findProductByPosterId(String poster_id);
    List<Product> findAllByDeletedFalse();
@Modifying
    @Query(value = "UPDATE Product set poster = null where id=:id")
    void  updatePoster(Long id);
    @Query(value = "SELECT p FROM Product p" +
            " WHERE (p.price BETWEEN :min AND :max) AND p.deleted = false "  +
            "AND  ( p.name LIKE %:search%  " +
            "OR p.description LIKE %:search%  )" )
    Page<Product> searchAllByService(@Param("search") String search, Pageable pageable , @Param("min") BigDecimal min, @Param("max") BigDecimal max);

}
