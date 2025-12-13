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

    // 2. Prepare Logo and White Background
    const logoSize = 80; // Reduced to 16% (safer for scanning)
    const bgSize = 90; // Slightly larger white box

    // Create white background for logo
    const whiteBg = await sharp({
        create: {
            width: bgSize,
            height: bgSize,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
    }).png().toBuffer();

    // Resize Logo
    const logo = await sharp(logoPath)
        .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer();

    // 3. Composite: QR + White Box + Logo
    await sharp(qrBuffer)
        .composite([
            { input: whiteBg, gravity: 'center' }, // White box first
            { input: logo, gravity: 'center' }     // Logo on top
        ])
        .toFile(outputPath);

    console.log('Fixed QR Code (optimized for scanning) saved to:', outputPath);
}

generate().catch(console.error);
