// backend/scripts/loadSamplePayloads.js
import fs from 'fs';
import path from 'path';
import axios from 'axios';

// CONFIG — change if needed
const PAYLOADS_DIR = path.join(process.cwd(), 'data', 'sample_payloads');
const API_URL = 'https://whatsappclone-rapidquest.onrender.com/api/messages/webhook'; // Your backend URL

async function sendPayload(filePath) {
    try {
        const raw = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(raw);

        const res = await axios.post(API_URL, json, {
            headers: { 'Content-Type': 'application/json' }
        });

        console.log(`✅ Sent: ${path.basename(filePath)} →`, res.data.message || 'Processed');
    } catch (err) {
        console.error(`❌ Error sending ${filePath}:`, err.message);
    }
}

async function main() {
    const files = fs.readdirSync(PAYLOADS_DIR).filter(f => f.endsWith('.json'));
    console.log(`📂 Found ${files.length} payload files`);

    for (const file of files) {
        const filePath = path.join(PAYLOADS_DIR, file);
        await sendPayload(filePath);
    }

    console.log('🎯 All payloads sent.');
}

main();
