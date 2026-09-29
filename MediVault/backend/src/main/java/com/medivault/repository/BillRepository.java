package com.medivault.repository;

import com.medivault.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    List<Bill> findAllByOrderByBillDateDesc();

    // Day-wise sales report
    @Query(value = "SELECT DATE(b.bill_date) AS label, SUM(b.total_amount) AS total_sales " +
                   "FROM bills b " +
                   "WHERE b.bill_date BETWEEN :start AND :end " +
                   "GROUP BY DATE(b.bill_date) ORDER BY label DESC", nativeQuery = true)
    List<Object[]> getSalesGroupedByDay(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Month-wise sales report
    @Query(value = "SELECT DATE_FORMAT(b.bill_date, '%Y-%m') AS label, SUM(b.total_amount) AS total_sales " +
                   "FROM bills b " +
                   "WHERE b.bill_date BETWEEN :start AND :end " +
                   "GROUP BY DATE_FORMAT(b.bill_date, '%Y-%m') ORDER BY label DESC", nativeQuery = true)
    List<Object[]> getSalesGroupedByMonth(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Year-wise sales report
    @Query(value = "SELECT YEAR(b.bill_date) AS label, SUM(b.total_amount) AS total_sales " +
                   "FROM bills b " +
                   "WHERE b.bill_date BETWEEN :start AND :end " +
                   "GROUP BY YEAR(b.bill_date) ORDER BY label DESC", nativeQuery = true)
    List<Object[]> getSalesGroupedByYear(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
