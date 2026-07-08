const fs = require('fs');
let code = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

code = code.replace(
`  const productImages = products.filter(p => p?.image && typeof p.image === 'string' && p.image.length > 0).map(p => p.image);
  
  // Create a combined list of images, prioritizing the new products, but falling back to defaults if needed
  const carouselImages = [
    ...productImages,
    "/redeemed.png",
    "/salt-light.png",
    "/walk-by-faith.png"
  ];
  
  // Ensure uniqueness in case the default products are also in the db
  const uniqueImages = Array.from(new Set(carouselImages)).filter(Boolean).slice(0, 8);`,
`  // Manually define the images to show in the hero carousel
  const uniqueImages = [
    "/redeemed.png",
    "/salt-light.png",
    "/walk-by-faith.png"
  ];`
);

fs.writeFileSync('src/pages/HomePage.tsx', code);
