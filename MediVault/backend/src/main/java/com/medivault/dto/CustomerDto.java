package com.medivault.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDto {
    private Long id;

    @NotBlank(message = "Customer name is required")
    private String name;

    private String phone;
    private String email;
    private String address;
}
