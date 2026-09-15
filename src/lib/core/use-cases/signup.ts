import type { UserRepository } from "@ports/user-repository";
import type { AuthProvider } from "@ports/auth-provider";

export function createSignupUseCase(userRepo: UserRepository, authProvider: AuthProvider) {
    return async (email: string, password: string, name: string | null) => {
        // paso 1: ¿el email ya existe?
        const existingUser = await userRepo.findByEmail(email);

        if (existingUser) {
            throw new Error('El ususario ya  esta registrado!')
        }
    
        // paso 2: hashear el password
        const password_Hash = await authProvider.hashPassword(password)
    
        // paso 3: crear el usuario

        const createUser = await userRepo.create({
            email: email,
            name: name,
            password_hash: password_Hash
        })
    
        // paso 4: ¿qué regresa el use-case al final?
        return {
            id: createUser.id,
            name: createUser.name,
            email: createUser.email
        }
    };

}