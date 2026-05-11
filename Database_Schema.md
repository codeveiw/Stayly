# Database Schema (مخطط قاعدة البيانات)

هذا المستند يحتوي على مخطط الجداول (Database Schema) لتطبيق Stayly الخاص بك. 

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ BOOKINGS : "has"
    HOTELS ||--o{ BOOKINGS : "receives"
    
    USERS {
        string id PK
        string name
        string email
        string password
        string role "admin/user"
        string phone
        datetime createdAt
    }

    HOTELS {
        string id PK
        string name
        string name_ar
        string city
        string city_ar
        string country
        string country_ar
        float price
        float oldPrice
        int rating
        int reviewsCount
        string image
        string[] images
        string[] amenities
        string description
        string description_ar
        boolean featured
        boolean deal
        string address
        string address_ar
    }

    BOOKINGS {
        string id PK
        string userId FK
        string hotelId FK
        string hotelName
        string hotelImage
        datetime checkIn
        datetime checkOut
        int guests
        string status "pending/confirmed/cancelled"
        float total
        datetime createdAt
    }

    FLIGHTS {
        string id PK
        string flightNumber
        string airline
        json departure
        json arrival
        int duration
        float price
        string class
        int availableSeats
        int totalSeats
        string status
        string aircraft
    }
```

## Tables Details (تفاصيل الجداول)

### 1. جدول المستخدمين (Users Table)
يحتوي على بيانات المستخدمين المسجلين في النظام، سواء كانوا مدراء (Admins) أو مستخدمين عاديين (Users).
- **id**: المُعرف الفريد للمستخدم (Primary Key).
- **name**: اسم المستخدم.
- **email**: البريد الإلكتروني.
- **password**: كلمة المرور.
- **role**: دور المستخدم (admin/user).
- **createdAt**: تاريخ إنشاء الحساب.

### 2. جدول الفنادق (Hotels Table)
يحتوي على بيانات الفنادق المعروضة للحجز وتفاصيلها الداعمة للغتين العربية والإنجليزية.
- **id**: المُعرف الفريد للفندق (Primary Key).
- **name**: اسم الفندق (إنجليزي).
- **name_ar**: اسم الفندق (عربي).
- **city** / **city_ar**: المدينة (إنجليزي/عربي).
- **country** / **country_ar**: الدولة (إنجليزي/عربي).
- **price**: سعر الليلة.
- **rating**: التقييم (من 1 إلى 5).
- **amenities**: المزايا المتاحة في الفندق (مسبح، واي فاي، الخ).
- **description** / **description_ar**: الوصف الكامل للفندق.

### 3. جدول الحجوزات (Bookings Table)
يحتوي على حجوزات المستخدمين ويربط كل مستخدم بجدول الفنادق.
- **id**: المُعرف الفريد للحجز (Primary Key).
- **userId**: مُعرف المستخدم صاحب الحجز (Foreign Key).
- **hotelId**: مُعرف الفندق المحجوز (Foreign Key).
- **checkIn**: تاريخ الوصول.
- **checkOut**: تاريخ المغادرة.
- **guests**: عدد الضيوف.
- **status**: حالة الحجز (مؤكد confirmed، ملغي cancelled).
- **total**: إجمالي السعر.

### 4. جدول رحلات الطيران (Flights Table)
يحتوي على رحلات الطيران المتاحة للبحث في المنصة.
- **id**: المُعرف الفريد للرحلة.
- **flightNumber**: رقم الرحلة.
- **airline**: شركة الطيران.
- **departure**: بيانات الانطلاق (مطار، مدينة، دولة، وقت).
- **arrival**: بيانات الوصول.
- **price**: سعر التذكرة.
- **class**: درجة السفر (اقتصادية وغيرها).
- **status**: حالة الرحلة (مجدولة scheduled وغيرها).
