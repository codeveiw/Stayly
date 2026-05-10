import { api } from "./api";

export type AmenityKey = "wifi" | "pool" | "breakfast" | "parking" | "gym" | "spa" | "bar" | "ac";

export interface Hotel {
  id: string;
  name: string;
  name_ar?: string;
  city: string;
  city_ar?: string;
  country: string;
  country_ar?: string;
  price?: number; // Will be calculated from rooms
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  amenities: AmenityKey[];
  description: string;
  description_ar?: string;
  featured?: boolean;
  deal?: boolean;
  address: string;
  address_ar?: string;
}

export interface Room {
  id: string;
  name: string;
  name_ar?: string;
  type: string;
  price: number;
  originalPrice?: number;
  capacity: number;
  amenities: string[];
  images: string[];
  description: string;
  description_ar?: string;
  available: boolean;
}

export interface HotelWithRooms {
  hotel: Hotel;
  rooms: Room[];
  reviews: any[];
}

export const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Grand Plaza Hotel', name_ar: 'فندق جراند بلازا',
    city: 'New York', city_ar: 'نيويورك',
    country: 'USA', country_ar: 'الولايات المتحدة الأمريكية',
    price: 299,
    rating: 4.5,
    reviewsCount: 1250,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800'],
    amenities: ['wifi', 'pool', 'breakfast', 'parking', 'gym', 'spa', 'bar', 'ac'],
    description: 'Luxury hotel in the heart of the city with world-class amenities and breathtaking views.', description_ar: 'فندق فخم في قلب المدينة يوفر وسائل راحة عالمية المستوى وإطلالات خلابة.',
    featured: true,
    deal: true,
    address: '123 Main St, New York, NY 10001', address_ar: '123 الشارع الرئيسي، نيويورك'
  },
  {
    id: '2',
    name: 'Seaside Resort', name_ar: 'منتجع سيسايد',
    city: 'Miami', city_ar: 'ميامي',
    country: 'USA', country_ar: 'الولايات المتحدة الأمريكية',
    price: 249,
    rating: 4.7,
    reviewsCount: 890,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
    images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800'],
    amenities: ['wifi', 'pool', 'breakfast', 'parking', 'gym', 'spa', 'bar', 'ac'],
    description: 'Beautiful beachfront resort with stunning ocean views and private beach access.', description_ar: 'منتجع جميل مواجه للشاطئ يتميز بإطلالات مذهلة على المحيط وإمكانية الوصول إلى الشاطئ الخاص.',
    featured: true,
    deal: false,
    address: '456 Ocean Blvd, Miami, FL 33101', address_ar: '456 بوليفارد المحيط، ميامي'
  },
  {
    id: '3',
    name: 'Mountain Lodge', name_ar: 'ماونتن لودج',
    city: 'Denver', city_ar: 'دنفر',
    country: 'USA', country_ar: 'الولايات المتحدة الأمريكية',
    price: 199,
    rating: 4.3,
    reviewsCount: 567,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'],
    amenities: ['wifi', 'pool', 'breakfast', 'parking', 'gym', 'spa'],
    description: 'Cozy mountain retreat perfect for nature lovers and ski enthusiasts.', description_ar: 'ملاذ جبلي مريح ومثالي لمحبي الطبيعة وعشاق التزلج.',
    featured: false,
    deal: true,
    address: '789 Mountain Rd, Denver, CO 80201', address_ar: '789 طريق الجبل، دنفر'
  },
  {
    id: '5',
    name: 'Le Meurice', name_ar: 'لو موريس',
    city: 'Paris', city_ar: 'باريس',
    country: 'France', country_ar: 'فرنسا',
    price: 450,
    rating: 4.9,
    reviewsCount: 2310,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800', 'https://images.unsplash.com/photo-1565881606991-789a8dff9dbb?w=800'],
    amenities: ['wifi', 'breakfast', 'ac', 'bar', 'spa'],
    description: 'Classic luxury and elegant decor near the Louvre Museum.', description_ar: 'فخامة كلاسيكية وديكور أنيق بالقرب من متحف اللوفر.',
    featured: true,
    deal: false,
    address: '228 Rue de Rivoli, 75001 Paris, France', address_ar: '228 شارع ريفولي، باريس'
  },
  {
    id: '6',
    name: 'Burj Al Arab', name_ar: 'برج العرب',
    city: 'Dubai', city_ar: 'دبي',
    country: 'UAE', country_ar: 'الإمارات العربية المتحدة',
    price: 900,
    rating: 5.0,
    reviewsCount: 3412,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800'],
    amenities: ['wifi', 'pool', 'breakfast', 'ac', 'spa', 'gym', 'bar'],
    description: 'The epitome of luxury with its sail-shaped silhouette.', description_ar: 'خلاصة الفخامة بتصميمه المميز على شكل شراع.',
    featured: true,
    deal: false,
    address: 'Jumeirah St, Umm Suqeim 3, Dubai, UAE', address_ar: 'شارع جميرا، دبي'
  },
  {
    id: '7',
    name: 'Aman Tokyo', name_ar: 'أمان طوكيو',
    city: 'Tokyo', city_ar: 'طوكيو',
    country: 'Japan', country_ar: 'اليابان',
    price: 650,
    rating: 4.8,
    reviewsCount: 1540,
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
    images: ['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800', 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800'],
    amenities: ['wifi', 'spa', 'gym', 'bar', 'ac', 'breakfast'],
    description: 'An urban sanctuary in the heart of Tokyo boasting panoramic city views.', description_ar: 'ملاذ حضري في قلب طوكيو يتميز بإطلالات بانورامية على المدينة.',
    featured: true,
    deal: true,
    address: 'The Otemachi Tower, 1-5-6 Otemachi, Chiyoda-ku, Tokyo', address_ar: 'برج أوتيماتشي، طوكيو'
  },
  {
    id: '8',
    name: 'Katikies Santorini', name_ar: 'كاتيكيز سانتوريني',
    city: 'Santorini', city_ar: 'سانتوريني',
    country: 'Greece', country_ar: 'اليونان',
    price: 320,
    rating: 4.9,
    reviewsCount: 2901,
    image: 'https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=800',
    images: ['https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=800', 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800'],
    amenities: ['wifi', 'pool', 'spa', 'breakfast', 'bar'],
    description: 'Whitewashed luxury boutique hotel overlooking the Aegean Sea.', description_ar: 'فندق بوتيك فاخر مطلي باللون الأبيض يطل على بحر إيجه.',
    featured: true,
    deal: true,
    address: 'Main Street, Oia 847 02, Greece', address_ar: 'الشارع الرئيسي، أويا، اليونان'
  },
  {
    id: '9',
    name: 'Marriott Mena House', name_ar: 'فندق ماريوت مينا هاوس',
    city: 'Cairo', city_ar: 'القاهرة',
    country: 'Egypt', country_ar: 'مصر',
    price: 350,
    rating: 4.8,
    reviewsCount: 2150,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800'],
    amenities: ['wifi', 'pool', 'breakfast', 'spa', 'ac', 'bar'],
    description: 'Breathtaking views of the Pyramids from a luxurious, historic hotel.', description_ar: 'إطلالات تخطف الأنفاس على الأهرامات من فندق فخم وتاريخي.',
    featured: true,
    deal: false,
    address: '6 Pyramids Road, Giza, Cairo', address_ar: '6 شارع الأهرامات، الجيزة، القاهرة'
  },
  {
    id: '10',
    name: 'Four Seasons Resort', name_ar: 'منتجع فور سيزونز',
    city: 'Sharm El Sheikh', city_ar: 'شرم الشيخ',
    country: 'Egypt', country_ar: 'مصر',
    price: 450,
    rating: 4.9,
    reviewsCount: 1890,
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
    images: ['https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800', 'https://images.unsplash.com/photo-1565881606991-789a8dff9dbb?w=800'],
    amenities: ['wifi', 'pool', 'breakfast', 'spa', 'ac', 'bar', 'gym'],
    description: 'A world-class beachfront resort offering incredible diving experiences at the Red Sea.', description_ar: 'منتجع عالمي على شاطئ البحر يقدم تجارب غوص لا تصدق في البحر الأحمر.',
    featured: true,
    deal: true,
    address: '1 Four Seasons Boulevard, Sharm El Sheikh', address_ar: '1 بوليفارد فور سيزونز، شرم الشيخ'
  },
  {
    id: '11',
    name: 'Hotel Danieli', name_ar: 'فندق دانييلي',
    city: 'Venice', city_ar: 'البندقية',
    country: 'Italy', country_ar: 'إيطاليا',
    price: 550,
    rating: 4.7,
    reviewsCount: 1450,
    image: 'https://images.unsplash.com/photo-1565881606991-789a8dff9dbb?w=800',
    images: ['https://images.unsplash.com/photo-1565881606991-789a8dff9dbb?w=800', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'],
    amenities: ['wifi', 'breakfast', 'ac', 'bar'],
    description: 'Historic luxury hotel located steps away from St Mark\'s Square.', description_ar: 'فندق فخم تاريخي يقع على بعد خطوات من ساحة القديس مارك.',
    featured: true,
    deal: false,
    address: 'Riva degli Schiavoni, Venice', address_ar: 'ريفا ديلي سكيافوني، البندقية'
  },
  {
    id: '12',
    name: 'Rome Cavalieri', name_ar: 'روما كافالييري',
    city: 'Rome', city_ar: 'روما',
    country: 'Italy', country_ar: 'إيطاليا',
    price: 480,
    rating: 4.8,
    reviewsCount: 2200,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    amenities: ['wifi', 'pool', 'spa', 'ac', 'gym', 'bar'],
    description: 'A Waldorf Astoria resort offering panoramic views of Rome.', description_ar: 'منتجع والدورف أستوريا يقدم إطلالات بانورامية على روما.',
    featured: false,
    deal: true,
    address: 'Via Alberto Cadlolo, Rome', address_ar: 'فيا ألبيرتو كادلولو، روما'
  },
  {
    id: '13',
    name: 'Ciragan Palace Kempinski', name_ar: 'قصر جيراغان كمبينسكي',
    city: 'Istanbul', city_ar: 'إسطنبول',
    country: 'Turkey', country_ar: 'تركيا',
    price: 600,
    rating: 4.9,
    reviewsCount: 3100,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800'],
    amenities: ['wifi', 'pool', 'spa', 'ac', 'gym', 'bar'],
    description: 'An Ottoman imperial palace and hotel on the Bosphorus.', description_ar: 'قصر إمبراطوري عثماني وفندق على مضيق البوسفور.',
    featured: true,
    deal: false,
    address: 'Ciragan Caddesi, Besiktas, Istanbul', address_ar: 'شارع جيراغان، بشكتاش، إسطنبول'
  },
  {
    id: '14',
    name: 'Museum Hotel', name_ar: 'متحف الفندق',
    city: 'Cappadocia', city_ar: 'كابادوكيا',
    country: 'Turkey', country_ar: 'تركيا',
    price: 380,
    rating: 4.8,
    reviewsCount: 1650,
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: ['https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800'],
    amenities: ['wifi', 'breakfast', 'pool', 'spa'],
    description: 'Unique luxury cave hotel experience with hot air balloon views.', description_ar: 'تجربة فندقية فريدة وفخمة في الكهوف مع إطلالات على المناطيد.',
    featured: true,
    deal: true,
    address: 'Tekeli Mah, Uchisar, Cappadocia', address_ar: 'تيكيلي ماه، أوجيسار، كابادوكيا'
  },
  {
    id: '15',
    name: 'Soneva Fushi', name_ar: 'سونيفا فوشي',
    city: 'Baa Atoll', city_ar: 'با اتول',
    country: 'Maldives', country_ar: 'جزر المالديف',
    price: 1200,
    rating: 5.0,
    reviewsCount: 950,
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
    images: ['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800', 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800'],
    amenities: ['wifi', 'spa', 'pool', 'breakfast', 'bar'],
    description: 'Award-winning luxury barefoot desert island resort.', description_ar: 'منتجع فاخر وحائز على جوائز على جزيرة صحراوية.',
    featured: true,
    deal: false,
    address: 'Kunfunadhoo Island, Baa Atoll', address_ar: 'جزيرة كونفونادو، با اتول'
  },
  {
    id: '16',
    name: 'Gili Lankanfushi', name_ar: 'جيلي لانكانفوشي',
    city: 'North Male Atoll', city_ar: 'ماليه الشمالية اتول',
    country: 'Maldives', country_ar: 'جزر المالديف',
    price: 1100,
    rating: 4.9,
    reviewsCount: 880,
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: ['https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800'],
    amenities: ['wifi', 'spa', 'breakfast', 'ac', 'bar'],
    description: 'Eco-friendly water villas with ultimate privacy.', description_ar: 'فيلات مائية صديقة للبيئة تتمتع بأقصى درجات الخصوصية.',
    featured: false,
    deal: true,
    address: 'Lankanfushi Island, North Male Atoll', address_ar: 'جزيرة لانكانفوشي، ماليه الشمالية'
  },
  {
    id: '17',
    name: 'W Barcelona', name_ar: 'دبليو برشلونة',
    city: 'Barcelona', city_ar: 'برشلونة',
    country: 'Spain', country_ar: 'اسبانيا',
    price: 420,
    rating: 4.6,
    reviewsCount: 2750,
    image: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=800'],
    amenities: ['wifi', 'pool', 'gym', 'spa', 'bar', 'ac'],
    description: 'Striking sail-like hotel with panoramic views of the Mediterranean.', description_ar: 'فندق مذهل يشبه الشراع مع إطلالات بانورامية على البحر الأبيض المتوسط.',
    featured: true,
    deal: false,
    address: 'Placa Rosa dels Vents 1, Barcelona', address_ar: 'بلاسا روزا ديلس فينتس 1، برشلونة'
  },
  {
    id: '18',
    name: 'Hotel Ritz', name_ar: 'فندق ريتز',
    city: 'Madrid', city_ar: 'مدريد',
    country: 'Spain', country_ar: 'اسبانيا',
    price: 390,
    rating: 4.8,
    reviewsCount: 1980,
    image: 'https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=800',
    images: ['https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=800', 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800'],
    amenities: ['wifi', 'breakfast', 'gym', 'spa', 'bar', 'ac'],
    description: 'A Belle Époque palace in the Golden Triangle of Art.', description_ar: 'قصر من حقبة الـ Belle Époque في المثلث الذهبي للفنون.',
    featured: false,
    deal: true,
    address: 'Plaza de la Lealtad 5, Madrid', address_ar: 'ساحة دي لا ليالتاد 5، مدريد'
  },
  {
    id: '19',
    name: 'Mandarin Oriental', name_ar: 'ماندارين أورينتال',
    city: 'Bangkok', city_ar: 'بانكوك',
    country: 'Thailand', country_ar: 'تايلاند',
    price: 460,
    rating: 4.9,
    reviewsCount: 3200,
    image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: ['https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800'],
    amenities: ['wifi', 'pool', 'spa', 'gym', 'breakfast', 'bar'],
    description: 'Legendary luxury hotel on the banks of the Chao Phraya River.', description_ar: 'فندق فخم أسطوري على ضفاف نهر تشاو فرايا.',
    featured: true,
    deal: false,
    address: '48 Oriental Avenue, Bangkok', address_ar: '48 أورينتال أفنيو، بانكوك'
  },
  {
    id: '20',
    name: 'Keemala', name_ar: 'كيمالا',
    city: 'Phuket', city_ar: 'بوكيت',
    country: 'Thailand', country_ar: 'تايلاند',
    price: 350,
    rating: 4.8,
    reviewsCount: 1420,
    image: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: ['https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    amenities: ['wifi', 'pool', 'spa', 'breakfast', 'ac'],
    description: 'All-pool villa wonderland set in the rainforest of Kamala.', description_ar: 'أرض العجائب من الفيلات المزودة بمسابح في غابة كمالا المطيرة.',
    featured: false,
    deal: true,
    address: '10/88 Nakasud Rd, Kamala, Phuket', address_ar: '10/88 طريق ناكاسود، بوكيت'
  },
  {
    id: '21',
    name: 'The Ritz', name_ar: 'الريتز',
    city: 'London', city_ar: 'لندن',
    country: 'UK', country_ar: 'المملكة المتحدة',
    price: 550,
    rating: 4.7,
    reviewsCount: 2800,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    amenities: ['wifi', 'breakfast', 'gym', 'bar', 'ac'],
    description: 'Iconic luxury hotel in Piccadilly with world-famous afternoon tea.', description_ar: 'فندق فخم ومميز في بيكاديللي يشتهر بشاي بعد الظهر المشهور عالمياً.',
    featured: true,
    deal: false,
    address: '150 Piccadilly, St. James, London', address_ar: '150 بيكاديللي، لندن'
  },
  {
    id: '22',
    name: 'The Savoy', name_ar: 'سافوي',
    city: 'London', city_ar: 'لندن',
    country: 'UK', country_ar: 'المملكة المتحدة',
    price: 600,
    rating: 4.8,
    reviewsCount: 2500,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800'],
    amenities: ['wifi', 'pool', 'gym', 'spa', 'bar', 'ac'],
    description: 'Famous luxury hotel perfectly placed on the River Thames.', description_ar: 'فندق فخم وشهير يتمتع بموقع مثالي على نهر التايمز.',
    featured: false,
    deal: true,
    address: 'Strand, London', address_ar: 'ستراند، لندن'
  },
  {
    id: '23',
    name: 'Atlantis The Palm', name_ar: 'أتلانتس النخلة',
    city: 'Dubai', city_ar: 'دبي',
    country: 'UAE', country_ar: 'الإمارات العربية المتحدة',
    price: 700,
    rating: 4.7,
    reviewsCount: 4500,
    image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: ['https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'],
    amenities: ['wifi', 'pool', 'spa', 'gym', 'bar', 'breakfast'],
    description: 'Ocean-themed resort featuring a massive waterpark and aquarium.', description_ar: 'منتجع بطابع المحيط يتميز بحديقة مائية ضخمة وأكواريوم.',
    featured: true,
    deal: true,
    address: 'Crescent Rd, The Palm Jumeirah, Dubai', address_ar: 'طريق الهلال، نخلة جميرا، دبي'
  },
  {
    id: '24',
    name: 'Hôtel Plaza Athénée', name_ar: 'فندق بلازا أثيني',
    city: 'Paris', city_ar: 'باريس',
    country: 'France', country_ar: 'فرنسا',
    price: 580,
    rating: 4.9,
    reviewsCount: 1800,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
    images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800'],
    amenities: ['wifi', 'spa', 'gym', 'bar', 'breakfast', 'ac'],
    description: 'The Haute Couture address of Paris with Eiffel Tower views.', description_ar: 'عُنوان الأزياء الراقية في باريس مع إطلالات على برج إيفل.',
    featured: true,
    deal: false,
    address: '25 Avenue Montaigne, 75008 Paris', address_ar: '25 شارع مونتين، باريس'
  },
  {
    id: '25',
    name: 'Park Hyatt', name_ar: 'بارك حياة',
    city: 'Tokyo', city_ar: 'طوكيو',
    country: 'Japan', country_ar: 'اليابان',
    price: 520,
    rating: 4.8,
    reviewsCount: 2100,
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
    images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800'],
    amenities: ['wifi', 'pool', 'spa', 'gym', 'bar', 'ac'],
    description: 'Iconic luxury hotel featured in Lost in Translation.', description_ar: 'فندق فخم ومميز ظهر في فيلم ضائع في الترجمة.',
    featured: false,
    deal: true,
    address: '3-7-1-2 Nishi-Shinjuku, Tokyo', address_ar: '3-7-1-2 نيشي شينجوكو، طوكيو'
  },
  {
    id: '26',
    name: 'Cavo Tagoo', name_ar: 'كافو تاجو',
    city: 'Mykonos', city_ar: 'ميكونوس',
    country: 'Greece', country_ar: 'اليونان',
    price: 450,
    rating: 4.8,
    reviewsCount: 1750,
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
    images: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
    amenities: ['wifi', 'pool', 'spa', 'bar', 'breakfast', 'ac'],
    description: 'Chic hotel offering infinity pools and breathtaking sunset views.', description_ar: 'فندق أنيق يوفر مسابح لا متناهية وإطلالات خلابة على غروب الشمس.',
    featured: true,
    deal: false,
    address: 'Tagoo, Mykonos 846 00, Greece', address_ar: 'تاجو، ميكونوس، اليونان'
  }
];

export async function getHotels(params?: {
  q?: string;
  city?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  amenities?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}): Promise<Hotel[]> {
  let filteredHotels = mockHotels;
  if (params?.q) {
    const query = params.q.toLowerCase().trim();
    filteredHotels = mockHotels.filter(hotel =>
      hotel.name.toLowerCase().includes(query) ||
      hotel.city.toLowerCase().includes(query) ||
      hotel.country.toLowerCase().includes(query) ||
      (hotel.name_ar && hotel.name_ar.includes(query)) ||
      (hotel.city_ar && hotel.city_ar.includes(query)) ||
      (hotel.country_ar && hotel.country_ar.includes(query))
    );
  }
  return filteredHotels;
}

export async function getHotelById(id: string): Promise<HotelWithRooms | null> {
  const foundHotel = mockHotels.find(h => h.id === id);

  const hotelToReturn = foundHotel || {
    id,
    name: `Dynamic Hotel ${id}`,
    name_ar: `فندق ديناميكي ${id}`,
    city: 'Unknown Location',
    city_ar: 'مدينة غير معروفة',
    country: 'World',
    country_ar: 'دولي',
    price: 120 + Number(id) * 10,
    rating: 4.0 + (Number(id) % 10) / 10,
    reviewsCount: 100 * (Number(id) % 5 + 1),
    image: 'https://images.pexels.com/photos/594077/pexels-photo-594077.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/594077/pexels-photo-594077.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
    ],
    amenities: ['wifi', 'ac'],
    description: 'A beautiful generated hotel tailored dynamically for this view.',
    description_ar: 'فندق جميل تم إنشاؤه ديناميكيًا مخصص لهذه الواجهة.',
    featured: false,
    address: '123 Unknown Street',
    address_ar: '123 شارع غير معروف'
  } as Hotel;

  const mockRooms: Room[] = [
    {
      id: '1',
      name: 'Deluxe King Room',
      name_ar: 'غرفة ديلوكس كينج',
      type: 'deluxe',
      price: hotelToReturn.price || 199,
      capacity: 2,
      amenities: ['wifi', 'ac', 'tv'],
      images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400'],
      description: 'Spacious room with king bed and city views.',
      description_ar: 'غرفة فسيحة مع سرير كبير الحجم وإطلالات على المدينة.',
      available: true
    },
    {
      id: '2',
      name: 'Standard Double Room',
      name_ar: 'غرفة مزدوجة قياسية',
      type: 'double',
      price: Math.floor((hotelToReturn.price || 199) * 0.7),
      capacity: 2,
      amenities: ['wifi', 'ac'],
      images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400'],
      description: 'Comfortable room with two double beds.',
      description_ar: 'غرفة مريحة مع سريرين مزدوجين.',
      available: true
    }
  ];

  return {
    hotel: hotelToReturn,
    rooms: mockRooms,
    reviews: []
  };
}

export const hotels = mockHotels;

export interface Destination {

  id: string;
  name: string;
  country: string;
  img: () => Promise<{ default: string }>;
}

export const destinations: Destination[] = [
  {
    id: "1",
    name: "Paris",
    country: "France",
    img: () => import("@/assets/dest-paris.jpg"),
  },
  {
    id: "2",
    name: "Tokyo",
    country: "Japan",
    img: () => import("@/assets/dest-tokyo.jpg"),
  },
  {
    id: "3",
    name: "Santorini",
    country: "Greece",
    img: () => import("@/assets/dest-santorini.jpg"),
  },
  {
    id: "4",
    name: "Dubai",
    country: "UAE",
    img: () => import("@/assets/dest-dubai.jpg"),
  },
];