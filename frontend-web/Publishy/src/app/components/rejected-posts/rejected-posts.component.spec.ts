import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RejectedPostsComponent } from './rejected-posts.component';
import { PostService } from './../../services/post.service';
import { ReviewService } from './../../services/review.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('RejectedPostsComponent', () => {
  let component: RejectedPostsComponent;
  let fixture: ComponentFixture<RejectedPostsComponent>;

  beforeEach(async () => {
    const postServiceMock = {
      getAllRejectedPosts: jasmine.createSpy('getAllRejectedPosts').and.returnValue(of([
        { id: 1, content: 'Post 1', author: 'Author 1', created: '2025-01-01' },
        { id: 2, content: 'Post 2', author: 'Author 2', created: '2025-01-02' }
      ])),
    };

    const reviewServiceMock = {
      getReviewsByPostId: jasmine.createSpy('getReviewsByPostId').and.callFake((postId: number) => {
        return of({ postId, review: 'This is a review' });
      }),
    };

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('123')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        RejectedPostsComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: ReviewService, useValue: reviewServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RejectedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load posts and reviews on init', () => {
    component.ngOnInit();

    expect(component.posts.length).toBe(2);
    expect(component.posts[0].content).toBe('Post 1');
    expect(component.posts[1].content).toBe('Post 2');

    expect(component.reviews[1]).toBeDefined();
    expect(component.reviews[2]).toBeDefined();

    expect(component.reviews[1].postId).toBe(1);
    expect(component.reviews[2].postId).toBe(2);
  });

  it('should filter posts by content', () => {
    component.filterType = 'content';
    component.filterValue = 'Post 1';
    const filteredPosts = component.filteredPosts();
    expect(filteredPosts.length).toBe(1);
    expect(filteredPosts[0].content).toBe('Post 1');
  });

  it('should filter posts by author', () => {
    component.filterType = 'author';
    component.filterValue = 'Author 1';
    const filteredPosts = component.filteredPosts();
    expect(filteredPosts.length).toBe(1);
    expect(filteredPosts[0].author).toBe('Author 1');
  });
});
