package be.pxl.services;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.PostStatus;
import be.pxl.services.domain.dto.NotificationRequest;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.exception.PostNotFoundException;
import be.pxl.services.repository.PostRepository;
import be.pxl.services.client.NotificationClient;
import be.pxl.services.services.PostService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @Mock
    private NotificationClient notificationClient;

    @InjectMocks
    private PostService postService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldReturnAllPosts() {
        Post post1 = new Post(1L, "Title 1", "Content 1", "Author", LocalDate.now(), PostStatus.APPROVED);
        Post post2 = new Post(2L, "Title 2", "Content 2", "Author", LocalDate.now(), PostStatus.PENDING);
        when(postRepository.findAll()).thenReturn(Arrays.asList(post1, post2));

        var posts = postService.getAllPosts();

        assertEquals(2, posts.size());
        assertEquals("Title 1", posts.get(0).getTitle());
    }

    @Test
    void shouldSavePostAsConcept() {
        PostRequest postRequest = new PostRequest();
        postRequest.setTitle("New Post");
        postRequest.setContent("This is a new post.");

        Post post = new Post();
        post.setId(1L);
        post.setTitle("New Post");
        post.setContent("This is a new post.");
        post.setStatus(PostStatus.PENDING);
        post.setCreated(LocalDate.now());

        when(postRepository.save(any(Post.class))).thenReturn(post);

        PostResponse postResponse = postService.savePostAsConcept(postRequest);

        assertNotNull(postResponse);
        assertEquals("New Post", postResponse.getTitle());
        verify(rabbitTemplate, times(1)).convertAndSend("myQueue", "Added Post");
    }

    @Test
    void shouldChangeConceptToApproved() throws PostNotFoundException {
        Post post = new Post(1L, "Title", "Content", "Author", LocalDate.now(), PostStatus.PENDING);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        postService.changeConceptToApproved(1L);

        assertEquals(PostStatus.APPROVED, post.getStatus());
        verify(notificationClient, times(1)).sendNotification(any(NotificationRequest.class));
        verify(postRepository, times(1)).save(post);
    }

    @Test
    void shouldThrowPostNotFoundExceptionWhenChangingConceptToApproved() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(PostNotFoundException.class, () -> postService.changeConceptToApproved(1L));
    }

    @Test
    void shouldChangeConceptToRejected() throws PostNotFoundException {
        Post post = new Post(1L, "Title", "Content", "Author", LocalDate.now(), PostStatus.PENDING);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        postService.changeConceptToRejected(1L);

        assertEquals(PostStatus.REJECTED, post.getStatus());
        verify(notificationClient, times(1)).sendNotification(any(NotificationRequest.class));
        verify(postRepository, times(1)).save(post);
    }

    @Test
    void shouldThrowPostNotFoundExceptionWhenChangingConceptToRejected() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(PostNotFoundException.class, () -> postService.changeConceptToRejected(1L));
    }

    @Test
    void shouldReturnAllApprovedPosts() {
        Post post1 = new Post(1L, "Title 1", "Content 1", "Author", LocalDate.now(), PostStatus.APPROVED);
        Post post2 = new Post(2L, "Title 2", "Content 2", "Author", LocalDate.now(), PostStatus.APPROVED);
        when(postRepository.findAllByStatus(PostStatus.APPROVED)).thenReturn(Arrays.asList(post1, post2));

        var posts = postService.getApprovedPosts();

        assertEquals(2, posts.size());
        assertEquals("Title 1", posts.get(0).getTitle());
    }

    @Test
    void shouldReturnAllPendingPosts() {
        Post post1 = new Post(1L, "Title 1", "Content 1", "Author", LocalDate.now(), PostStatus.PENDING);
        when(postRepository.findAllByStatus(PostStatus.PENDING)).thenReturn(Arrays.asList(post1));

        var posts = postService.getPendingPosts();

        assertEquals(1, posts.size());
        assertEquals("Title 1", posts.get(0).getTitle());
    }

    @Test
    void shouldReturnAllRejectedPosts() {
        Post post1 = new Post(1L, "Title 1", "Content 1", "Author", LocalDate.now(), PostStatus.REJECTED);
        when(postRepository.findAllByStatus(PostStatus.REJECTED)).thenReturn(Arrays.asList(post1));

        var posts = postService.getRejectedPosts();

        assertEquals(1, posts.size());
        assertEquals("Title 1", posts.get(0).getTitle());
    }

    @Test
    void shouldUpdatePost() throws PostNotFoundException {
        PostRequest postRequest = new PostRequest();
        postRequest.setTitle("Updated Post");
        postRequest.setContent("Updated Content");

        Post post = new Post(1L, "Old Title", "Old Content", "Author", LocalDate.now(), PostStatus.PENDING);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        postService.updatePost(1L, postRequest);

        assertEquals("Updated Post", post.getTitle());
        assertEquals("Updated Content", post.getContent());
        verify(postRepository, times(1)).save(post);
    }

    @Test
    void shouldThrowPostNotFoundExceptionWhenUpdatingNonExistingPost() {
        PostRequest postRequest = new PostRequest();
        postRequest.setTitle("Updated Post");
        postRequest.setContent("Updated Content");

        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(PostNotFoundException.class, () -> postService.updatePost(1L, postRequest));
    }

    @Test
    void shouldReturnPostById() throws PostNotFoundException {
        Post post = new Post(1L, "Title", "Content", "Author", LocalDate.now(), PostStatus.PENDING);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        Post fetchedPost = postService.getPostById(1L);

        assertEquals(post.getId(), fetchedPost.getId());
        assertEquals(post.getTitle(), fetchedPost.getTitle());
    }

    @Test
    void shouldThrowPostNotFoundExceptionWhenPostNotFoundById() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(PostNotFoundException.class, () -> postService.getPostById(1L));
    }
}
