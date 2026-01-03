import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        roles: string[];
    }

    interface Session extends DefaultSession {
        user: {
            id: string;
            roles: string[];
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        roles: string[];
    }
}
