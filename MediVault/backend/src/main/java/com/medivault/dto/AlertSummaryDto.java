package com.medivault.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertSummaryDto {
    private List<ProductDto> expiringProducts;
    private List<ProductDto> lowStockProducts;
    private int expiringCount;
    private int lowStockCount;
}
