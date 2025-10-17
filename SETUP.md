# Next.js E-Commerce Setup Guide

Bu proje profesyonel bir Next.js 15 e-ticaret uygulamasıdır. .NET Core API ile entegre çalışmak üzere yapılandırılmıştır.

## 🚀 Özellikler

- **Next.js 15** - App Router (Server Components)
- **NextAuth.js** - Kimlik doğrulama ve oturum yönetimi
- **next-intl** - Çoklu dil desteği (TR/EN)
- **Axios** - API istekleri için
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management

## 📁 Proje Yapısı

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API Route handlers (.NET proxy)
│   │   ├── auth/[...nextauth]/   # NextAuth configuration
│   │   └── products/             # Product API endpoints
│   └── (site)/                   # Site pages
├── components/                   # React components
│   └── Providers/                # Context providers
├── i18n/                         # Internationalization
│   ├── messages/                 # Translation files (en.json, tr.json)
│   └── request.ts                # i18n configuration
├── lib/
│   └── api/                      # API utilities
│       ├── client.ts             # Axios client with interceptors
│       ├── proxy.ts              # API proxy helper
│       ├── types.ts              # TypeScript types
│       └── services/             # API services
│           ├── auth.service.ts
│           └── product.service.ts
├── types/
│   └── next-auth.d.ts            # NextAuth type extensions
└── middleware.ts                 # Route middleware (auth + i18n)
```

## 🛠️ Kurulum

### 1. Paketleri Yükleyin

\`\`\`bash
npm install
\`\`\`

### 2. Environment Variables

\`.env.local\` dosyasını düzenleyin:

\`\`\`env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# .NET API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
API_URL=http://localhost:5000/api
\`\`\`

**NEXTAUTH_SECRET oluşturmak için:**
\`\`\`bash
openssl rand -base64 32
\`\`\`

### 3. .NET API'yi Hazırlayın

.NET Core API'nizin aşağıdaki endpoint'lere sahip olması gerekir:

#### Auth Endpoints:
- `POST /api/users/login` - Kullanıcı girişi (email, password gönderir, JWT token döner)
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/logout` - Çıkış
- `POST /api/auth/refresh` - Token yenileme
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi

#### Product Endpoints:
- `GET /api/products` - Tüm ürünler (pagination + filter)
- `GET /api/products/{id}` - Tek ürün
- `GET /api/products/search` - Ürün arama
- `GET /api/products/category/{category}` - Kategoriye göre ürünler
- `GET /api/products/featured` - Öne çıkan ürünler

### 4. Uygulamayı Çalıştırın

\`\`\`bash
npm run dev
\`\`\`

Uygulama http://localhost:3000 adresinde çalışacaktır.

## 🔒 Kimlik Doğrulama

### NextAuth Kullanımı

#### Client Component'te:
\`\`\`tsx
'use client';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Component() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;

  if (session) {
    return (
      <div>
        <p>Hoşgeldin {session.user.name}</p>
        <button onClick={() => signOut()}>Çıkış Yap</button>
      </div>
    );
  }

  return <button onClick={() => signIn()}>Giriş Yap</button>;
}
\`\`\`

#### Server Component'te:
\`\`\`tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return <div>Hoşgeldin {session.user.name}</div>;
}
\`\`\`

## 🌍 Çoklu Dil Desteği

### next-intl Kullanımı

#### Client Component'te:
\`\`\`tsx
'use client';
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('common');

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button>{t('addToCart')}</button>
    </div>
  );
}
\`\`\`

#### Server Component'te:
\`\`\`tsx
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('common');

  return <h1>{t('welcome')}</h1>;
}
\`\`\`

### Dil Değiştirme:
URL'de dil prefix'i kullanın:
- Türkçe: `http://localhost:3000/tr`
- İngilizce: `http://localhost:3000/en`

## 🔌 API Kullanımı

### Client-side API Çağrıları:

\`\`\`tsx
'use client';
import { productService } from '@/lib/api/services';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await productService.getProducts({
          pageNumber: 1,
          pageSize: 10,
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    }
    loadProducts();
  }, []);

  return <div>{/* Render products */}</div>;
}
\`\`\`

### Server-side API Proxy:

API route handlers otomatik olarak .NET API'nize proxy yapar ve authentication'ı handle eder.

## 🛡️ Protected Routes

`middleware.ts` dosyasında korumalı route'lar tanımlı:
- `/checkout`
- `/my-account`
- `/orders`
- `/wishlist`

Bu route'lara erişmek için kullanıcının giriş yapmış olması gerekir.

## 📝 .NET API Response Format

API'nizin aşağıdaki formatta response döndürmesi beklenir:

### Success Response:
\`\`\`json
{
  "data": { /* your data */ },
  "success": true,
  "message": "Success message"
}
\`\`\`

### Paginated Response:
\`\`\`json
{
  "data": [/* items */],
  "success": true,
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 5,
  "totalRecords": 50
}
\`\`\`

### Error Response:
\`\`\`json
{
  "success": false,
  "message": "Error message",
  "errors": ["Error 1", "Error 2"]
}
\`\`\`

## 🔧 Geliştirme

### Yeni API Service Eklemek:

1. `src/lib/api/types.ts` içine type'ları ekleyin
2. `src/lib/api/services/` içine service dosyası oluşturun
3. `src/app/api/` içine route handler ekleyin

### Yeni Dil Eklemek:

1. `src/i18n/request.ts` içinde `locales` array'ine ekleyin
2. `src/i18n/messages/{language}.json` dosyası oluşturun
3. Middleware otomatik olarak yeni dili destekleyecektir

## 📚 Daha Fazla Bilgi

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [next-intl Documentation](https://next-intl-docs.vercel.app)
- [Axios Documentation](https://axios-http.com)

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

MIT License
