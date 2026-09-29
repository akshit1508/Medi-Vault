package com.medivault.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {

    private Long id;

    @NotBlank(message = "Product name is required")
    private String name;

    private String batchNumber;
    private String category;
    private String drugType;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    private String description;

    @Min(value = 0, message = "Alert threshold cannot be negative")
    private Integer alertThreshold;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    private Boolean expiryAlert;
    private LocalDate expiryAlertDate;
    private Boolean quantityAlertTriggered;
}
