import fs from 'fs';

const validImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    'https://images.unsplash.com/photo-1542314831-c6a4d140e606?w=800',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
    'https://images.unsplash.com/photo-1565881606991-789a8dff9dbb?w=800',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1582653291997-079a1c04e5d1?w=800',
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
    'https://images.unsplash.com/photo-1522064115163-95d6f83eb9e0?w=800',
    'https://images.unsplash.com/photo-1542051812871-7488f414d1fa?w=800',
    'https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=800',
    'https://images.unsplash.com/photo-1533104816-cdd2da82b8d0?w=800',
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5f1?w=800'
];

let content = fs.readFileSync('src/lib/hotels.ts', 'utf-8');

// Replace everything between id: '9' and id: '26' with valid images
for (let i = 9; i <= 26; i++) {
    const validImg = validImages[i % validImages.length];
    const validImg2 = validImages[(i + 1) % validImages.length];

    // Replace image field specifically for this id block
    // We will use a regex to find the block for the given id and replace its image and images array.
    const regex = new RegExp(`(id:\\s*'${i}'[\\s\\S]*?image:\\s*')[^']+('[\\s\\S]*?images:\\s*\\[)[^\\]]+(\\])`, 'g');
    content = content.replace(regex, `$1${validImg}$2'${validImg}', '${validImg2}'$3`);
}

// We must also remove the localstorage variable for "mockHotels" so the application creates the updated version.
// As a bonus, modify api.ts to clear localstorage once so it fetches the new images.

fs.writeFileSync('src/lib/hotels.ts', content);
console.log("Images fixed!");
