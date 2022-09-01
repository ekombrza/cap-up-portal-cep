export interface IUser {
    id: number;
    login: string;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string;
    status?: string;
}

export class User implements IUser {
    constructor(public id: number, public login: string, public firstName: string, public lastName: string, public email: string, public imageUrl: string, public status) {}
}

export function getUserIdentifier(user: IUser): number | undefined {
    return user.id;
}

