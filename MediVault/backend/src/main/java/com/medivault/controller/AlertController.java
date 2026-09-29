package com.medivault.controller;

import com.medivault.dto.AlertSummaryDto;
import com.medivault.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/alerts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertService alertService;

    @GetMapping("/summary")
    public ResponseEntity<AlertSummaryDto> getAlertSummary() {
        return ResponseEntity.ok(alertService.getAlertSummary());
    }
}
