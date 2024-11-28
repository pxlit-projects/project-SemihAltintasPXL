package be.pxl.services.services;


import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.exception.PostNotFoundException;

import java.util.List;

public interface IPostService {
    List<PostResponse> getAllPosts();
    PostResponse savePostAsConcept(PostRequest postRequest);
    void changeConceptToApproved(long id) throws PostNotFoundException;
    void deleteAllPosts();
    List<PostResponse> getApprovedPosts();
    List<PostResponse> getPendingPosts();
    void updatePost(long id, PostRequest postRequest) throws PostNotFoundException;
}
