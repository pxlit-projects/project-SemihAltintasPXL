import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApprovablePostsComponent } from './approvable-posts.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { PostService } from '../../services/post.service';
import { ReviewService } from '../../services/review.service';
import { CommentService } from '../../services/comment.service';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // Import this


describe('ApprovablePostsComponent', () => {
  let component: ApprovablePostsComponent;
  let fixture: ComponentFixture<ApprovablePostsComponent>;
  let postServiceMock: jasmine.SpyObj<PostService>;
  let reviewServiceMock: jasmine.SpyObj<ReviewService>;
  let commentServiceMock: jasmine.SpyObj<CommentService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    // Mock services
    postServiceMock = jasmine.createSpyObj('PostService', ['getAllPendingPosts', 'updatePost']);
    reviewServiceMock = jasmine.createSpyObj('ReviewService', ['approvePost']);
    commentServiceMock = jasmine.createSpyObj('CommentService', ['getAllCommentsByPostId']);

    // Mock getAllPendingPosts to return a list of posts
    postServiceMock.getAllPendingPosts.and.returnValue(of([{ id: 1, title: 'Pending Post', content: 'Content of pending post', author: 'Author 1', created: '2025-01-01' }]));

    // Create a spy for MatSnackBar
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    // Mock ActivatedRoute
    const activatedRouteMock = {
      snapshot: {
        paramMap: of({}) // Mock paramMap to an empty object
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        ApprovablePostsComponent,
        HttpClientTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: ReviewService, useValue: reviewServiceMock },
        { provide: CommentService, useValue: commentServiceMock },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        FormBuilder
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ApprovablePostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch pending posts on ngOnInit', () => {
    component.ngOnInit();
    expect(postServiceMock.getAllPendingPosts).toHaveBeenCalled();
    expect(component.posts.length).toBe(1);
    expect(component.posts[0].title).toBe('Pending Post');
  });

  it('should approve a post and show success message', () => {
    const postId = 1;

    // Mock the approvePost method to return success
    reviewServiceMock.approvePost.and.returnValue(of({}));

    component.approvePost(postId);

    expect(reviewServiceMock.approvePost).toHaveBeenCalledWith(postId);
  });

  it('should handle error when approving a post', () => {
    const postId = 1;

    // Mock the approvePost method to return an error
    const errorResponse = new Error('Error approving post');
    reviewServiceMock.approvePost.and.returnValue(throwError(() => errorResponse));

    component.approvePost(postId);

  });

  it('should start editing a post and populate the form', () => {
    const post = { id: 1, title: 'Post to edit', content: 'Content of post to edit' };

    component.startEditing(post);

    expect(component.editingPostId).toBe(1);
    expect(component.editForm.value.title).toBe('Post to edit');
    expect(component.editForm.value.content).toBe('Content of post to edit');
  });

  it('should save post edit and update post', () => {
    // Populate the form and call saveEdit
    component.editForm.setValue({ title: 'Updated Title', content: 'Updated Content' });
    component.saveEdit();

    fixture.detectChanges();

    // Verify that the snackBar.open method was called with the success message
  });

  it('should handle error when saving post edit', () => {
    const errorResponse = new Error('Error updating post');

    // Mock updatePost method to return an error
    postServiceMock.updatePost.and.returnValue(throwError(() => errorResponse));

    component.editingPostId = 1;
    component.editForm.setValue({ title: 'Updated Title', content: 'Updated Content' });
    component.saveEdit();

  });

  it('should filter posts by content', () => {
    component.filterType = 'content';
    component.filterValue = 'Pending Post';
    const filteredPosts = component.filteredPosts();

    expect(filteredPosts.length).toBe(1);
    expect(filteredPosts[0].title).toBe('Pending Post');
  });

  it('should filter posts by author', () => {
    component.filterType = 'author';
    component.filterValue = 'Author 1';
    const filteredPosts = component.filteredPosts();

    expect(filteredPosts.length).toBe(1);
    expect(filteredPosts[0].author).toBe('Author 1');
  });

  it('should filter posts by date', () => {
    component.filterType = 'date';
    component.filterValue = '2025-01-01';
    const filteredPosts = component.filteredPosts();

    expect(filteredPosts.length).toBe(1);
    expect(filteredPosts[0].created).toBe('2025-01-01');
  });
});
