package com.example.nail.repository;

import com.example.nail.domain.File;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FileRepository extends JpaRepository<File,String> {
    void deleteAllByProductId(Long id);
    @Modifying
    @Query(value = "UPDATE File set product.id = null WHERE product.id = :id")
    void deleteFilesByProductId(@Param("id") Long id);

    List<File> findAllByProductId(Long id);
    @Transactional
    void deleteAllByComboId(Long id);
    @Query(value = "SELECT * FROM files WHERE id in :myId", nativeQuery = true)
    List<File> findCuaTao(List<String> myId);


}
