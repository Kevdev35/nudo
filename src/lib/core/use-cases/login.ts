import type { UserRepository } from "@ports/user-repository";
import type { AuthProvider } from "@ports/auth-provider";

export function createLoginUseCase(userRepo: UserRepository, authProvider: AuthProvider) {
    return async (email: string, password: string) => {
        const existingUser = await userRepo.findByEmail(email);

        if (!existingUser) {
            throw new Error("Correo o Contraseña incorrectos")
        }

        const passwordIsValid = await authProvider.verifyPassword(password, existingUser.password_hash)

         if (!passwordIsValid) {
            throw new Error("Correo o Contraseña incorrectos")
        }

        const createSession = await authProvider.createSession(existingUser.id)

        return {
            token: createSession.token,
            expiresAt: createSession.expiresAt
        }
    } 
}