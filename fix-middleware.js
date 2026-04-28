const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname);
const middlewarePath = path.join(projectRoot, 'middleware.ts');
const proxyPath = path.join(projectRoot, 'proxy.ts');
const nextCachePath = path.join(projectRoot, '.next');

console.log('🚀 Cleaning up middleware conflict...');

// 1. Kill Node processes
try {
    execSync('taskkill /F /IM node.exe', { stdio: 'ignore' });
    console.log('✅ Stopped active processes.');
} catch (e) {}

// 2. Delete middleware.ts (the conflict)
if (fs.existsSync(middlewarePath)) {
    try {
        fs.unlinkSync(middlewarePath);
        console.log('✅ Deleted conflicting middleware.ts');
    } catch (e) {
        console.log('❌ Could not delete middleware.ts manually. Please delete it in File Explorer.');
    }
}

// 3. Clear cache
if (fs.existsSync(nextCachePath)) {
    try {
        fs.rmSync(nextCachePath, { recursive: true, force: true });
        console.log('✅ Cleared .next cache.');
    } catch (e) {}
}

console.log('\n✨ Ready! Run "npm run dev" to start.');
