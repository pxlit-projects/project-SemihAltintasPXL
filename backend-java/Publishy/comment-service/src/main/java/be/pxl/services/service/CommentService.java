package be.pxl.services.service;

import be.pxl.services.domain.Comment;
import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;
import be.pxl.services.exception.CommentNotFoundException;
import be.pxl.services.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService implements ICommentService {
    private final CommentRepository commentRepository;


    @Override
    public Comment createComment(CommentRequest commentRequest) {
        Comment comment = new Comment();
        comment.setPostId(commentRequest.getPostId());
        comment.setCommentAuthor(commentRequest.getCommentAuthor());
        comment.setCommentMessage(commentRequest.getCommentMessage());
        commentRepository.save(comment);
        return comment;
    }

    @Override
    public void deleteCommentById(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    @Override
    public void updateCommentById(Long commentId, CommentRequest commentRequest) throws CommentNotFoundException {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException("Comment not found"));
        comment.setCommentMessage(commentRequest.getCommentMessage());
        commentRepository.save(comment);
    }


    @Override
    public List<Comment> getAllCommentsByPostId(Long postId) {
        return commentRepository.findAllByPostId(postId);
    }
}
