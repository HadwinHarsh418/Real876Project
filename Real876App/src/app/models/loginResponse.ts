import { Users } from "./users"

export class LoggedInReponse {
    error!: boolean;
    message!: string;
    msg!: string;
    body!: Users;
}
export class UserSession {
    user!: Users;
    token!: string;
}