package com.fantasywriter.token.controller;

import com.fantasywriter.BaseIntegrationTest;
import com.fantasywriter.security.TestJwtTokenProvider;
import com.fantasywriter.security.entity.User;
import com.fantasywriter.security.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class TokenControllerTest extends BaseIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestJwtTokenProvider tokenProvider;

    private String authToken;
    private User testUser;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        
        // Create test user
        testUser = new User();
        testUser.setUsername(TEST_USERNAME);
        testUser.setEmail(TEST_EMAIL);
        testUser.setPassword(TEST_PASSWORD);
        testUser.setTokenBalance(100);
        userRepository.save(testUser);

        // Generate token
        authToken = tokenProvider.generateToken(TEST_USERNAME);
    }

    @Test
    void whenGetTokenBalance_thenReturnsBalance() throws Exception {
        // when
        ResultActions response = mockMvc.perform(get("/api/tokens/balance")
                .header("Authorization", "Bearer " + authToken));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.balance").value(100));
    }

    @Test
    void whenPurchaseTokens_thenReturnsUpdatedBalance() throws Exception {
        // given
        Map<String, Integer> purchaseData = new HashMap<>();
        purchaseData.put("amount", 50);

        // when
        ResultActions response = mockMvc.perform(post("/api/tokens/purchase")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(purchaseData)));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.balance").value(150))
                .andExpect(jsonPath("$.transactionId").exists());
    }

    @Test
    void whenGetTransactionHistory_thenReturnsTransactions() throws Exception {
        // given
        Map<String, Integer> purchaseData = new HashMap<>();
        purchaseData.put("amount", 50);

        // Create a transaction
        mockMvc.perform(post("/api/tokens/purchase")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(purchaseData)));

        // when
        ResultActions response = mockMvc.perform(get("/api/tokens/transactions")
                .header("Authorization", "Bearer " + authToken));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$[0].amount").value(50))
                .andExpect(jsonPath("$[0].type").value("PURCHASE"))
                .andExpect(jsonPath("$[0].status").value("COMPLETED"));
    }

    @Test
    void whenGetUsageHistory_thenReturnsUsageLogs() throws Exception {
        // given
        Map<String, String> promptData = new HashMap<>();
        promptData.put("prompt", "A magical forest scene");

        // Create a usage log
        mockMvc.perform(post("/api/chapters/1/generate-image")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(promptData)));

        // when
        ResultActions response = mockMvc.perform(get("/api/tokens/usage")
                .header("Authorization", "Bearer " + authToken));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$[0].tokensUsed").exists())
                .andExpect(jsonPath("$[0].feature").value("IMAGE_GENERATION"));
    }

    @Test
    void whenPurchaseWithInvalidAmount_thenReturnsError() throws Exception {
        // given
        Map<String, Integer> purchaseData = new HashMap<>();
        purchaseData.put("amount", -50);

        // when
        ResultActions response = mockMvc.perform(post("/api/tokens/purchase")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(purchaseData)));

        // then
        response.andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Invalid token amount"));
    }

    @Test
    void whenPurchaseWithInsufficientFunds_thenReturnsError() throws Exception {
        // given
        testUser.setTokenBalance(0);
        userRepository.save(testUser);

        Map<String, Integer> purchaseData = new HashMap<>();
        purchaseData.put("amount", 1000);

        // when
        ResultActions response = mockMvc.perform(post("/api/tokens/purchase")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(purchaseData)));

        // then
        response.andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Insufficient funds"));
    }
} 