package com.fantasywriter.security.controller;

import com.fantasywriter.BaseIntegrationTest;
import com.fantasywriter.security.dto.AuthenticationRequest;
import com.fantasywriter.security.dto.RegisterRequest;
import com.fantasywriter.security.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthenticationControllerTest extends BaseIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void whenRegisterWithValidData_thenReturnsToken() throws Exception {
        // given
        RegisterRequest request = new RegisterRequest();
        request.setUsername(TEST_USERNAME);
        request.setEmail(TEST_EMAIL);
        request.setPassword(TEST_PASSWORD);

        // when
        ResultActions response = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    void whenRegisterWithExistingUsername_thenReturnsError() throws Exception {
        // given
        RegisterRequest request = new RegisterRequest();
        request.setUsername(TEST_USERNAME);
        request.setEmail(TEST_EMAIL);
        request.setPassword(TEST_PASSWORD);

        // Register first user
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        // when
        ResultActions response = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        // then
        response.andExpect(status().isBadRequest());
    }

    @Test
    void whenLoginWithValidCredentials_thenReturnsToken() throws Exception {
        // given
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername(TEST_USERNAME);
        registerRequest.setEmail(TEST_EMAIL);
        registerRequest.setPassword(TEST_PASSWORD);

        // Register user
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)));

        AuthenticationRequest loginRequest = new AuthenticationRequest();
        loginRequest.setUsername(TEST_USERNAME);
        loginRequest.setPassword(TEST_PASSWORD);

        // when
        ResultActions response = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    void whenLoginWithInvalidCredentials_thenReturnsError() throws Exception {
        // given
        AuthenticationRequest request = new AuthenticationRequest();
        request.setUsername(TEST_USERNAME);
        request.setPassword("wrongpassword");

        // when
        ResultActions response = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        // then
        response.andExpect(status().isUnauthorized());
    }
} 