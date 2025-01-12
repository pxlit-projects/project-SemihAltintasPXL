import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from './post.service';
import { Post } from '../models/post.module';
import { environment } from '../../environments/environment';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiUrl}post/api/post`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService]
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // Verify no unmatched requests remain
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAllPosts and return posts', () => {
    const mockPosts: Post[] = [
      { title: 'Post 1', content: 'Content 1', author: 'Author 1', created: new Date('2025-01-01') },
      { title: 'Post 2', content: 'Content 2', author: 'Author 2', created: new Date('2025-01-02') }
    ];

    service.getAllPosts().subscribe(posts => {
      expect(posts.length).toBe(2);
      expect(posts[0].created).toEqual(mockPosts[0].created);
      expect(posts[1].created).toEqual(mockPosts[1].created);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should call getAllApprovedPosts and return approved posts', () => {
    const mockPosts: Post[] = [
      { title: 'Approved Post 1', content: 'Content 1', author: 'Author 1', created: new Date('2025-01-01') }
    ];

    service.getAllApprovedPosts().subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts[0].title).toBe('Approved Post 1');
      expect(posts[0].created).toEqual(mockPosts[0].created);
    });

    const req = httpMock.expectOne(`${baseUrl}/approved`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should call getAllPendingPosts and return pending posts', () => {
    const mockPosts: Post[] = [
      { title: 'Pending Post 1', content: 'Content 1', author: 'Author 1', created: new Date('2025-01-01') }
    ];

    service.getAllPendingPosts().subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts[0].title).toBe('Pending Post 1');
      expect(posts[0].created).toEqual(mockPosts[0].created);
    });

    const req = httpMock.expectOne(`${baseUrl}/pending`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should call getAllRejectedPosts and return rejected posts', () => {
    const mockPosts: Post[] = [
      { title: 'Rejected Post 1', content: 'Content 1', author: 'Author 1', created: new Date('2025-01-01') }
    ];

    service.getAllRejectedPosts().subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts[0].title).toBe('Rejected Post 1');
      expect(posts[0].created).toEqual(mockPosts[0].created);
    });

    const req = httpMock.expectOne(`${baseUrl}/rejected`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should call getPostById and return a post', () => {
    const mockPost: Post = { title: 'Post 1', content: 'Content 1', author: 'Author 1', created: new Date('2025-01-01') };

    service.getPostById(1).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPost);
  });

  it('should call approvePost and return the approved post', () => {
    const mockPost: Post = { title: 'Post 1', content: 'Content 1', author: 'Author 1', created: new Date('2025-01-01') };

    service.approvePost(1).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${baseUrl}/approve/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockPost);
  });

  it('should call rejectPost and return the rejected post', () => {
    const mockPost: Post = { title: 'Post 1', content: 'Content 1', author: 'Author 1', created: new Date('2025-01-01') };

    service.rejectPost(1).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${baseUrl}/reject/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockPost);
  });

  // it('should call updatePost and return void', () => {
  //   const postRequest = { title: 'Updated Post', content: 'Updated Content', author: 'Author 1' };

  //   service.updatePost(1, postRequest).subscribe(response => {
  //     expect(response).toBeNull();
  //   });

  //   const req = httpMock.expectOne(`${baseUrl}/update/1`);
  //   expect(req.request.method).toBe('PUT');
  //   expect(req.request.body).toEqual(postRequest);
  //   req.flush(null);
  // });
});
