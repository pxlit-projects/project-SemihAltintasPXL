import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AllPostsComponent } from './all-posts.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { Comment } from './../../models/comment.module';  // Import your Comment class

describe('AllPostsComponent', () => {
  let component: AllPostsComponent;
  let fixture: ComponentFixture<AllPostsComponent>;
  let postServiceMock: any;
  let commentServiceMock: any;

  beforeEach(async () => {
    postServiceMock = {
      getAllApprovedPosts: jasmine.createSpy('getAllApprovedPosts').and.returnValue(of([{ id: 1, author: 'Author', content: 'Content', created: '2025-01-10' }])),
    };

    commentServiceMock = {
      getAllCommentsByPostId: jasmine.createSpy('getAllCommentsByPostId').and.returnValue(of([new Comment('User1', 'Great post!', 1)])),
      createComment: jasmine.createSpy('createComment').and.returnValue(of(new Comment('User1', 'Nice post!', 1))),
      deleteComment: jasmine.createSpy('deleteComment').and.returnValue(of({})),
      updateComment: jasmine.createSpy('updateComment').and.returnValue(of(new Comment('User1', 'Updated comment!', 1)))
    };

    await TestBed.configureTestingModule({
      imports: [
        AllPostsComponent,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        NavbarComponent
      ],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: CommentService, useValue: commentServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '456' } } } },
        AuthService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AllPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch posts on initialization', () => {
    component.ngOnInit();
    expect(postServiceMock.getAllApprovedPosts).toHaveBeenCalled();
    expect(component.posts.length).toBe(1);
  });

  it('should fetch comments for a post', () => {
    component.ngOnInit();
    expect(commentServiceMock.getAllCommentsByPostId).toHaveBeenCalledWith(1);
    expect(component.comments[1].length).toBe(1);
  });

  it('should filter posts based on author', () => {
    component.filterType = 'author';
    component.filterValue = 'Author';
    const filteredPosts = component.filteredPosts();
    expect(filteredPosts.length).toBe(1);
  });

  it('should filter posts based on content', () => {
    component.filterType = 'content';
    component.filterValue = 'Content';
    const filteredPosts = component.filteredPosts();
    expect(filteredPosts.length).toBe(1);
  });

  it('should create a comment', () => {
    const newComment: Comment = new Comment('User1', 'Nice post!', 1);
    component.createComment(newComment);
    expect(commentServiceMock.createComment).toHaveBeenCalledWith(newComment);
  });

  it('should delete a comment', () => {
    const commentId = 1;
    const postId = 1;
    component.deleteComment(commentId, postId);
    expect(commentServiceMock.deleteComment).toHaveBeenCalledWith(commentId);
    expect(commentServiceMock.getAllCommentsByPostId).toHaveBeenCalledWith(postId);
  });

  it('should start editing a comment', () => {
    const comment = new Comment('User1', 'Great post!', 1);
    comment.id = 1;
    component.startEditingComment(comment);
    expect(component.editingCommentId).toBe(1);
    expect(component.commentForm.value.commentMessage).toBe('Great post!');
  });

  it('should save edited comment', () => {
    const updatedComment: Comment = new Comment('User1', 'Updated comment', 1);
    updatedComment.id = 1;

    spyOn(localStorage, 'getItem').and.returnValue('User1');

    // Set the comment form with values
    component.editingCommentId = 1;
    component.commentForm.setValue({
      commentId: 1,
      commentMessage: 'Updated comment',
    });

    component.saveCommentEdit(1);

  });

  it('should cancel comment edit', () => {
    component.cancelCommentEdit();
    expect(component.editingCommentId).toBeNull();
  });
});
