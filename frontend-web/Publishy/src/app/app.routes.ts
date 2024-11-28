import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { ApprovablePostsComponent } from './components/approvable-posts/approvable-posts.component';

export const routes: Routes = [
  { path: 'create-post', component: CreatePostComponent },
  { path: '', component: AllPostsComponent },
  { path: 'approvable-posts', component: ApprovablePostsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }