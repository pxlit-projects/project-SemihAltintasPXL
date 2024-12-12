package be.pxl.services.services;


import be.pxl.services.domain.Post;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.exception.PostNotFoundException;

import java.util.List;

public interface IPostService {
    List<PostResponse> getAllPosts();
    PostResponse savePostAsConcept(PostRequest postRequest);
    void changeConceptToApproved(Long id) throws PostNotFoundException;
    void changeConceptToRejected(Long id) throws PostNotFoundException;

    void deleteAllPosts();
    List<PostResponse> getApprovedPosts();
    List<PostResponse> getPendingPosts();
    List<PostResponse> getRejectedPosts();
    void updatePost(Long id, PostRequest postRequest) throws PostNotFoundException;
    Post getPostById(Long id) throws PostNotFoundException;
}
