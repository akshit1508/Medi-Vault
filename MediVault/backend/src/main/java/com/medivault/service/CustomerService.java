package com.medivault.service;

import com.medivault.dto.CustomerDto;
import com.medivault.entity.Customer;
import com.medivault.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CustomerDto createCustomer(CustomerDto dto) {
        Customer customer = Customer.builder()
                .name(dto.getName())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .address(dto.getAddress())
                .build();
        Customer saved = customerRepository.save(customer);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new IllegalArgumentException("Customer not found with ID: " + id);
        }
        customerRepository.deleteById(id);
    }

    private CustomerDto mapToDto(Customer c) {
        return CustomerDto.builder()
                .id(c.getId())
                .name(c.getName())
                .phone(c.getPhone())
                .email(c.getEmail())
                .address(c.getAddress())
                .build();
    }
}
