package com.medivault.service;

import com.medivault.dto.AlertSummaryDto;
import com.medivault.dto.ProductDto;
import com.medivault.entity.Product;
import com.medivault.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final ProductRepository productRepository;
    private final ProductService productService;

    public AlertSummaryDto getAlertSummary() {
        LocalDate today = LocalDate.now();
        LocalDate alertDate = today.plusDays(15);

        // Fetch products expiring within the next 15 days (or already expired)
        List<Product> expiring = productRepository.findExpiringProducts(today.minusDays(30), alertDate);
        List<Product> lowStock = productRepository.findLowStockProducts();

        List<ProductDto> expiringDtos = expiring.stream().map(productService::mapToDto).collect(Collectors.toList());
        List<ProductDto> lowStockDtos = lowStock.stream().map(productService::mapToDto).collect(Collectors.toList());

        return AlertSummaryDto.builder()
                .expiringProducts(expiringDtos)
                .lowStockProducts(lowStockDtos)
                .expiringCount(expiringDtos.size())
                .lowStockCount(lowStockDtos.size())
                .build();
    }
}
