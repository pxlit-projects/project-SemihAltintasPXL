package be.pxl.services.controller;

import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.exception.PostNotFoundException;
import be.pxl.services.services.IPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("api/post")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class PostController {
    private final IPostService postService;

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        return new ResponseEntity<>(postService.getAllPosts(), HttpStatus.OK);
    }

    @PostMapping("/concept")
    public ResponseEntity savePostAsConcept(@RequestBody PostRequest postRequest) {
        return new ResponseEntity<>(postService.savePostAsConcept(postRequest), HttpStatus.CREATED);
    }
    @PutMapping("/approve/{id}")
    public ResponseEntity<Void> changeConceptToApproved(@PathVariable long id) throws PostNotFoundException {
        postService.changeConceptToApproved(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @DeleteMapping
    public ResponseEntity<Void> deleteAllPosts() {
        postService.deleteAllPosts();
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping("/approved")
    public ResponseEntity<List<PostResponse>> getApprovedPosts() {
        return new ResponseEntity<>(postService.getApprovedPosts(), HttpStatus.OK);
    }
    @GetMapping("/pending")
    public ResponseEntity<List<PostResponse>> getPendingPosts() {
        return new ResponseEntity<>(postService.getPendingPosts(), HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updatePost(@PathVariable long id, @RequestBody PostRequest postRequest) throws PostNotFoundException {
        postService.updatePost(id, postRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
