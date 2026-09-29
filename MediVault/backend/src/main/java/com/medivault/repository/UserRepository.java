package com.medivault.repository;

import com.medivault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmailAndPhoneAndSpecialCharacter(String email, String phone, String specialCharacter);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
