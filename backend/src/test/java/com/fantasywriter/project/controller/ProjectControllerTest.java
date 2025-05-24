package com.fantasywriter.project.controller;

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

class ProjectControllerTest extends BaseIntegrationTest {

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
    void whenCreateProject_thenReturnsCreatedProject() throws Exception {
        // given
        Map<String, String> projectData = new HashMap<>();
        projectData.put("title", "Test Project");
        projectData.put("description", "Test Description");

        // when
        ResultActions response = mockMvc.perform(post("/api/projects")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(projectData)));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Project"))
                .andExpect(jsonPath("$.description").value("Test Description"));
    }

    @Test
    void whenGetProjects_thenReturnsProjectList() throws Exception {
        // given
        Map<String, String> projectData = new HashMap<>();
        projectData.put("title", "Test Project");
        projectData.put("description", "Test Description");

        // Create a project
        mockMvc.perform(post("/api/projects")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(projectData)));

        // when
        ResultActions response = mockMvc.perform(get("/api/projects")
                .header("Authorization", "Bearer " + authToken));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Project"))
                .andExpect(jsonPath("$[0].description").value("Test Description"));
    }

    @Test
    void whenGetProjectById_thenReturnsProject() throws Exception {
        // given
        Map<String, String> projectData = new HashMap<>();
        projectData.put("title", "Test Project");
        projectData.put("description", "Test Description");

        // Create a project
        String response = mockMvc.perform(post("/api/projects")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(projectData)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Map<String, Object> project = objectMapper.readValue(response, Map.class);
        String projectId = project.get("id").toString();

        // when
        ResultActions getResponse = mockMvc.perform(get("/api/projects/" + projectId)
                .header("Authorization", "Bearer " + authToken));

        // then
        getResponse.andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(projectId))
                .andExpect(jsonPath("$.title").value("Test Project"))
                .andExpect(jsonPath("$.description").value("Test Description"));
    }

    @Test
    void whenUpdateProject_thenReturnsUpdatedProject() throws Exception {
        // given
        Map<String, String> projectData = new HashMap<>();
        projectData.put("title", "Test Project");
        projectData.put("description", "Test Description");

        // Create a project
        String response = mockMvc.perform(post("/api/projects")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(projectData)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Map<String, Object> project = objectMapper.readValue(response, Map.class);
        String projectId = project.get("id").toString();

        // Update data
        Map<String, String> updateData = new HashMap<>();
        updateData.put("title", "Updated Project");
        updateData.put("description", "Updated Description");

        // when
        ResultActions updateResponse = mockMvc.perform(put("/api/projects/" + projectId)
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateData)));

        // then
        updateResponse.andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(projectId))
                .andExpect(jsonPath("$.title").value("Updated Project"))
                .andExpect(jsonPath("$.description").value("Updated Description"));
    }

    @Test
    void whenDeleteProject_thenReturnsSuccess() throws Exception {
        // given
        Map<String, String> projectData = new HashMap<>();
        projectData.put("title", "Test Project");
        projectData.put("description", "Test Description");

        // Create a project
        String response = mockMvc.perform(post("/api/projects")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(projectData)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Map<String, Object> project = objectMapper.readValue(response, Map.class);
        String projectId = project.get("id").toString();

        // when
        ResultActions deleteResponse = mockMvc.perform(delete("/api/projects/" + projectId)
                .header("Authorization", "Bearer " + authToken));

        // then
        deleteResponse.andExpect(status().isOk());

        // Verify project is deleted
        mockMvc.perform(get("/api/projects/" + projectId)
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isNotFound());
    }
} 