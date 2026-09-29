package com.medivault.controller;

import com.medivault.dto.ProductDto;
import com.medivault.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDto>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String drugType,
            @RequestParam(required = false) String batchNumber,
            @RequestParam(required = false) String prefix) {

        if (drugType != null && !drugType.isBlank()) {
            return ResponseEntity.ok(productService.searchByDrugType(drugType));
        }
        if (batchNumber != null && !batchNumber.isBlank()) {
            return ResponseEntity.ok(productService.searchByBatchNumber(batchNumber));
        }
        if (prefix != null && !prefix.isBlank()) {
            return ResponseEntity.ok(productService.searchByAlphabet(prefix));
        }
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(productService.search(search));
        }

        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductDto dto) {
        return ResponseEntity.ok(productService.createProduct(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
