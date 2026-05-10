const fs = require('fs');
let file = fs.readFileSync('c:/Users/Mohamed Rabea/Downloads/stay/stay/src/lib/hotels.ts', 'utf8');

const arMappings = {
    'New York': 'نيويورك',
    'USA': 'الولايات المتحدة',
    'Miami': 'ميامي',
    'Denver': 'دنفر',
    'Paris': 'باريس',
    'France': 'فرنسا',
    'Dubai': 'دبي',
    'UAE': 'الإمارات',
    'Tokyo': 'طوكيو',
    'Japan': 'اليابان',
    'Santorini': 'سانتوريني',
    'Greece': 'اليونان',
    'Cairo': 'القاهرة',
    'Egypt': 'مصر',
    'Sharm El Sheikh': 'شرم الشيخ',
    'Venice': 'البندقية',
    'Italy': 'إيطاليا',
    'Rome': 'روما',
    'Istanbul': 'إسطنبول',
    'Turkey': 'تركيا',
    'Cappadocia': 'كابادوكيا',
    'Baa Atoll': 'با اتول',
    'Maldives': 'المالديف',
    'North Male Atoll': 'ماليه الشمالية اتول',
    'Barcelona': 'برشلونة',
    'Spain': 'إسبانيا',
    'Madrid': 'مدريد',
    'Bangkok': 'بانكوك',
    'Thailand': 'تايلاند',
    'Phuket': 'بوكيت',
    'London': 'لندن',
    'UK': 'المملكة المتحدة',

    // descriptions
    'Luxury hotel in the heart of the city with world-class amenities and breathtaking views.': 'فندق فخم في قلب المدينة مع وسائل راحة عالمية المستوى ومناظر خلابة.',
    'Beautiful beachfront resort with stunning ocean views and private beach access.': 'منتجع جميل على شاطئ البحر مع إطلالات خلابة على المحيط والوصول إلى شاطئ خاص.',
    'Cozy mountain retreat perfect for nature lovers and ski enthusiasts.': 'ملاذ جبلي مريح مثالي لمحبي الطبيعة وعشاق التزلج.',
    'Classic luxury and elegant decor near the Louvre Museum.': 'فخامة كلاسيكية وديكور أنيق بالقرب من متحف اللوفر.',
    'The epitome of luxury with its sail-shaped silhouette.': 'خلاصة الفخامة بتصميمه الذي يشبه الشراع.',
    'An urban sanctuary in the heart of Tokyo boasting panoramic city views.': 'ملاذ حضري في قلب طوكيو يوفر إطلالات بانورامية على المدينة.',
    'Whitewashed luxury boutique hotel overlooking the Aegean Sea.': 'فندق بوتيك فاخر مطلي باللون الأبيض مطل على بحر إيجة.',
    'Breathtaking views of the Pyramids from a luxurious, historic hotel.': 'إطلالات تخطف الأنفاس على الأهرامات من فندق فخم وتاريخي.',
    'A world-class beachfront resort offering incredible diving experiences at the Red Sea.': 'منتجع عالمي على شاطئ البحر يقدم تجارب غوص مذهلة في البحر الأحمر.',
    'Historic luxury hotel located steps away from St Mark\\'s Square.': 'فندق فخم تاريخي يقع على بعد خطوات من ساحة القديس مارك.',
  'A Waldorf Astoria resort offering panoramic views of Rome.': 'منتجع والدورف أستوريا يقدم إطلالات بانورامية على روما.',
    'An Ottoman imperial palace and hotel on the Bosphorus.': 'قصر إمبراطوري عثماني وفندق على مضيق البوسفور.',
    'Unique luxury cave hotel experience with hot air balloon views.': 'تجربة فندقية فريدة وفخمة في الكهوف مع إطلالات على المناطيد.',
    'Award-winning luxury barefoot desert island resort.': 'منتجع فاخر وحائز على جوائز على جزيرة صحراوية.',
    'Eco-friendly water villas with ultimate privacy.': 'فيلات مائية صديقة للبيئة تتمتع بأقصى درجات الخصوصية.',
    'Striking sail-like hotel with panoramic views of the Mediterranean.': 'فندق مذهل يشبه الشراع مع إطلالات بانورامية على البحر الأبيض المتوسط.',
    'A Belle Époque palace in the Golden Triangle of Art.': 'قصر من حقبة بيلي إيبوك في المثلث الذهبي للفنون.',
    'Legendary luxury hotel on the banks of the Chao Phraya River.': 'فندق فخم أسطوري على ضفاف نهر تشاو فرايا.',
    'All-pool villa wonderland set in the rainforest of Kamala.': 'أرض عجائب من الفيلات مع مسابح تقع في غابة كمالا المطيرة.',
    'Iconic luxury hotel in Piccadilly with world-famous afternoon tea.': 'فندق فخم ومميز في بيكاديللي يشتهر بشاي بعد الظهر العالمي.',
    'Famous luxury hotel perfectly placed on the River Thames.': 'فندق فخم شهير يتمتع بموقع مثالي على نهر التايمز.',
    'Ocean-themed resort featuring a massive waterpark and aquarium.': 'منتجع بطابع المحيط يتميز بحديقة مائية ضخمة وأكواريوم.',
    'The Haute Couture address of Paris with Eiffel Tower views.': 'عنوان الموضة الراقية في باريس مع إطلالات على برج إيفل.',
    'Iconic luxury hotel featured in Lost in Translation.': 'فندق فخم شهير ظهر في فيلم ضائع في الترجمة.',
    'Chic hotel offering infinity pools and breathtaking sunset views.': 'فندق أنيق يوفر مسابح لا متناهية وإطلالات مذهلة على غروب الشمس.',
    'A beautiful generated hotel tailored dynamically for this view.': 'فندق جميل تم إنشاؤه ديناميكيًا مخصص لهذه الواجهة.',
    'Spacious room with king bed and city views.': 'غرفة فسيحة مع سرير بحجم كينغ وإطلالات على المدينة.',
    'Comfortable room with two double beds.': 'غرفة مريحة مع سريرين مزدوجين.',

    // hotel names
    'Grand Plaza Hotel': 'فندق جراند بلازا',
    'Seaside Resort': 'منتجع سي سايد',
    'Mountain Lodge': 'نزل ماونتن',
    'Le Meurice': 'لو موريس',
    'Burj Al Arab': 'برج العرب',
    'Aman Tokyo': 'أمان طوكيو',
    'Katikies Santorini': 'كاتيكيز سانتوريني',
    'Marriott Mena House': 'فندق ماريوت مينا هاوس',
    'Four Seasons Resort': 'منتجع فور سيزونز',
    'Hotel Danieli': 'فندق دانييلي',
    'Rome Cavalieri': 'روما كافالييري',
    'Ciragan Palace Kempinski': 'قصر جيراغان كمبينسكي',
    'Museum Hotel': 'متحف الفندق',
    'Soneva Fushi': 'سونيفا فوشي',
    'Gili Lankanfushi': 'جيلي لانكانفوشي',
    'W Barcelona': 'دبليو برشلونة',
    'Hotel Ritz': 'فندق ريتز',
    'Mandarin Oriental': 'ماندارين أورينتال',
    'Keemala': 'كيمالا',
    'The Ritz': 'الريتز',
    'The Savoy': 'سافوي',
    'Atlantis The Palm': 'أتلانتس النخلة',
    'Hôtel Plaza Athénée': 'فندق بلازا أثيني',
    'Park Hyatt': 'بارك حياة',
    'Cavo Tagoo': 'كافو تاجو',
    'Deluxe King Room': 'غرفة ديلوكس كينغ',
    'Standard Double Room': 'غرفة قياسية مزدوجة'
};

