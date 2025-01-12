package be.pxl.services.controller;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.exception.PostNotFoundException;
import be.pxl.services.services.IPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("api/post")
@RequiredArgsConstructor
public class PostController {
    private final IPostService postService;

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        return new ResponseEntity<>(postService.getAllPosts(), HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) throws PostNotFoundException {
        return new ResponseEntity<>(postService.getPostById(id), HttpStatus.OK);
    }

    @PostMapping("/concept")
    public ResponseEntity savePostAsConcept(@RequestHeader("user-role") String userRole, @RequestBody PostRequest postRequest) {
        if (!userRole.equals("editor")) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        else {
            return new ResponseEntity<>(postService.savePostAsConcept(postRequest), HttpStatus.CREATED);
        }
    }
    @GetMapping("/approved")
    public ResponseEntity<List<PostResponse>> getApprovedPosts() {
        return new ResponseEntity<>(postService.getApprovedPosts(), HttpStatus.OK);
    }
    @GetMapping("/pending")
    public ResponseEntity<List<PostResponse>> getPendingPosts() {
        return new ResponseEntity<>(postService.getPendingPosts(), HttpStatus.OK);
    }
    @GetMapping("/rejected")
    public ResponseEntity<List<PostResponse>> getRejectedPosts() {
        return new ResponseEntity<>(postService.getRejectedPosts(), HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updatePost(@RequestHeader("user-role") String userRole, @PathVariable Long id, @RequestBody PostRequest postRequest) throws PostNotFoundException {
        if (!userRole.equals("editor")) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        else {
            postService.updatePost(id, postRequest);
            return new ResponseEntity<>(HttpStatus.OK);
        }

    }
}
