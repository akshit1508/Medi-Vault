package com.medivault.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierDto {
    private Long id;

    @NotBlank(message = "Supplier name is required")
    private String name;

    private String contactPerson;
    private String phone;
    private String email;
    private String address;
}
