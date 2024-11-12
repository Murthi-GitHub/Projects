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

    const phoneNumber = '918971238789@s.whatsapp.net'; // or try '919900825833@s.whatsapp.net'
    const message = 'Hello, this is a message sent from code!';

    // Send a message to the contact
    client.sendMessage(phoneNumber, message)
        .then(response => {
            console.log('Message sent successfully:', response);
        })
        .catch(err => {
            console.error('Failed to send message:', err);
        });
});

// Additional debugging events
client.on('disconnected', (reason) => {
    console.log('Client was logged out:', reason);
});

client.on('change_state', state => {
    console.log('Connection state changed:', state);
});

client.on('message', message => {
    console.log(`Received message from ${message.from}: ${message.body}`);
});

// Initialize the client
client.initialize();





node index.js


