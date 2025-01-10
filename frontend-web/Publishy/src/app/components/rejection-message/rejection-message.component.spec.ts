import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RejectionMessageComponent } from './rejection-message.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReviewService } from '../../services/review.service';
import { PostService } from '../../services/post.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('RejectionMessageComponent', () => {
  let component: RejectionMessageComponent;
  let fixture: ComponentFixture<RejectionMessageComponent>;
  let activatedRouteMock: any;
  let postServiceMock: any;
  let reviewServiceMock: any;

  beforeEach(async () => {
    postServiceMock = {
      getPostById: jasmine.createSpy('getPostById').and.returnValue(of({
        id: 123,
        author: 'Author',
        title: 'Title',
        content: 'Content'
      }))
    };

    reviewServiceMock = {
      rejectPosts: jasmine.createSpy('rejectPosts').and.returnValue(of({}))
    };

    activatedRouteMock = {
      snapshot: {
        params: { id: 123 }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        RejectionMessageComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: PostService, useValue: postServiceMock },
        { provide: ReviewService, useValue: reviewServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RejectionMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPostById with correct ID', () => {
    component.ngOnInit();
    expect(postServiceMock.getPostById).toHaveBeenCalledWith(123);
  });

  it('should update form with post data', () => {
    component.ngOnInit();
    expect(component.rejectionForm.value).toEqual({
      author: 'Author',
      title: 'Title',
      content: 'Content',
      rejectionMessage: 'Your post has been rejected due to policy violations.'
    });
  });

  it('should call rejectPosts on form submission', () => {
    component.rejectionForm.setValue({
      author: 'Author',
      title: 'Title',
      content: 'Content',
      rejectionMessage: 'Rejection message'
    });
    component.rejectPost();
    expect(reviewServiceMock.rejectPosts).toHaveBeenCalledWith({
      reviewAuthor: 'Author',
      reviewMessage: 'Rejection message',
      postId: 123
    });
  });
});
