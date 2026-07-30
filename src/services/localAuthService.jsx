import { users as seededUsers } from "../seeders/users.js";

const LOCAL_USERS_KEY = "finebank_local_users";

function readStoredUsers() {
  try {
    const parsedUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]");
    return Array.isArray(parsedUsers) ? parsedUsers : [];
  } catch {
    return [];
  }
}

function writeStoredUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

function base64UrlEncode(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function getLocalUsers() {
  const usersByEmail = new Map();

  [...seededUsers, ...readStoredUsers()].forEach((user) => {
    usersByEmail.set(normalizeEmail(user.email), {
      ...user,
      email: normalizeEmail(user.email),
    });
  });

  return Array.from(usersByEmail.values());
}

export function registerLocalUser(newUser) {
  const email = normalizeEmail(newUser.email);
  const existingUser = getLocalUsers().find((user) => user.email === email);

  if (existingUser) {
    throw new Error("Email already registered.");
  }

  const user = {
    id: crypto.randomUUID(),
    name: String(newUser.name ?? "").trim(),
    email,
    password: String(newUser.password ?? ""),
    role: "member",
  };
  const storedUsers = readStoredUsers();

  writeStoredUsers([...storedUsers, user]);

  return user;
}

export function findLocalUser(email, password) {
  const normalizedEmail = normalizeEmail(email);

  return getLocalUsers().find(
    (user) =>
      user.email === normalizedEmail && user.password === String(password ?? ""),
  );
}

export function createLocalAuthToken(user) {
  const header = {
    alg: "none",
    typ: "JWT",
  };
  const payload = {
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    id: user.id,
    name: user.name,
    role: user.role,
    source: "local",
  };

  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.`;
}
