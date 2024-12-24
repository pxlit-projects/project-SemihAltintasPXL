export class Comment {
    id?: number;
    commentAuthor: string;
    commentMessage: string;
    postId: number;

    constructor(commentAuthor: string, commentMessage: string, postId: number) {
        this.commentAuthor = commentAuthor;
        this.commentMessage = commentMessage;
        this.postId = postId;
    }
}