package com.medivault.repository;

import com.medivault.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findByName(String name);

    List<Product> findByDrugTypeContainingIgnoreCase(String drugType);

    List<Product> findByBatchNumberContainingIgnoreCase(String batchNumber);

    List<Product> findByNameStartingWithIgnoreCase(String prefix);

    // Expiry alerts: products expiring between startDate and endDate with expiryAlert = true
    @Query("SELECT p FROM Product p WHERE p.expiryDate BETWEEN :startDate AND :endDate AND p.expiryAlert = true")
    List<Product> findExpiringProducts(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Low stock alerts: products where quantity <= alertThreshold
    @Query("SELECT p FROM Product p WHERE p.quantity <= p.alertThreshold")
    List<Product> findLowStockProducts();

    // Comprehensive search
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.batchNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.drugType) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchProducts(@Param("query") String query);
}
