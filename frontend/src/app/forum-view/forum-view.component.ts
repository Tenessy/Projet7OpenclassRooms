import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../services/post.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-forum-view',
  templateUrl: './forum-view.component.html',
  styleUrls: ['./forum-view.component.css']
})
export class ForumViewComponent implements OnInit, OnDestroy {
  constructor(private postService: PostService,
    private auth: AuthService,
    private router: Router) { }
  posts: Post[] = [];
  postSubscription = new Subscription();
  user: any;
  today: Number = Date.now();
  goComment(id: any) {
    let link = [`/forum/${id}/comment`];
    console.log(id);
    this.router.navigate(link);
  }
  ngOnInit() {
    this.postSubscription.add(this.getAllPosts());
    this.postSubscription.add(this.initPostsAdded());
    this.postSubscription.add(this.auth.subject.subscribe(
      user => {
        this.user = user;
      }
    ));
  }
  confirmDeletePost() {
    this.postService.deletedPost.next(true);
  }
  getAllPosts() {
    this.postService.getPostsFromServer()
      .subscribe(
        posts => {
          this.posts = posts;
        }
      );
  }
  initPostsAdded() {
    this.postService.postsSubject.subscribe((data: boolean) => {
      if (data) {
        this.getAllPosts();
      }
    });
  }
  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }
}
