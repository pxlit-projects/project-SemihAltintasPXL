package be.pxl.services.services;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.PostStatus;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.exception.PostNotFoundException;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService{
    private final PostRepository postRepository;
    private final RabbitTemplate rabbitTemplate;



    @Override
    public List<PostResponse> getAllPosts() {
         return postRepository.findAll().stream().map(this::mapPostToPostResponse).toList();
    }

    @Override
    public PostResponse savePostAsConcept(PostRequest postRequest) {
        Post post = mapToPostResponse(postRequest);
        post.setStatus(PostStatus.PENDING);
        post.setCreated(LocalDate.now());
        postRepository.save(post);
        rabbitTemplate.convertAndSend("myQueue", "Added Post");
        return mapPostToPostResponse(post);
    }

    @Override
    public void changeConceptToApproved(long id) throws PostNotFoundException {
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post not found with id: " + id));
        post.setStatus(PostStatus.APPROVED);
        postRepository.save(post);
    }

    @Override
    public void deleteAllPosts() {
        postRepository.deleteAll();
    }

    @Override
    public List<PostResponse> getApprovedPosts() {
        return postRepository.findAllByStatus(PostStatus.APPROVED).stream().map(this::mapPostToPostResponse).toList();
    }

    @Override
    public List<PostResponse> getPendingPosts() {
        return postRepository.findAllByStatus(PostStatus.PENDING).stream().map(this::mapPostToPostResponse).toList();
    }

    @Override
    public void updatePost(long id, PostRequest postRequest) throws PostNotFoundException {
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post not found with id: " + id));
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        postRepository.save(post);
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
