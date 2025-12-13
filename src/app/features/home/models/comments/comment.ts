import { User } from "../../../../core/domain/auth/models/auth.model";

export interface Comment {
    id: number;
    commentary: string;
    user_id: number;
    publication_id: number;
    created_at: string;
    updated_at: string;
    user:User,
    reply_to_id?: number;
    reply_to_user?: User;
    likes: any[];
    is_liked?: boolean;
}
