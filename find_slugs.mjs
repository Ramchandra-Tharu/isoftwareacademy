import fs from 'fs';
import path from 'path';

function findConflict(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    // Check for both [id] and [slug] in the current directory
    const dynamicFolders = entries
        .filter(entry => entry.isDirectory() && entry.name.startsWith('[') && entry.name.endsWith(']'))
        .map(entry => entry.name);
        
    if (dynamicFolders.length > 1) {
        console.log(`\n🚨 FOUND CONFLICT IN: ${dir}`);
        console.log(`Conflicting folders: ${dynamicFolders.join(', ')}`);
        console.log(`--> Please delete one of these folders (probably [slug]).\n`);
    }

    // Recursively check subdirectories
    for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
            findConflict(path.join(dir, entry.name));
        }
    }
}

console.log("Searching for dynamic route conflicts in the app directory...");
findConflict('./app');
console.log("Search complete.");
