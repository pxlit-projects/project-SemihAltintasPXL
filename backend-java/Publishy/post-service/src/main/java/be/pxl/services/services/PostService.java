package be.pxl.services.services;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.PostStatus;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService{
    private final PostRepository postRepository;


    @Override
    public List<PostResponse> getAllPosts() {
         return postRepository.findAll().stream().map(this::mapPostToPostResponse).toList();
    }

    @Override
    public PostResponse savePostAsConcept(PostRequest postRequest) {
        Post post = postRepository.save(mapToPostResponse(postRequest));
        post.setStatus(PostStatus.PENDING);
        return mapPostToPostResponse(post);
    }

    @Override
    public void changeConceptToApproved(Long id) {
        Post post = postRepository.findById(id).orElseThrow();
        post.setStatus(PostStatus.APPROVED);
        postRepository.save(post);
    }

    private PostResponse mapPostToPostResponse(Post post) {
        return PostResponse.builder()
                .title(post.getTitle())
                .content(post.getContent())
                .author(post.getAuthor())
                .created(post.getCreated())
                .build();
    }
    private Post mapToPostResponse(PostRequest postRequest) {
        return Post.builder()
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .author(postRequest.getAuthor())
                .created(postRequest.getCreated())
                .build();
    }
}
