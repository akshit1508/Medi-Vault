package com.medivault.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "batch_number", length = 100)
    private String batchNumber;

    @Column(length = 100)
    private String category;

    @Column(name = "drug_type", length = 100)
    private String drugType;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "alert_threshold")
    @Builder.Default
    private Integer alertThreshold = 10;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 0;

    @Column(name = "expiry_alert")
    @Builder.Default
    private Boolean expiryAlert = true;

    @Column(name = "expiry_alert_date")
    private LocalDate expiryAlertDate;

    @Column(name = "quantity_alert_triggered")
    @Builder.Default
    private Boolean quantityAlertTriggered = false;
}
