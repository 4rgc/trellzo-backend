import bcrypt from 'bcrypt';

export const hash = async (password: string) => {
	if (!process.env.BCRYPT_SALT_ROUNDS)
		throw new Error('Environment variable was undefined');
	return await bcrypt.hash(
		password,
		Number.parseInt(process.env.BCRYPT_SALT_ROUNDS)
	);
};

export const compare = async (password: string, hash: string) =>
	await bcrypt.compare(password, hash);
