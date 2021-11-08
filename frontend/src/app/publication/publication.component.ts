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
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css']
})
export class PublicationComponent implements OnInit, OnDestroy {

  constructor(private postService: PostService,
    private auth: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) {
  }
  @Input()
  post: Post;

  farThumbsUp = farThumbsUp;
  fasThumbsUp = fasThumbsUp;
  faCommentAlt = faCommentAlt;
  faShare = faShare;
  likes: any;
  userId: any;
  likeSubscription: Subscription;

  goComment(id: any) {
    let link = [`/forum/${id}/comment`];
    console.log(id);
    this.router.navigate(link);
  }
  like(post: Post) {
    const formData: any = new FormData();
    formData.append('post', JSON.stringify(post));
    this.postService.postLike(formData).subscribe(
      data => {
        console.log(data);
        this.ngOnInit();
      }
    );
    post.likeStatus = true;
  }
  unLike(post: Post) {
    this.postService.deleteLike(post).subscribe(
      data => {
        console.log(data);
        this.ngOnInit();
      }
    );
    post.likeStatus = false;
  }

  ngOnInit() {
    this.auth.subject.subscribe(
      val => {
        this.post.userId = val?.userId;
      }
    )
    this.likeSubscription = this.postService.getLikes()
      .subscribe(
        likes => {
          this.likes = likes;
          const like = this.likes && this.likes.filter((like: any) => this.post.postId === like.post_id);
          this.post.nbrLikes = like.length;

          like.find((like: any) => {
            const findUserId = like.userId_like === this.post.userId;
            if (findUserId) {
              this.post.likeStatus = true;
            }
            else {
              this.post.likeStatus = false;
            }
          })
        }
      );
  }
  ngOnDestroy() {
    this.likeSubscription.unsubscribe()
  }
}


