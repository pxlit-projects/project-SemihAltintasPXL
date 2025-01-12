import { AuthService } from './../../services/auth-service.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { NavbarComponent } from "../navbar/navbar.component";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent {
  postForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.postForm = this.fb.group({
      title: [''],
      content: [''],
      author: [''],
      created: [new Date()],
    });
  }

  onSubmit() {
    if (this.postForm.valid) {
      this.postForm.patchValue({
        author: localStorage.getItem('username')
      });
      const userRole = localStorage.getItem('role') || '';
      this.postService.createPostAsConcept(this.postForm.value, userRole).subscribe(response => {
        console.log('Post created successfully', response);
        this.snackBar.open('Post created successfully', 'Close', {
          duration: 3000,
        });
      }, error => {
        console.error('Error creating post', error);
        this.snackBar.open('Error creating post: ' + error.message, 'Close', {
          duration: 5000,
        });
      });
    }
  }
}
