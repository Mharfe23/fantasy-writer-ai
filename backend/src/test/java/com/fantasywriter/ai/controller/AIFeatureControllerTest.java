package com.fantasywriter.ai.controller;

import com.fantasywriter.BaseIntegrationTest;
import com.fantasywriter.project.entity.Chapter;
import com.fantasywriter.project.entity.Project;
import com.fantasywriter.project.repository.ChapterRepository;
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

class AIFeatureControllerTest extends BaseIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private TestJwtTokenProvider tokenProvider;

    private String authToken;
    private User testUser;
    private Project testProject;
    private Chapter testChapter;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        projectRepository.deleteAll();
        chapterRepository.deleteAll();
        
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

        // Create test chapter
        testChapter = new Chapter();
        testChapter.setTitle("Test Chapter");
        testChapter.setContent("Test Content");
        testChapter.setProject(testProject);
        chapterRepository.save(testChapter);

        // Generate token
        authToken = tokenProvider.generateToken(TEST_USERNAME);
    }

    @Test
    void whenGenerateImage_thenReturnsImageUrl() throws Exception {
        // given
        Map<String, String> promptData = new HashMap<>();
        promptData.put("prompt", "A magical forest scene");

        // when
        ResultActions response = mockMvc.perform(post("/api/chapters/" + testChapter.getId() + "/generate-image")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(promptData)));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.imageUrl").exists());
    }

    @Test
    void whenGenerateAudio_thenReturnsAudioUrl() throws Exception {
        // given
        Map<String, String> audioData = new HashMap<>();
        audioData.put("voice", "male");

        // when
        ResultActions response = mockMvc.perform(post("/api/chapters/" + testChapter.getId() + "/generate-audio")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(audioData)));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.audioUrl").exists());
    }

    @Test
    void whenGenerateSummary_thenReturnsSummary() throws Exception {
        // when
        ResultActions response = mockMvc.perform(post("/api/chapters/" + testChapter.getId() + "/generate-summary")
                .header("Authorization", "Bearer " + authToken));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.summary").exists());
    }

    @Test
    void whenInsufficientTokens_thenReturnsError() throws Exception {
        // given
        testUser.setTokenBalance(0);
        userRepository.save(testUser);

        Map<String, String> promptData = new HashMap<>();
        promptData.put("prompt", "A magical forest scene");

        // when
        ResultActions response = mockMvc.perform(post("/api/chapters/" + testChapter.getId() + "/generate-image")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(promptData)));

        // then
        response.andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Insufficient tokens"));
    }

    @Test
    void whenGetImagePrompts_thenReturnsPromptList() throws Exception {
        // given
        Map<String, String> promptData = new HashMap<>();
        promptData.put("prompt", "A magical forest scene");

        // Create an image prompt
        mockMvc.perform(post("/api/chapters/" + testChapter.getId() + "/generate-image")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(promptData)));

        // when
        ResultActions response = mockMvc.perform(get("/api/chapters/" + testChapter.getId() + "/image-prompts")
                .header("Authorization", "Bearer " + authToken));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$[0].prompt").value("A magical forest scene"))
                .andExpect(jsonPath("$[0].imageUrl").exists());
    }

    @Test
    void whenGetAudioVersions_thenReturnsAudioList() throws Exception {
        // given
        Map<String, String> audioData = new HashMap<>();
        audioData.put("voice", "male");

        // Create an audio version
        mockMvc.perform(post("/api/chapters/" + testChapter.getId() + "/generate-audio")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(audioData)));

        // when
        ResultActions response = mockMvc.perform(get("/api/chapters/" + testChapter.getId() + "/audio-versions")
                .header("Authorization", "Bearer " + authToken));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$[0].voice").value("male"))
                .andExpect(jsonPath("$[0].audioUrl").exists());
    }

    @Test
    void whenGetSummaries_thenReturnsSummaryList() throws Exception {
        // given
        // Create a summary
        mockMvc.perform(post("/api/chapters/" + testChapter.getId() + "/generate-summary")
                .header("Authorization", "Bearer " + authToken));

        // when
        ResultActions response = mockMvc.perform(get("/api/chapters/" + testChapter.getId() + "/summaries")
                .header("Authorization", "Bearer " + authToken));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$[0].summary").exists());
    }
} 