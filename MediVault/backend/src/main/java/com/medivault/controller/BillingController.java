package com.medivault.controller;

import com.medivault.dto.BillDto.*;
import com.medivault.service.BillingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/bills")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BillingController {

    private final BillingService billingService;

    @PostMapping("/checkout")
    public ResponseEntity<BillResponse> checkout(@Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.ok(billingService.checkout(request));
    }

    @GetMapping
    public ResponseEntity<List<BillResponse>> getAllBills() {
        return ResponseEntity.ok(billingService.getAllBills());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillResponse> getBillById(@PathVariable Long id) {
        return ResponseEntity.ok(billingService.getBillById(id));
    }

    @GetMapping("/reports/sales")
    public ResponseEntity<List<SalesReportItem>> getSalesReport(
            @RequestParam(defaultValue = "day") String reportType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        return ResponseEntity.ok(billingService.getSalesReport(reportType, fromDate, toDate));
    }
}
