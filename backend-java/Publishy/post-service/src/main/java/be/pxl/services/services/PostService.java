package be.pxl.services.services;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService{
    private final PostRepository postRepository;

    @Override
    public PostResponse createPost(PostRequest postRequest) {
        Post post = postRepository.save(mapToPostResponse(postRequest));
        return mapPostToPostResponse(post);
    }
    private PostResponse mapPostToPostResponse(Post post) {
        return PostResponse.builder()
                .title(post.getTitle())
                .content(post.getContent())
                .build();
    }
    private Post mapToPostResponse(PostRequest postRequest) {
        return Post.builder()
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .build();
    }
}
