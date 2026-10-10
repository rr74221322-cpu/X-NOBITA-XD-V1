"use strict";

/** Validate and request a pairing code through the active NOBITA socket. */
async function requestNobitaPairingCode(sock, phoneNumber) {
  if (!sock || typeof sock.requestPairingCode !== "function") {
    throw new Error("The active Baileys socket does not support pairing codes");
  }

  const phone = String(phoneNumber || "").replace(/\D/g, "");
  if (!/^\d{8,15}$/.test(phone)) {
    throw new Error("Phone number must include the country code and contain 8–15 digits");
  }

  // Avoid requesting a code before the socket has had a moment to initialize.
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return sock.requestPairingCode(phone);
}

/** Polls NOBITA's own session manager without attaching copied event watchers. */
async function waitForNobitaSession(manager, sessionId, timeoutMs = 5 * 60 * 1000, pollMs = 1500) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (!manager) throw new Error("Session manager is unavailable");
    if (manager.isRunning(sessionId)) return true;
    const status = manager.status?.(sessionId);
    if (status === "not-found" || status === "stopped" || status === "error") {
      throw new Error(`Session ended before connecting (${status})`);
    }
    await new Promise((resolve) => setTimeout(resolve, pollMs));
  }
  throw new Error("Connection confirmation timed out");
}

module.exports = { requestNobitaPairingCode, waitForNobitaSession };
