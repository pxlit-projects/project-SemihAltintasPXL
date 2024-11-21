package be.pxl.services.controller;

import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.services.IPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("api/post")
@RequiredArgsConstructor
public class PostController {
    private final IPostService postService;

    @PostMapping
    public ResponseEntity createPost(@RequestBody PostRequest postRequest) {
        return new ResponseEntity(postService.createPost(postRequest), HttpStatus.CREATED);
    }
}
