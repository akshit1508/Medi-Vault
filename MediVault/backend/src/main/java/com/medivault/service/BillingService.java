package com.medivault.service;

import com.medivault.dto.BillDto.*;
import com.medivault.entity.Bill;
import com.medivault.entity.BillItem;
import com.medivault.entity.Product;
import com.medivault.repository.BillItemRepository;
import com.medivault.repository.BillRepository;
import com.medivault.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final BillRepository billRepository;
    private final BillItemRepository billItemRepository;
    private final ProductRepository productRepository;

    @Transactional
    public BillResponse checkout(CheckoutRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart cannot be empty.");
        }

        BigDecimal calculatedTotal = BigDecimal.ZERO;
        List<BillItem> itemsToPersist = new ArrayList<>();

        // First pass: validate product availability and calculate totals
        for (BillItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findByName(itemReq.getProductName())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + itemReq.getProductName()));

            if (product.getQuantity() < itemReq.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for product '" + product.getName() +
                        "'. Available: " + product.getQuantity() + ", Requested: " + itemReq.getQuantity());
            }

            BigDecimal lineTotal = itemReq.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            calculatedTotal = calculatedTotal.add(lineTotal);

            // Deduct stock
            product.setQuantity(product.getQuantity() - itemReq.getQuantity());
            product.setQuantityAlertTriggered(product.getQuantity() <= product.getAlertThreshold());
            productRepository.save(product);

            BillItem billItem = BillItem.builder()
                    .productName(itemReq.getProductName())
                    .quantity(itemReq.getQuantity())
                    .price(itemReq.getPrice())
                    .totalPrice(lineTotal)
                    .build();

            itemsToPersist.add(billItem);
        }

        // Save Bill
        Bill bill = Bill.builder()
                .firmName(request.getFirmName())
                .totalAmount(calculatedTotal)
                .billDate(LocalDateTime.now())
                .build();

        for (BillItem item : itemsToPersist) {
            bill.addItem(item);
        }

        Bill saved = billRepository.save(bill);

        return mapToBillResponse(saved);
    }

    public List<BillResponse> getAllBills() {
        return billRepository.findAllByOrderByBillDateDesc().stream()
                .map(this::mapToBillResponse)
                .collect(Collectors.toList());
    }

    public BillResponse getBillById(Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + id));
        return mapToBillResponse(bill);
    }

    public List<SalesReportItem> getSalesReport(String reportType, LocalDate fromDate, LocalDate toDate) {
        LocalDateTime start = (fromDate != null) ? fromDate.atStartOfDay() : LocalDate.of(2000, 1, 1).atStartOfDay();
        LocalDateTime end = (toDate != null) ? toDate.atTime(LocalTime.MAX) : LocalDate.of(2100, 1, 1).atTime(LocalTime.MAX);

        List<Object[]> rawData;
        if ("month".equalsIgnoreCase(reportType)) {
            rawData = billRepository.getSalesGroupedByMonth(start, end);
        } else if ("year".equalsIgnoreCase(reportType)) {
            rawData = billRepository.getSalesGroupedByYear(start, end);
        } else {
            rawData = billRepository.getSalesGroupedByDay(start, end);
        }

        List<SalesReportItem> result = new ArrayList<>();
        for (Object[] row : rawData) {
            String label = String.valueOf(row[0]);
            BigDecimal sales = row[1] != null ? new BigDecimal(row[1].toString()) : BigDecimal.ZERO;
            result.add(new SalesReportItem(label, sales));
        }

        return result;
    }

    private BillResponse mapToBillResponse(Bill bill) {
        List<BillItemResponse> itemResponses = bill.getItems().stream()
                .map(item -> BillItemResponse.builder()
                        .id(item.getId())
                        .productName(item.getProductName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .totalPrice(item.getTotalPrice())
                        .build())
                .collect(Collectors.toList());

        return BillResponse.builder()
                .id(bill.getId())
                .firmName(bill.getFirmName())
                .totalAmount(bill.getTotalAmount())
                .billDate(bill.getBillDate())
                .items(itemResponses)
                .build();
    }
}
