const fs = require('fs');
const path = require('path');

const map = {
  'https://res.cloudinary.com/duwpkzkg1/image/upload/v1783580279/LOGO-3_wmie0y.png': './logo.png',
  'https://res.cloudinary.com/duwpkzkg1/image/upload/v1783580258/redeemed_mosnvw.png': './redeemed.png',
  'https://res.cloudinary.com/duwpkzkg1/image/upload/v1783580257/hoodie_ur6d3q.png': './hoodie.png',
  'https://res.cloudinary.com/duwpkzkg1/image/upload/v1783580258/salt-light_owqoe5.png': './salt-light.png',
  'https://res.cloudinary.com/duwpkzkg1/image/upload/walk-by-faith_mpyjek.png': './walk-by-faith.png',
  'https://res.cloudinary.com/duwpkzkg1/image/upload/v1783580258/tee_tpppm4.png': './tee.png',
  'https://res.cloudinary.com/duwpkzkg1/image/upload/walk_uefuay.png': './walk.png',
  'https://res.cloudinary.com/duwpkzkg1/image/upload/v1783580259/cap_1_cylmt1.png': './tee.png'
};

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const [url, replacement] of Object.entries(map)) {
        if (content.includes(url)) {
          content = content.split(url).join(replacement);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

processDir('src');