const addressMappings = {
    '123 Main St, New York, NY 10001': '123 الشارع الرئيسي، نيويورك، نيويورك 10001',
    '456 Ocean Blvd, Miami, FL 33101': '456 أوشن بوليفارد، ميامي، فلوريدا 33101',
    '789 Mountain Rd, Denver, CO 80201': '789 طريق الجبل، دنفر، كولورادو 80201',
    '228 Rue de Rivoli, 75001 Paris, France': '228 شارع ريفولي، 75001 باريس، فرنسا',
    'Jumeirah St, Umm Suqeim 3, Dubai, UAE': 'شارع جميرا، أم سقيم 3، دبي، الإمارات',
    'The Otemachi Tower, 1-5-6 Otemachi, Chiyoda-ku, Tokyo': 'برج أوتيماتشي، 1-5-6 أوتيماتشي، تشيودا وارد، طوكيو',
    'Main Street, Oia 847 02, Greece': 'الشارع الرئيسي، أويا 847 02، اليونان',
    '6 Pyramids Road, Giza, Cairo': '6 شارع الأهرامات، الجيزة، القاهرة',
    '1 Four Seasons Boulevard, Sharm El Sheikh': '1 بوليفارد فور سيزونز، شرم الشيخ',
    'Riva degli Schiavoni, Venice': 'ريفا ديلي سكيافوني، البندقية',
    'Via Alberto Cadlolo, Rome': 'فيا ألبيرتو كادلولو، روما',
    'Ciragan Caddesi, Besiktas, Istanbul': 'شارع جيراغان، بشكتاش، إسطنبول',
    'Tekeli Mah, Uchisar, Cappadocia': 'تيكيلي ماه، أوجيسار، كابادوكيا',
    'Kunfunadhoo Island, Baa Atoll': 'جزيرة كونفونادو، با اتول',
    'Lankanfushi Island, North Male Atoll': 'جزيرة لانكانفوشي، ماليه الشمالية اتول',
    'Placa Rosa dels Vents 1, Barcelona': 'بلاسا روزا ديلس فينتس 1، برشلونة',
    'Plaza de la Lealtad 5, Madrid': 'ساحة دي لا ليالتاد 5، مدريد',
    '48 Oriental Avenue, Bangkok': '48 أورينتال أفنيو، بانكوك',
    '10/88 Nakasud Rd, Kamala, Phuket': '10/88 طريق ناكاسود، كمالا، بوكيت',
    '150 Piccadilly, St. James, London': '150 بيكاديللي، لندن',
    'Strand, London': 'ستراند، لندن',
    'Crescent Rd, The Palm Jumeirah, Dubai': 'طريق الهلال، نخلة جميرا، دبي',
    '25 Avenue Montaigne, 75008 Paris': '25 شارع مونتين، 75008 باريس',
    '3-7-1-2 Nishi-Shinjuku, Tokyo': '3-7-1-2 نيشي شينجوكو، طوكيو',
    'Tagoo, Mykonos 846 00, Greece': 'تاجو، ميكونوس 846 00، اليونان',
    '123 Unknown Street': '123 شارع غير معروف'
};

