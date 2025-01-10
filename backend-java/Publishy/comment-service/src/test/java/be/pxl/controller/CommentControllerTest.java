package be.pxl.controller;

import be.pxl.services.CommentServiceApplication;
import be.pxl.services.domain.Comment;
import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.service.CommentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
@ContextConfiguration(classes = CommentServiceApplication.class)
public class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

    @MockBean
    private CommentService commentService;
    @Container
    private static final MySQLContainer container = new MySQLContainer("mysql:5.7.37");

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", container::getJdbcUrl);
        registry.add("spring.datasource.username", container::getUsername);
        registry.add("spring.datasource.password", container::getPassword);
    }

    @Test
    void createComment_ShouldReturnCreatedComment() throws Exception {
        CommentRequest commentRequest = new CommentRequest();
        commentRequest.setPostId(1L);
        commentRequest.setCommentMessage("This is a comment.");
        commentRequest.setCommentAuthor("Author1");

        Comment comment = Comment.builder()
                .id(1L)
                .postId(1L)
                .commentMessage("This is a comment.")
                .commentAuthor("Author1")
                .build();

        when(commentService.createComment(any(CommentRequest.class))).thenReturn(comment);

        mockMvc.perform(post("/api/comment/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(comment.getId()))
                .andExpect(jsonPath("$.commentMessage").value(comment.getCommentMessage()))
                .andExpect(jsonPath("$.commentAuthor").value(comment.getCommentAuthor()));
    }

    @Test
    void getAllCommentsByPostId_ShouldReturnListOfComments() throws Exception {
        Long postId = 1L;
        Comment comment1 = Comment.builder()
                .id(1L)
                .postId(postId)
                .commentMessage("First comment.")
                .commentAuthor("Author1")
                .build();

        Comment comment2 = Comment.builder()
                .id(2L)
                .postId(postId)
                .commentMessage("Second comment.")
                .commentAuthor("Author2")
                .build();

        List<Comment> comments = Arrays.asList(comment1, comment2);

        when(commentService.getAllCommentsByPostId(postId)).thenReturn(comments);

        mockMvc.perform(get("/api/comment/{postId}", postId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(comment1.getId()))
                .andExpect(jsonPath("$[0].commentMessage").value(comment1.getCommentMessage()))
                .andExpect(jsonPath("$[0].commentAuthor").value(comment1.getCommentAuthor()))
                .andExpect(jsonPath("$[1].id").value(comment2.getId()))
                .andExpect(jsonPath("$[1].commentMessage").value(comment2.getCommentMessage()))
                .andExpect(jsonPath("$[1].commentAuthor").value(comment2.getCommentAuthor()));
    }

    @Test
    void updateCommentById_ShouldReturnOkStatus() throws Exception {
        Long commentId = 1L;
        CommentRequest commentRequest = new CommentRequest();
        commentRequest.setCommentMessage("Updated comment content.");
        commentRequest.setCommentAuthor("Updated Author");

        doNothing().when(commentService).updateCommentById(commentId, commentRequest);

        mockMvc.perform(put("/api/comment/{commentId}", commentId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isOk());
    }

    @Test
    void deleteCommentById_ShouldReturnOkStatus() throws Exception {
        Long commentId = 1L;

        doNothing().when(commentService).deleteCommentById(commentId);

        mockMvc.perform(delete("/api/comment/{commentId}", commentId))
                .andExpect(status().isOk());
    }
}
