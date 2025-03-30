import { User } from "../../../../core/models/user/user";

export interface Comment {
    id: number;
    commentary: string;
    user_id: number;
    publication_id: number;
    created_at: string;
    updated_at: string;
    user:User
}
