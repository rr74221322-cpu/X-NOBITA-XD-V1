"use strict";

const {
  default: makeWASocket,
  fetchLatestBaileysVersion,
  Browsers
} = require("@whiskeysockets/baileys");
const pino = require("pino");

/**
 * Creates the WhatsApp socket used by X NOBITA XD.
 * Keeps connection construction in one NOBITA-owned module so it is not
 * coupled to another bot's pairing/session implementation.
 */
async function createNobitaSocket({ auth }) {
  if (!auth || !auth.creds || !auth.keys) {
    throw new TypeError("createNobitaSocket requires a valid Baileys auth state");
  }

  const { version, isLatest } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    version,
    auth,
    logger: pino({ level: "silent" }),
    browser: Browsers.ubuntu("Edge"),
    printQRInTerminal: false,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 60000,
    keepAliveIntervalMs: 30000,
    markOnlineOnConnect: false,
    syncFullHistory: false,
    generateHighQualityLinkPreview: false
  });

  return { sock, version, isLatest: Boolean(isLatest) };
}

module.exports = { createNobitaSocket };
