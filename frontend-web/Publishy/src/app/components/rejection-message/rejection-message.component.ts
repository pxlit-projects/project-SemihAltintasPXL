import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReviewService } from './../../services/review.service';
import { PostService } from './../../services/post.service';
import { Review } from './../../models/review.module';
import { NavbarComponent } from './../navbar/navbar.component';

@Component({
  selector: 'app-rejection-message',
  templateUrl: './rejection-message.component.html',
  styleUrls: ['./rejection-message.component.css'],
  imports: [CommonModule, NavbarComponent, ReactiveFormsModule, RouterModule],
  standalone: true
})
export class RejectionMessageComponent implements OnInit {
  id: number = 0;
  Post: any;
  rejectionForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private postService: PostService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.rejectionForm = this.fb.group({
      author: ['Default Author', Validators.required],
      title: ['Default Title', Validators.required],
      content: ['Default Content', Validators.required],
      rejectionMessage: ['Default Rejection Message', Validators.required]
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getPostById(this.id);
  }

  getPostById(id: number): void {
    this.postService.getPostById(id).subscribe(post => {
      this.Post = post;
      this.rejectionForm.patchValue({
        author: post.author,
        title: post.title,
        content: post.content,
        rejectionMessage: 'Your post has been rejected due to policy violations.'
      });
    });
  }

  rejectPost(): void {
    if (this.rejectionForm.valid) {
      const review: Review = {
        reviewAuthor: this.rejectionForm.get('author')?.value,
        message: this.rejectionForm.get('rejectionMessage')?.value,
        postId: this.id
      };
      console.log("nig nig" + 'Rejecting post:', review);
      this.reviewService.rejectPost(this.id, review).subscribe({
        next: () => {
          console.log('Post rejected successfully');
          this.router.navigate(['/approvable-posts']);
        },
        error: (err) => {
          console.error('Error rejecting post:', err);
        }
      });
    }
  }
}