import { User } from "./user.model";

export class Post {
    constructor(
        public texte: string,
        public date?: Date,
        public nbrLikes?: number,
        public nbrCommentaires?: number,
        public postId?: number,
        public imageUrl?: string,
        public userName?: string,
        public userId?: number,
        public createBy?: User,
        public likeStatus?: Boolean,
    ) { }
}

