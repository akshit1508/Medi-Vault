package com.medivault.service;

import com.medivault.dto.ProductDto;
import com.medivault.entity.Product;
import com.medivault.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + id));
        return mapToDto(product);
    }

    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        // Validation logic from legacy ProductPage.java
        if (dto.getExpiryDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Expiry date cannot be in the past.");
        }

        if (dto.getAlertThreshold() != null && dto.getQuantity() != null) {
            if (dto.getAlertThreshold() >= dto.getQuantity()) {
                throw new IllegalArgumentException("Alert threshold must be less than quantity.");
            }
        }

        if (dto.getExpiryAlertDate() != null) {
            if (dto.getExpiryAlertDate().isAfter(dto.getExpiryDate())) {
                throw new IllegalArgumentException("Expiry alert date must be before the expiry date.");
            }
        }

        boolean quantityAlert = dto.getAlertThreshold() != null && dto.getQuantity() <= dto.getAlertThreshold();

        Product product = Product.builder()
                .id(dto.getId())
                .name(dto.getName())
                .batchNumber(dto.getBatchNumber())
                .category(dto.getCategory())
                .drugType(dto.getDrugType())
                .price(dto.getPrice())
                .expiryDate(dto.getExpiryDate())
                .description(dto.getDescription())
                .alertThreshold(dto.getAlertThreshold() != null ? dto.getAlertThreshold() : 10)
                .quantity(dto.getQuantity() != null ? dto.getQuantity() : 0)
                .expiryAlert(dto.getExpiryAlert() != null ? dto.getExpiryAlert() : true)
                .expiryAlertDate(dto.getExpiryAlertDate())
                .quantityAlertTriggered(quantityAlert)
                .build();

        Product saved = productRepository.save(product);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product not found with ID: " + id);
        }
        productRepository.deleteById(id);
    }

    public List<ProductDto> search(String query) {
        if (query == null || query.isBlank()) {
            return getAllProducts();
        }
        return productRepository.searchProducts(query).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> searchByDrugType(String drugType) {
        return productRepository.findByDrugTypeContainingIgnoreCase(drugType).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> searchByBatchNumber(String batchNumber) {
        return productRepository.findByBatchNumberContainingIgnoreCase(batchNumber).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> searchByAlphabet(String prefix) {
        return productRepository.findByNameStartingWithIgnoreCase(prefix).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ProductDto mapToDto(Product p) {
        return ProductDto.builder()
                .id(p.getId())
                .name(p.getName())
                .batchNumber(p.getBatchNumber())
                .category(p.getCategory())
                .drugType(p.getDrugType())
                .price(p.getPrice())
                .expiryDate(p.getExpiryDate())
                .description(p.getDescription())
                .alertThreshold(p.getAlertThreshold())
                .quantity(p.getQuantity())
                .expiryAlert(p.getExpiryAlert())
                .expiryAlertDate(p.getExpiryAlertDate())
                .quantityAlertTriggered(p.getQuantityAlertTriggered())
                .build();
    }
}
