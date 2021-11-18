import { User } from "./user.model";

export class Post {
    constructor(
        public texte: string,
        public date: any,
        public nbrLikes?: number,
        public nbrCommentaires?: number,
        public id?: number,
        public imageUrl?: string,
        public createBy?: User,
        public likeStatus?: Boolean,
        public firstName?: string,
        public user_id?: number,
        public userImageUrl?: string,
    ) { }
}

