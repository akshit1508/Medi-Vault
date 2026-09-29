package com.medivault.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class BillDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BillItemRequest {
        @NotBlank(message = "Product name is required")
        private String productName;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be positive")
        private BigDecimal price;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CheckoutRequest {
        @NotBlank(message = "Firm name is required")
        private String firmName;

        @NotEmpty(message = "Cart cannot be empty")
        private List<BillItemRequest> items;

        private BigDecimal total;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BillItemResponse {
        private Long id;
        private String productName;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal totalPrice;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BillResponse {
        private Long id;
        private String firmName;
        private BigDecimal totalAmount;
        private LocalDateTime billDate;
        private List<BillItemResponse> items;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SalesReportItem {
        private String label;
        private BigDecimal totalSales;
    }
}
