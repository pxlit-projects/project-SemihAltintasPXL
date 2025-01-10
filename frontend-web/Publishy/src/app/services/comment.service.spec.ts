import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from './comment.service';
import { Comment } from '../models/comment.module';  // Import the Comment class
import { environment } from '../../environments/environment';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiUrl}comment/api/comment`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService]
    });
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // Ensure there are no pending requests after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call createComment and return the created comment', () => {
    const mockComment: Comment = new Comment('Author 1', 'This is a comment', 1);
    mockComment.id = 1;  // Simulating an ID being returned after creation

    service.createComment(mockComment).subscribe(comment => {
      expect(comment).toEqual(mockComment);
    });

    const req = httpMock.expectOne(`${baseUrl}/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockComment);
    req.flush(mockComment);  // Mocking the response
  });


  it('should call deleteComment and return the status', () => {
    const mockCommentId = 1;

    service.deleteComment(mockCommentId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);  // Mocking a successful deletion with no response body
  });

  it('should call updateComment and return the updated comment', () => {
    const updatedComment: Comment = new Comment('Updated Author', 'Updated content', 1);
    updatedComment.id = 1;

    service.updateComment(1, updatedComment).subscribe(comment => {
      expect(comment).toEqual(updatedComment);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedComment);
    req.flush(updatedComment);  // Mocking the response
  });
});
