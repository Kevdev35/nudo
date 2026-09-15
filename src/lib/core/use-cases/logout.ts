import type { AuthProvider } from "@ports/auth-provider";

export function createLogoutUseCase(authProvider: AuthProvider) {
    return async (token: string) => {
        await authProvider.invalidateSession(token)
    }
}