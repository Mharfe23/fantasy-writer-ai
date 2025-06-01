package com.mharfe.coreService.repository;

import com.mharfe.coreService.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByMongoUserId(String mongoUserId);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByMongoUserId(String mongoUserId);
} 