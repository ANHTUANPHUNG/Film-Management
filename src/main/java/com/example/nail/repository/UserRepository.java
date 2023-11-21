package com.example.nail.repository;

import com.example.nail.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    @Query(value = "SELECT u from User as u where u.name LIKE %:search OR u.email LIKE %:search OR u.userName LIKE %:search")
    Page<User> searchAllByUserName(@Param("search") String search, Pageable pageable);
    List<User> findAllByDeletedFalse();
    Optional<User> findByNameIgnoreCaseOrEmailIgnoreCaseOrPhone(String name, String email, String phone);
    boolean existsByNameIgnoreCase(String name);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByPhone(String phone);
}
