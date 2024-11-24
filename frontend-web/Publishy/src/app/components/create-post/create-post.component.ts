import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent {
  postForm: FormGroup;

  constructor(private fb: FormBuilder, private postService: PostService) {
    this.postForm = this.fb.group({
      title: [''],
      content: [''],
      author: [''],
      created: [new Date()]
    });
  }

  onSubmit() {
    if (this.postForm.valid) {
      this.postService.createPostAsConcept(this.postForm.value).subscribe(response => {
        console.log('Post created successfully', response);
      }, error => {
        console.error('Error creating post', error);
      });
    }
  }

}
