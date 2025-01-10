package be.pxl.controller;

import be.pxl.services.ReviewServiceApplication;
import be.pxl.services.domain.dto.RejectPostRequest;
import be.pxl.services.domain.dto.ReviewResponse;
import be.pxl.services.service.ReviewService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
@ContextConfiguration(classes = ReviewServiceApplication.class)
public class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

    @MockBean
    private ReviewService reviewService;

    @Container
    private static final MySQLContainer container = new MySQLContainer("mysql:5.7.37");

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", container::getJdbcUrl);
        registry.add("spring.datasource.username", container::getUsername);
        registry.add("spring.datasource.password", container::getPassword);
    }

    @Test
    public void testChangeConceptToApproved() throws Exception {
        Long postId = 1L;

        mockMvc.perform(post("/api/review/approve/{postId}", postId))
                .andExpect(MockMvcResultMatchers.status().isOk());

        verify(reviewService, times(1)).changeConceptToApproved(postId);
    }

    @Test
    public void testChangeConceptToRejected() throws Exception {
        RejectPostRequest rejectPostRequest = new RejectPostRequest(
                "Author Name",
                "This post does not meet the guidelines",
                1L
        );

        // Perform a POST request to /api/review/reject
        mockMvc.perform(post("/api/review/reject")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(rejectPostRequest)))
                .andExpect(MockMvcResultMatchers.status().isOk());

        // Verify that the reviewService's changeConceptToRejected method was called once
        verify(reviewService, times(1)).changeConceptToRejected(any(RejectPostRequest.class));
    }

    @Test
    public void testGetReviewById() throws Exception {
        Long reviewId = 1L;
        ReviewResponse reviewResponse = new ReviewResponse(
                reviewId,
                123L,
                "John Doe",
                "This is a sample review message"
        );

        // Mock the behavior of the reviewService
        when(reviewService.getReviewById(reviewId)).thenReturn(reviewResponse);

        // Perform a GET request to /api/review/{id}
        mockMvc.perform(get("/api/review/{id}", reviewId))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(reviewId))
                .andExpect(MockMvcResultMatchers.jsonPath("$.postId").value(123L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.reviewAuthor").value("John Doe"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.reviewMessage").value("This is a sample review message"));

        // Verify that the reviewService's getReviewById method was called once
        verify(reviewService, times(1)).getReviewById(reviewId);
    }
}
