export class Post {
    constructor(
        public texte: string,
        public date?: Date,
        public like?: number,
        public commentaire?: number,
        public postId?: number,
        public userName?: string,
        public userId?: number
    ) { }
}

