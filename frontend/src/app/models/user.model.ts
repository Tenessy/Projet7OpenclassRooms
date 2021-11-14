export class User {
    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public password: string,
        public userId: number,
        public date_de_naissance?: string,
        public adresse?: string,
        public cp?: string,
        public telephone?: string,
        public token?: string,
        public imageUrl?: string) { }
}

