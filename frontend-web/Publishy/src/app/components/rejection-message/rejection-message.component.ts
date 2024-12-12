import { PostService } from './../../services/post.service';
import { Post } from './../../models/post.module';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rejection-message',
  standalone: true,
  imports: [],
  templateUrl: './rejection-message.component.html',
  styleUrl: './rejection-message.component.css'
})
export class RejectionMessageComponent {
  route : ActivatedRoute = Inject(ActivatedRoute);
  id: number = 0;
  Post: Post = {} as Post;
  

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
  }
  constructor(private PostService: PostService) { }
  /*
  getPostById(id: number): Post {
    this.PostService.getPostById(id);
  }
    */


}
