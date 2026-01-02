import type { ServerResponse } from "./types";

const STORAGE_KEY = "superbox_user_servers";

export interface UserServer extends ServerResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export function getUserServers(): UserServer[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading user servers from localStorage:", error);
    return [];
  }
}

export function saveUserServer(
  server: ServerResponse,
  userId?: string,
  existingServerId?: string,
): UserServer {
  const userServers = getUserServers();

  let existingIndex = -1;

  if (existingServerId) {
    existingIndex = userServers.findIndex((s) => s.id === existingServerId);
  } else {
    existingIndex = userServers.findIndex((s) => s.name === server.name);
  }

  const userServer: UserServer = {
    ...server,
    id:
      existingIndex >= 0
        ? userServers[existingIndex].id
        : `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt:
      existingIndex >= 0
        ? userServers[existingIndex].createdAt
        : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId,
  };

  if (existingIndex >= 0) {
    userServers[existingIndex] = userServer;
  } else {
    userServers.push(userServer);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userServers));
  } catch (error) {
    console.error("Error saving user server to localStorage:", error);
  }

  return userServer;
}

export function deleteUserServer(serverName: string): boolean {
  const userServers = getUserServers();
  const filtered = userServers.filter((s) => s.name !== serverName);

  if (filtered.length === userServers.length) {
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error deleting user server from localStorage:", error);
    return false;
  }
}

export function getUserServersByAuthor(author: string): UserServer[] {
  const userServers = getUserServers();
  return userServers.filter((s) => s.author === author);
}

export function clearAllUserServers(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing user servers from localStorage:", error);
  }
}
