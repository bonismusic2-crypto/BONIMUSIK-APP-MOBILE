const QRCode = require('qrcode');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generate() {
    const url = 'https://bonimusic-administration.vercel.app/download';
    const outputPath = path.join(__dirname, '../public/qrcode.png');
    const logoPath = path.join(__dirname, '../public/icon.png');

    console.log('Generating QR for:', url);

    // 1. Generate QR as Buffer
    const qrBuffer = await QRCode.toBuffer(url, {
        errorCorrectionLevel: 'H', // High error correction to allow logo coverage
        margin: 1,
        width: 500,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    });

    // 2. Load and resize Logo
    const logoSize = 100; // 20% of QR size
    const logo = await sharp(logoPath)
        .resize(logoSize, logoSize)
        .toBuffer();

    // 3. Composite Logo onto QR
    await sharp(qrBuffer)
        .composite([{ input: logo, gravity: 'center' }])
        .toFile(outputPath);

    console.log('QR Code with Logo saved to:', outputPath);
}

generate().catch(console.error);
