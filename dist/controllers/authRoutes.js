import { createAuthClient } from "better-auth/client";
const authClient = createAuthClient();
export const googleSignIn = async () => {
    const data = await authClient.signIn.social({
        provider: "google"
    });
};
//# sourceMappingURL=authRoutes.js.map