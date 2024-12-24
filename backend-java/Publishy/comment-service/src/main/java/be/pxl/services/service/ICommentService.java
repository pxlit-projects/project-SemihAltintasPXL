package be.pxl.services.service;

import be.pxl.services.domain.Comment;
import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.exception.CommentNotFoundException;

import java.util.List;

public interface ICommentService {
    Comment createComment(CommentRequest commentRequest);
    void deleteCommentById(Long commentId);
    void updateCommentById(Long commentId, CommentRequest commentRequest) throws CommentNotFoundException;
    List<Comment> getAllCommentsByPostId(Long postId);
}