const strEscape = str => str.replace(/([\'\"])/g, '\\\\$1');

for (const [en, ar] of Object.entries(arMappings)) {
    const safeEn = strEscape(en);
    const regexName = new RegExp(\`name: ['\"](\${safeEn})['\"]\`, 'g');
  file = file.replace(regexName, \`name: '\${en}', name_ar: '\${ar}'\`);

  const regexCity = new RegExp(\`city: ['\"](\${safeEn})['\"]\`, 'g');
  file = file.replace(regexCity, \`city: '\${en}', city_ar: '\${ar}'\`);

  const regexCountry = new RegExp(\`country: ['\"](\${safeEn})['\"]\`, 'g');
  file = file.replace(regexCountry, \`country: '\${en}', country_ar: '\${ar}'\`);

  const regexDesc = new RegExp(\`description: ['\"](\${safeEn})['\"]\`, 'g');
  file = file.replace(regexDesc, \`description: '\${en}', description_ar: '\${ar}'\`);
}

for (const [en, ar] of Object.entries(addressMappings)) {
  const safeEn = strEscape(en);
  const regexAddr = new RegExp(\`address: ['\"](\${safeEn})['\"]\`, 'g');
  file = file.replace(regexAddr, \`address: '\${en}', address_ar: '\${ar}'\`);
}

// Special case for dynamic hotel name
file = file.replace(/name: \`Dynamic Hotel \$\{id\}\`,/g, "name: \`Dynamic Hotel \${id}\`, name_ar: \`فندق ديناميكي \${id}\`,");

fs.writeFileSync('c:/Users/Mohamed Rabea/Downloads/stay/stay/src/lib/hotels.ts', file);
