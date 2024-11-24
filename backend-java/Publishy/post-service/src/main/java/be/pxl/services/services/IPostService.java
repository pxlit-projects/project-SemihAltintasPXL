package be.pxl.services.services;


import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;

import java.util.List;

public interface IPostService {
    List<PostResponse> getAllPosts();
    PostResponse savePostAsConcept(PostRequest postRequest);
    void changeConceptToApproved(Long id);
}
