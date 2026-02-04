const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys')

const Pino = require('pino')

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth')
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    logger: Pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: false,
    markOnlineOnConnect: true
  })

  sock.ev.on('creds.update', saveCreds)

  // Pairing code (Koyeb logs)
  if (!sock.authState.creds.registered) {
    const number = process.env.WA_NUMBER
    if (!number) {
      console.log('❌ WA_NUMBER not set')
      process.exit(1)
    }
    const code = await sock.requestPairingCode(number)
    console.log('PAIRING CODE:', code)
  }

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') {
      console.log('✅ WhatsApp connected')
    }

    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      if (shouldReconnect) startBot()
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const jid = msg.key.remoteJid
    const body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      ''

    if (!body.startsWith('.')) return

    const args = body.slice(1).trim().split(/ +/)
    const command = args.shift().toLowerCase()

    if (command === 'menu') {
      await sock.sendMessage(jid, {
        text: `🤖 *Bot Menu*

.menu
.help`
      })
    }

    if (command === 'help') {
      await sock.sendMessage(jid, {
        text: `🆘 *Help*
Commands start with a dot (.)
Example: .menu`
      })
    }
  })
}

startBot()
