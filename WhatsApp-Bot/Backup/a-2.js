const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Create a new WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Display the QR code in the terminal when generated
client.on('qr', (qr) => {
    console.log('QR code received, please scan:');
    qrcode.generate(qr, { small: true });
});

// Confirm successful authentication
client.on('authenticated', () => {
    console.log('Authenticated successfully');
});

// Report authentication failure
client.on('auth_failure', msg => {
    console.error('Authentication failed:', msg);
});

// Confirm readiness
client.on('ready', () => {
    console.log('Client is ready and connected!');

    const phoneNumber = '919606295040@s.whatsapp.net'; // Replace with the recipient's phone number
    const message = 'Hello, this is a message sent from code!';

    // Send an initial message
    client.sendMessage(phoneNumber, message)
        .then(response => {
            console.log('Message sent successfully:', response);
        })
        .catch(err => {
            console.error('Failed to send message:', err);
        });
});

// Handle incoming messages
client.on('message', async (message) => {
    console.log(`Received message from ${message.from}: ${message.body}`);

    try {
        // Check if the message has a quoted message before attempting to get it
        if (message.hasQuotedMsg) {
            const quotedMessage = await message.getQuotedMessage();
            await message.reply(`This is a reply to the quoted message: ${quotedMessage.body}`);
        } else {
            // If no quoted message, send a regular reply
            await message.reply('This is a regular reply');
        }
    } catch (error) {
        console.error('Error while replying to message:', error);
    }
});

// Additional debugging events
client.on('disconnected', (reason) => {
    console.log('Client was logged out:', reason);
});

client.on('change_state', state => {
    console.log('Connection state changed:', state);
});

// Initialize the client
client.initialize();
