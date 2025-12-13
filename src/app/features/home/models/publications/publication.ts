import { Comment } from "../comments/comment";
import { User } from "../../../../core/domain/auth/models/auth.model";

export interface Publication {
    id: number;
    image: string;
    description: string;
    likes: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    user: User;
    comments: Comment[];
    liked_by_auth_user: boolean;
}
