export class Edit {
    constructor(
        public firstName?: string,
        public lastName?: string,
        public date_de_naissance?: string,
        public adresse?: string,
        public cp?: string,
        public telephone?: string,
        public image?: File,
        public userId?: number,
        public token?: string) { }
}