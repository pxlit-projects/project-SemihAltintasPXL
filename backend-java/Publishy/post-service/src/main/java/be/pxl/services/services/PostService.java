package be.pxl.services.services;

import be.pxl.services.client.NotificationClient;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.PostStatus;
import be.pxl.services.domain.dto.NotificationRequest;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.exception.PostNotFoundException;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService {
    private static final Logger logger = LoggerFactory.getLogger(PostService.class);

    private final PostRepository postRepository;
    private final RabbitTemplate rabbitTemplate;
    private final NotificationClient notificationClient;

    @Override
    public List<PostResponse> getAllPosts() {
        logger.info("Fetching all posts");
        return postRepository.findAll().stream().map(this::mapPostToPostResponse).toList();
    }

    @Override
    public PostResponse savePostAsConcept(PostRequest postRequest) {
        logger.info("Saving post as concept: {}", postRequest);
        Post post = mapToPostResponse(postRequest);
        post.setStatus(PostStatus.PENDING);
        post.setCreated(LocalDate.now());
        postRepository.save(post);
        rabbitTemplate.convertAndSend("myQueue", "Added Post");
        logger.info("Post saved as concept with ID: {}", post.getId());
        return mapPostToPostResponse(post);
    }

    @Override
    @RabbitListener(queues = "approvePostQueue")
    public void changeConceptToApproved(Long id) throws PostNotFoundException {
        logger.info("Changing post to approved with ID: {}", id);
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post not found with id: " + id));
        post.setStatus(PostStatus.APPROVED);
        postRepository.save(post);
        NotificationRequest notificationRequest = new NotificationRequest();
        notificationRequest.setMessage(post.getId() + " has been approved");
        notificationRequest.setReceiver("mmsemih51@gmail.com");
        notificationRequest.setSubject("Post Approved");
        notificationClient.sendNotification(notificationRequest);
        logger.info("Post approved and notification sent for post ID: {}", post.getId());
    }

    @Override
    @RabbitListener(queues = "rejectPostQueue")
    public void changeConceptToRejected(Long id) throws PostNotFoundException {
        logger.info("Changing post to rejected with ID: {}", id);
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post not found with id: " + id));
        post.setStatus(PostStatus.REJECTED);
        postRepository.save(post);
        NotificationRequest notificationRequest = new NotificationRequest();
        notificationRequest.setMessage(post.getId() + " has been rejected");
        notificationRequest.setReceiver("mmsemih51@gmail.com");
        notificationRequest.setSubject("Post Rejected");
        notificationClient.sendNotification(notificationRequest);
        logger.info("Post rejected and notification sent for post ID: {}", post.getId());
    }


    @Override
    public List<PostResponse> getApprovedPosts() {
        logger.info("Fetching all approved posts");
        return postRepository.findAllByStatus(PostStatus.APPROVED).stream().map(this::mapPostToPostResponse).toList();
    }

    @Override
    public List<PostResponse> getPendingPosts() {
        logger.info("Fetching all pending posts");
        return postRepository.findAllByStatus(PostStatus.PENDING).stream().map(this::mapPostToPostResponse).toList();
    }

    @Override
    public List<PostResponse> getRejectedPosts() {
        logger.info("Fetching all rejected posts");
        return postRepository.findAllByStatus(PostStatus.REJECTED).stream().map(this::mapPostToPostResponse).toList();
    }

    @Override
    public void updatePost(Long id, PostRequest postRequest) throws PostNotFoundException {
        logger.info("Updating post with ID: {}", id);
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post not found with id: " + id));
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        postRepository.save(post);
        logger.info("Post updated with ID: {}", post.getId());
    }

    @Override
    public Post getPostById(Long id) throws PostNotFoundException {
        logger.info("Fetching post by ID: {}", id);
        return postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post not found with id: " + id));
    }

    private PostResponse mapPostToPostResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .author(post.getAuthor())
                .created(post.getCreated())
                .status(post.getStatus())
                .build();
    }

    private Post mapToPostResponse(PostRequest postRequest) {
        return Post.builder()
                .id(postRequest.getId())
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .author(postRequest.getAuthor())
                .created(postRequest.getCreated())
                .build();
    }
}