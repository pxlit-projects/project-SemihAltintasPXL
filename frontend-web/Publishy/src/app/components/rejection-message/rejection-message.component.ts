import { Review } from './../../models/review.module';
import { ReviewService } from './../../services/review.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NavbarComponent } from "../navbar/navbar.component";
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';



@Component({
  selector: 'app-rejection-message',
  templateUrl: './rejection-message.component.html',
  styleUrls: ['./rejection-message.component.css'],
  imports: [CommonModule, NavbarComponent, ReactiveFormsModule , RouterModule ],
  standalone: true
})
export class RejectionMessageComponent implements OnInit {
  id: number = 0;
  Post: any;
  rejectionForm: FormGroup;

  constructor(private route: ActivatedRoute,private ReviewService: ReviewService ,private PostService: PostService, private fb: FormBuilder, private router: Router) {
    this.rejectionForm = this.fb.group({
      author: ['Default Author'],
      title: ['Default Title'],
      content: ['Default Content'],
      rejectionMessage: ['Default Rejection Message']
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getPostById(this.id);
  }

  getPostById(id: number): void {
    this.PostService.getPostById(id).subscribe(post => {
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
    const Review: Review = {
      reviewAuthor: this.rejectionForm.value.reviewAuthor,
      message: this.rejectionForm.value.rejectionMessage,
      postId: this.id
    };
    this.ReviewService.rejectPost(this.id , Review).subscribe(response => {
      console.log('Post rejected successfully');
      //approvable-posts
      this.router.navigate(['/approvable-posts']);
    });
  }
}