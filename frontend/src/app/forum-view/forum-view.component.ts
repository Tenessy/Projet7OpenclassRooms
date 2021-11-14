import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { PostService } from '../services/post.service';
import { faThumbsUp as farThumbsUp, faCommentAlt } from '@fortawesome/free-regular-svg-icons'
import { faShare, faThumbsUp as fasThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { Observable, Subscription, from, pipe, of, fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Post } from '../models/post.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forum-view',
  templateUrl: './forum-view.component.html',
  styleUrls: ['./forum-view.component.css']
})
export class ForumViewComponent implements OnInit, OnDestroy {
  @Input() totalLikes: number;
  @Input() userName: string;
  @Input() date: string;

  currentItem = 'Television';
  constructor(private postService: PostService,
    private auth: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) {
  }
  farThumbsUp = farThumbsUp;
  fasThumbsUp = fasThumbsUp;
  faCommentAlt = faCommentAlt;
  faShare = faShare;
  title = 'Groupomania';
  posts: any = [];
  postSubscription: Subscription;
  likes: any;
  user: any;
  today: Number = Date.now();

  goComment(id: any) {
    let link = [`/forum/${id}/comment`];
    console.log(id);
    this.router.navigate(link);
  }
  deletePost(post: any) {
    console.log(post);
  }
  ngOnInit() {
    this.postSubscription = this.postService.getPostsFromServer()
      .subscribe(
        posts => {
          console.log(posts);
          this.posts = posts;
        }
      );
    this.auth.subject.subscribe(
      user => {
        this.user = user;
      }
    );
  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }
}
