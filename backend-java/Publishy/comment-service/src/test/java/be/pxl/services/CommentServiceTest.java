package be.pxl.services;

import be.pxl.services.domain.Comment;
import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.exception.CommentNotFoundException;
import be.pxl.services.repository.CommentRepository;
import be.pxl.services.service.CommentService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private CommentService commentService;

    public CommentServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void deleteCommentById_ShouldDeleteComment() {
        Long commentId = 1L;
        doNothing().when(commentRepository).deleteById(commentId);

        commentService.deleteCommentById(commentId);

        verify(commentRepository, times(1)).deleteById(commentId);
    }

    @Test
    void updateCommentById_ShouldUpdateComment() throws CommentNotFoundException {
        Long commentId = 1L;
        CommentRequest commentRequest = new CommentRequest();
        commentRequest.setCommentMessage("Updated message.");
        commentRequest.setCommentAuthor("Updated author.");

        Comment existingComment = Comment.builder()
                .id(commentId)
                .postId(1L)
                .commentAuthor("Author1")
                .commentMessage("Old message.")
                .build();

        Comment updatedComment = Comment.builder()
                .id(commentId)
                .postId(1L)
                .commentAuthor(commentRequest.getCommentAuthor())
                .commentMessage(commentRequest.getCommentMessage())
                .build();

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(existingComment));
        when(commentRepository.save(any(Comment.class))).thenReturn(updatedComment);

        commentService.updateCommentById(commentId, commentRequest);

        assertEquals(updatedComment.getCommentMessage(), commentRequest.getCommentMessage());
        assertEquals(updatedComment.getCommentAuthor(), commentRequest.getCommentAuthor());

        verify(commentRepository, times(1)).findById(commentId);
        verify(commentRepository, times(1)).save(existingComment);
    }


    @Test
    void updateCommentById_ShouldThrowCommentNotFoundException() {
        Long commentId = 1L;
        CommentRequest commentRequest = new CommentRequest();
        commentRequest.setCommentMessage("Updated message.");
        commentRequest.setCommentAuthor("Updated author.");

        when(commentRepository.findById(commentId)).thenReturn(Optional.empty());

        assertThrows(CommentNotFoundException.class, () -> commentService.updateCommentById(commentId, commentRequest));

        verify(commentRepository, times(1)).findById(commentId);
        verify(commentRepository, never()).save(any(Comment.class));
    }

    @Test
    void getAllCommentsByPostId_ShouldReturnListOfComments() {
        Long postId = 1L;
        Comment comment1 = Comment.builder()
                .id(1L)
                .postId(postId)
                .commentMessage("First comment.")
                .commentAuthor("Author1")
                .build();

        Comment comment2 = Comment.builder()
                .id(2L)
                .postId(postId)
                .commentMessage("Second comment.")
                .commentAuthor("Author2")
                .build();

        List<Comment> comments = Arrays.asList(comment1, comment2);

        when(commentRepository.findAllByPostId(postId)).thenReturn(comments);

        List<Comment> retrievedComments = commentService.getAllCommentsByPostId(postId);

        assertNotNull(retrievedComments);
        assertEquals(2, retrievedComments.size());
        assertEquals(comment1, retrievedComments.get(0));
        assertEquals(comment2, retrievedComments.get(1));

        verify(commentRepository, times(1)).findAllByPostId(postId);
    }
}
