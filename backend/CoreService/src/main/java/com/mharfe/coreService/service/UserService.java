package com.mharfe.coreService.service;

import com.mharfe.coreService.model.user.User;
import com.mharfe.coreService.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    public Optional<User> getUserByMongoId(String mongoUserId) {
        return userRepository.findByMongoUserId(mongoUserId);
    }

    @Transactional
    public User updateUser(UUID id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setTokenBalance(userDetails.getTokenBalance());
        
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public User updateTokenBalance(UUID userId, int tokenAmount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setTokenBalance(user.getTokenBalance() + tokenAmount);
        return userRepository.save(user);
    }

    @Transactional
    public User registerUser(String username, String email, String password) {
        // Check if user already exists
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);
        user.setTokenBalance(20); // Initial token balance

        return userRepository.save(user);
    }

    @Transactional
    public User createOrUpdateUserFromMongo(String mongoUserId, String username, String email) {
        Optional<User> existingUser = userRepository.findByMongoUserId(mongoUserId);
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setUsername(username);
            user.setEmail(email);
            return userRepository.save(user);
        } else {
            User newUser = new User();
            newUser.setMongoUserId(mongoUserId);
            newUser.setUsername(username);
            newUser.setEmail(email);
            newUser.setTokenBalance(0);
            return userRepository.save(newUser);
        }
    }
} 