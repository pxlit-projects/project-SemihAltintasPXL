import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentService } from './../../services/comment.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { Comment } from './../../models/comment.module';

@Component({
  selector: 'app-create-comment',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './create-comment.component.html',
  styleUrl: './create-comment.component.css'
})
export class CreateCommentComponent implements OnInit {
  commentForm: FormGroup;
  id: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private commentService: CommentService,
    private snackBar: MatSnackBar
  ) {
    this.commentForm = this.fb.group({
      commentAuthor: [{ value: localStorage.getItem('username'), disabled: true }, Validators.required],
      commentMessage: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
  }

  createComment(): void {
    if (this.commentForm.valid) {
      const comment: Comment = {
        commentAuthor: localStorage.getItem('username') || '',
        commentMessage: this.commentForm.value.commentMessage,
        postId: this.id
      };

      this.commentService.createComment(comment).subscribe({
        next: () => this.router.navigate(['/approved-posts']),
        error: (err) => {
          console.error('Error creating comment', err);
          this.snackBar.open('Error creating comment: ' + err.message, 'Close', {
            duration: 5000,
          });
        }
      });
    }
  }
}