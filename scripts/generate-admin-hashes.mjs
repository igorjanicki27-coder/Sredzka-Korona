import { createHash } from "node:crypto";

const pepper = process.argv[2];

if (!pepper) {
  console.error("Uzycie: node scripts/generate-admin-hashes.mjs TWOJ_TAJNY_PEPPER");
  process.exit(1);
}

const hash = (value) =>
  createHash("sha256")
    .update(`${pepper}:${value}`)
    .digest("hex");

console.log(`AUTH_PEPPER=${pepper}`);
console.log(`ADMIN_LOGIN_HASH=${hash("sredzka")}`);
console.log(`ADMIN_PASSWORD_HASH=${hash("korona")}`);

