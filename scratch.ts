import { hash, verify } from '@node-rs/argon2';

const password = 'super-secret-password';

const hashed = await hash(password, {
	memoryCost: 19456,
	timeCost: 2,
	parallelism: 1,
	outputLen: 32
});
console.log('hashed:', hashed);

const isValid = await verify(hashed, password);
console.log('verify (correcta):', isValid);

const isInvalid = await verify(hashed, 'otra-password');
console.log('verify (incorrecta):', isInvalid);
