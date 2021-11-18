import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PostService } from '../services/post.service';
import { style, animate, transition, trigger } from '@angular/animations';
import { faThumbsUp as farThumbsUp, faCommentAlt } from '@fortawesome/free-regular-svg-icons'
import { faShare, faThumbsUp as fasThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Post } from '../models/post.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ transform: 'rotate(10deg) scale(1.5)' }),
        animate('200ms ease', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class PublicationComponent implements OnInit, OnDestroy {
  constructor(private postService: PostService,
    private auth: AuthService,
    private router: Router) {
  }
  @Input()
  post: Post;
  farThumbsUp = farThumbsUp;
  fasThumbsUp = fasThumbsUp;
  faCommentAlt = faCommentAlt;
  faShare = faShare;
  userId: number | undefined;
  subscription: Subscription;
  today: number = Date.now();
  goComment(id: number) {
    let link = [`/forum/${id}/#comment`];
    console.log(id);
    this.router.navigate(link);
  }
  like(post: Post) {
    const like = {
      post_id: post.id,
      user_id: this.userId
    }
    this.postService.postLike(like).subscribe(
      data => {
        console.log(data);
        this.post.likeStatus = true;
        this.ngOnInit();
      }
    );
  }
  unLike(post: Post) {
    const like = {
      post_id: post.id,
      user_id: this.userId
    }
    this.postService.deleteLike(like).subscribe(
      data => {
        console.log(data);
        this.post.likeStatus = false;
        this.ngOnInit();
      }
    );
  }
  deletePost(post: Post) {
    this.subscription = this.postService.deletedPost.subscribe(
      (data: boolean) => {
        if (data) {
          this.confirmPostDelete(post);
        }
      }
    );
  }
  confirmPostDelete(post: Post) {
    this.subscription = this.postService.deletePost(post)
      .subscribe({
        next: val => {
          console.log('le post a bien été supprimé' + val);
          this.postService.postsSubject.next(true);
          this.postService.deletedPost.next(false);
          this.router.navigate(['/forum']);
        },
        error: error => {
          console.log('Une erreur est survenue lors de la suppresion du post' + error);
        }
      });
  }
  ngOnInit() {
    this.auth.subject.subscribe(
      user => {
        this.userId = user?.id;
      }
    );
    this.getAllLikes();
    this.subscription = this.postService.getAllComments()
      .subscribe(
        comments => {
          const AllComments: any = comments;
          const comment = AllComments && AllComments.filter((comment: any) => this.post.id === comment.post_id);
          this.post.nbrCommentaires = comment.length;
        }
      );
  }
  getAllLikes() {
    this.subscription = this.postService.getLikes()
      .subscribe(
        likes => {
          const AllLikes: any = likes;
          const like = AllLikes && AllLikes.filter((like: any) => this.post.id === like.post_id);
          const findUserId = like.find((like: any) => like.user_id === this.userId);
          this.post.nbrLikes = like.length;
          this.post.likeStatus = findUserId;
        }
      );
  }
  ngOnDestroy() {
    setTimeout(() => {
      this.subscription.unsubscribe();
    }, 1000);
  }
}


