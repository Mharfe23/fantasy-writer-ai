package com.fantasywriter.project.controller;

import com.fantasywriter.BaseIntegrationTest;
import com.fantasywriter.project.entity.Project;
import com.fantasywriter.project.repository.ProjectRepository;
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

class ChapterControllerTest extends BaseIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TestJwtTokenProvider tokenProvider;

    private String authToken;
    private User testUser;
    private Project testProject;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        projectRepository.deleteAll();
        
        // Create test user
        testUser = new User();
        testUser.setUsername(TEST_USERNAME);
        testUser.setEmail(TEST_EMAIL);
        testUser.setPassword(TEST_PASSWORD);
        testUser.setTokenBalance(100);
        userRepository.save(testUser);

        // Create test project
        testProject = new Project();
        testProject.setTitle("Test Project");
        testProject.setDescription("Test Description");
        testProject.setUser(testUser);
        projectRepository.save(testProject);

        // Generate token
        authToken = tokenProvider.generateToken(TEST_USERNAME);
    }

    @Test
    void whenCreateChapter_thenReturnsCreatedChapter() throws Exception {
        // given
        Map<String, String> chapterData = new HashMap<>();
        chapterData.put("title", "Test Chapter");
        chapterData.put("content", "Test Content");

        // when
        ResultActions response = mockMvc.perform(post("/api/projects/" + testProject.getId() + "/chapters")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chapterData)));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Chapter"))
                .andExpect(jsonPath("$.content").value("Test Content"));
    }

    @Test
    void whenGetChapters_thenReturnsChapterList() throws Exception {
        // given
        Map<String, String> chapterData = new HashMap<>();
        chapterData.put("title", "Test Chapter");
        chapterData.put("content", "Test Content");

        // Create a chapter
        mockMvc.perform(post("/api/projects/" + testProject.getId() + "/chapters")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chapterData)));

        // when
        ResultActions response = mockMvc.perform(get("/api/projects/" + testProject.getId() + "/chapters")
                .header("Authorization", "Bearer " + authToken));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Chapter"))
                .andExpect(jsonPath("$[0].content").value("Test Content"));
    }

    @Test
    void whenGetChapterById_thenReturnsChapter() throws Exception {
        // given
        Map<String, String> chapterData = new HashMap<>();
        chapterData.put("title", "Test Chapter");
        chapterData.put("content", "Test Content");

        // Create a chapter
        String response = mockMvc.perform(post("/api/projects/" + testProject.getId() + "/chapters")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chapterData)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Map<String, Object> chapter = objectMapper.readValue(response, Map.class);
        String chapterId = chapter.get("id").toString();

        // when
        ResultActions getResponse = mockMvc.perform(get("/api/projects/" + testProject.getId() + "/chapters/" + chapterId)
                .header("Authorization", "Bearer " + authToken));

        // then
        getResponse.andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(chapterId))
                .andExpect(jsonPath("$.title").value("Test Chapter"))
                .andExpect(jsonPath("$.content").value("Test Content"));
    }

    @Test
    void whenUpdateChapter_thenReturnsUpdatedChapter() throws Exception {
        // given
        Map<String, String> chapterData = new HashMap<>();
        chapterData.put("title", "Test Chapter");
        chapterData.put("content", "Test Content");

        // Create a chapter
        String response = mockMvc.perform(post("/api/projects/" + testProject.getId() + "/chapters")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chapterData)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Map<String, Object> chapter = objectMapper.readValue(response, Map.class);
        String chapterId = chapter.get("id").toString();

        // Update data
        Map<String, String> updateData = new HashMap<>();
        updateData.put("title", "Updated Chapter");
        updateData.put("content", "Updated Content");

        // when
        ResultActions updateResponse = mockMvc.perform(put("/api/projects/" + testProject.getId() + "/chapters/" + chapterId)
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateData)));

        // then
        updateResponse.andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(chapterId))
                .andExpect(jsonPath("$.title").value("Updated Chapter"))
                .andExpect(jsonPath("$.content").value("Updated Content"));
    }

    @Test
    void whenDeleteChapter_thenReturnsSuccess() throws Exception {
        // given
        Map<String, String> chapterData = new HashMap<>();
        chapterData.put("title", "Test Chapter");
        chapterData.put("content", "Test Content");

        // Create a chapter
        String response = mockMvc.perform(post("/api/projects/" + testProject.getId() + "/chapters")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chapterData)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Map<String, Object> chapter = objectMapper.readValue(response, Map.class);
        String chapterId = chapter.get("id").toString();

        // when
        ResultActions deleteResponse = mockMvc.perform(delete("/api/projects/" + testProject.getId() + "/chapters/" + chapterId)
                .header("Authorization", "Bearer " + authToken));

        // then
        deleteResponse.andExpect(status().isOk());

        // Verify chapter is deleted
        mockMvc.perform(get("/api/projects/" + testProject.getId() + "/chapters/" + chapterId)
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isNotFound());
    }
} 