package be.pxl.controller;

import be.pxl.services.PostServiceApplication;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.PostStatus;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.repository.PostRepository;
import be.pxl.services.services.PostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
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

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
@ContextConfiguration(classes = PostServiceApplication.class)
public class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PostRepository postRepository;

    @Container
    private static final MySQLContainer container = new MySQLContainer("mysql:5.7.37");
    @Autowired
    private PostService postService;

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", container::getJdbcUrl);
        registry.add("spring.datasource.username", container::getUsername);
        registry.add("spring.datasource.password", container::getPassword);
    }

    @BeforeEach
    void setUp() {
        postRepository.deleteAll();
    }

    @Test
    void shouldReturnPostById() throws Exception {
        Post post = new Post(1L, "Test Post", "This is a test post.", "Author", LocalDate.now(), PostStatus.APPROVED);
        PostResponse postResponse = new PostResponse(
                post.getId(), post.getTitle(), post.getContent(), post.getAuthor(), post.getCreated(), post.getStatus()
        );
        when(postRepository.findById(1L)).thenReturn(java.util.Optional.of(post));

        mockMvc.perform(get("/api/post/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Test Post")))
                .andExpect(jsonPath("$.content", is("This is a test post.")))
                .andExpect(jsonPath("$.author", is("Author")))
                .andExpect(jsonPath("$.status", is("APPROVED")));
    }

    @Test
    void shouldReturnAllApprovedPosts() throws Exception {
        List<Post> approvedPosts = Arrays.asList(
                new Post(1L, "Approved Post 1", "Content 1", "Author 1", LocalDate.now(), PostStatus.APPROVED),
                new Post(2L, "Approved Post 2", "Content 2", "Author 2", LocalDate.now(), PostStatus.APPROVED)
        );
        when(postRepository.findAllByStatus(PostStatus.APPROVED)).thenReturn(approvedPosts);

        mockMvc.perform(get("/api/post/approved"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title", is("Approved Post 1")))
                .andExpect(jsonPath("$[1].title", is("Approved Post 2")));
    }

    @Test
    void shouldReturnAllPendingPosts() throws Exception {
        List<Post> pendingPosts = Arrays.asList(
                new Post(1L, "Pending Post 1", "Content 1", "Author 1", LocalDate.now(), PostStatus.PENDING),
                new Post(2L, "Pending Post 2", "Content 2", "Author 2", LocalDate.now(), PostStatus.PENDING)
        );
        when(postRepository.findAllByStatus(PostStatus.PENDING)).thenReturn(pendingPosts);

        mockMvc.perform(get("/api/post/pending"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title", is("Pending Post 1")))
                .andExpect(jsonPath("$[1].title", is("Pending Post 2")));
    }

    @Test
    void shouldReturnAllRejectedPosts() throws Exception {
        List<Post> rejectedPosts = Arrays.asList(
                new Post(1L, "Rejected Post 1", "Content 1", "Author 1", LocalDate.now(), PostStatus.REJECTED),
                new Post(2L, "Rejected Post 2", "Content 2", "Author 2", LocalDate.now(), PostStatus.REJECTED)
        );
        when(postRepository.findAllByStatus(PostStatus.REJECTED)).thenReturn(rejectedPosts);

        mockMvc.perform(get("/api/post/rejected"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title", is("Rejected Post 1")))
                .andExpect(jsonPath("$[1].title", is("Rejected Post 2")));
    }

    @Test
    void shouldUpdatePost() throws Exception {
        PostRequest postRequest = new PostRequest();
        postRequest.setTitle("Updated Post");
        postRequest.setContent("Updated content for the post.");

        Post post = new Post(1L, "Original Post", "Original content", "Author", LocalDate.now(), PostStatus.PENDING);
        when(postRepository.findById(1L)).thenReturn(java.util.Optional.of(post));

        mockMvc.perform(put("/api/post/update/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isOk());

        verify(postRepository, times(1)).save(any());
    }
    @Test
    void shouldReturnAllPosts() throws Exception {
        mockMvc.perform(get("/api/post"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void shouldSavePostAsConcept() throws Exception {
        PostRequest postRequest = new PostRequest();
        postRequest.setTitle("Test Post");
        postRequest.setContent("This is a test post.");

        mockMvc.perform(post("/api/post/concept")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Test Post")))
                .andExpect(jsonPath("$.content", is("This is a test post.")));
    }

}
