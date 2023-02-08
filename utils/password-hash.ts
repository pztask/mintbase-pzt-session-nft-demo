import bcrypt from "bcrypt";

export async function hashPass(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function checkPass(password: string, passwordHash: string) {
  return await bcrypt.compare(password, passwordHash);
}
