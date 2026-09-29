package com.medivault.service;

import com.medivault.dto.SupplierDto;
import com.medivault.entity.Supplier;
import com.medivault.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public List<SupplierDto> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SupplierDto createSupplier(SupplierDto dto) {
        Supplier supplier = Supplier.builder()
                .name(dto.getName())
                .contactPerson(dto.getContactPerson())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .address(dto.getAddress())
                .build();
        Supplier saved = supplierRepository.save(supplier);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteSupplier(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new IllegalArgumentException("Supplier not found with ID: " + id);
        }
        supplierRepository.deleteById(id);
    }

    private SupplierDto mapToDto(Supplier s) {
        return SupplierDto.builder()
                .id(s.getId())
                .name(s.getName())
                .contactPerson(s.getContactPerson())
                .phone(s.getPhone())
                .email(s.getEmail())
                .address(s.getAddress())
                .build();
    }
}
