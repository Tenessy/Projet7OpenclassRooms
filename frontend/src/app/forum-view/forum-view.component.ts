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

  goComment(id: any) {
    let link = [`/forum/${id}/comment`];
    console.log(id);
    this.router.navigate(link);
  }
  ngOnInit() {
    this.postSubscription = this.postService.getPostsFromServer()
      .subscribe(
        posts => {
          this.posts = posts;
        }
      );
    this.auth.subject.subscribe(
      user => {
        this.user = user;
        console.log(user);
      }
    );
  }
  
  onClick($event: any, post: any) {
    let userId_like;
    const filterPosta = from(this.likes);
    const filtera = filterPosta.pipe(filter((like: any) => like.forum_id === post.postId));
    filtera.subscribe(
      like => {
        userId_like = like.userId_like;
      }
    );
    post = {
      postId: post.postId,
      userId: this.user.userId
    }
    const formData: any = new FormData();
    formData.append('post', JSON.stringify(post));
    if (userId_like !== this.user.userId) {
      post.likeStatus = 0;
      this.postService.postLikes(formData).subscribe(
        data => {
          console.log('Tout est OK' + data);
          this.ngOnInit();
        },
        error => {
          console.log(error)
        }
      );
      console.log('Ajout OK !');
    }
    else {
      this.postService.deleteUserIdLikes(post)
        .subscribe(
          data => {
            console.log('userId supprimé avec succès !');
            this.ngOnInit();
          }
        );
      post.likeStatus = 1;
      console.log('déjà existant !');
    }
    $event.preventDefault();
    $event.stopPropagation();
  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }
}
