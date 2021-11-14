import { User } from "./user.model";

export class Post {
    constructor(
        public texte: string,
        public date?: any,
        public nbrLikes?: number,
        public nbrCommentaires?: number,
        public postId?: number,
        public imageUrl?: string,
        public likeStatus?: Boolean,
        public createBy?: User,
        public firstName?: string,
        public userId?: number,
        public userImageUrl?: string,
        public userIdLike?: number,
    ) { }
}

