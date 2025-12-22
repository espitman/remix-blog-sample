# Remix Blog Application

یک وبلاگ مدرن و کامل ساخته شده با Remix، React، Prisma و PostgreSQL. این پروژه از shadcn/ui برای رابط کاربری استفاده می‌کند و دارای قابلیت‌های کامل CRUD برای مدیریت پست‌ها است.

## 🚀 تکنولوژی‌های استفاده شده

### Core Stack
- **[Remix](https://remix.run/)** (v2.9.1) - فریمورک React برای وب
- **[Vite](https://vitejs.dev/)** (v5.4.2) - Build tool و bundler
- **[React](https://react.dev/)** (v18.3.1) - کتابخانه UI
- **[TypeScript](https://www.typescriptlang.org/)** (v5.5.4) - زبان برنامه‌نویسی

### Database & ORM
- **[Prisma](https://www.prisma.io/)** (v5.19.1) - ORM مدرن برای Node.js
- **[PostgreSQL](https://www.postgresql.org/)** - دیتابیس رابطه‌ای

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** (v3.4.13) - فریمورک CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - کامپوننت‌های UI قابل استفاده مجدد
- **[Lucide React](https://lucide.dev/)** - آیکون‌ها

### Utilities
- **class-variance-authority** - مدیریت variant های کامپوننت
- **clsx** & **tailwind-merge** - مدیریت کلاس‌های CSS
- **tailwindcss-animate** - انیمیشن‌های Tailwind

## 📁 ساختار پروژه

```
blog/
├── app/                          # کد اصلی اپلیکیشن
│   ├── components/              # کامپوننت‌های React
│   │   ├── ui/                  # کامپوننت‌های UI از shadcn/ui
│   │   │   ├── alert.tsx        # کامپوننت Alert
│   │   │   ├── button.tsx       # کامپوننت Button
│   │   │   ├── card.tsx         # کامپوننت Card
│   │   │   ├── dialog.tsx       # کامپوننت Dialog (برای تایید حذف)
│   │   │   ├── input.tsx        # کامپوننت Input
│   │   │   └── textarea.tsx     # کامپوننت Textarea
│   │   ├── footer.tsx           # کامپوننت Footer مشترک
│   │   └── clock.tsx            # کامپوننت Timer (stopwatch)
│   ├── lib/                     # توابع و utilities
│   │   ├── db/                  # مدیریت دیتابیس
│   │   │   ├── index.server.ts  # اتصال Prisma Client
│   │   │   └── index.ts         # Re-export برای client
│   │   ├── posts/               # منطق و تایپ‌های پست
│   │   │   ├── post.service.ts  # تمام توابع CRUD پست‌ها
│   │   │   ├── post.types.ts    # Type definitions برای پست‌ها
│   │   │   └── index.ts         # Export مرکزی
│   │   └── utils/                # توابع کمکی
│   │       ├── cn.ts            # تابع merge کلاس‌ها
│   │       └── index.ts         # Export مرکزی
│   ├── routes/                  # Route handlers (Remix)
│   │   ├── _index.tsx           # صفحه اصلی (لیست پست‌ها)
│   │   ├── posts.$slug.tsx      # صفحه نمایش پست
│   │   ├── admin.new.tsx        # صفحه ایجاد پست جدید
│   │   └── admin.edit.$slug.tsx # صفحه ویرایش پست
│   ├── root.tsx                  # Root component (شامل Layout و Footer)
│   └── tailwind.css              # فایل CSS اصلی
├── prisma/                       # Prisma configuration
│   └── schema.prisma             # Schema دیتابیس
├── components.json               # تنظیمات shadcn/ui
├── package.json                 # Dependencies و scripts
├── tsconfig.json                # تنظیمات TypeScript
├── tailwind.config.ts           # تنظیمات Tailwind CSS
├── vite.config.ts               # تنظیمات Vite
└── remix.config.js              # تنظیمات Remix
```

## 🏗️ معماری پروژه

### 1. Layout & Shared Components

#### `app/root.tsx`
- **عملکرد:** Root component و Layout مشترک
- **ویژگی‌ها:**
  - تعریف Layout برای همه صفحات
  - استفاده از Flexbox برای قرار دادن Footer در پایین
  - Import و استفاده از Footer component
  - مدیریت CSS و Meta tags

#### `app/components/footer.tsx`
- **عملکرد:** Footer مشترک برای همه صفحات
- **ویژگی‌ها:**
  - سه ستون: درباره، لینک‌های سریع، درباره پروژه
  - ستون چهارم: Timer component
  - Copyright با سال جاری
  - Responsive design

#### `app/components/clock.tsx`
- **عملکرد:** Timer component (stopwatch)
- **ویژگی‌ها:**
  - نمایش مدت زمان حضور کاربر از زمان بارگذاری صفحه
  - به‌روزرسانی هر ثانیه
  - فرمت هوشمند: `MM:SS` یا `HH:MM:SS`

### 2. Routes (Remix File-based Routing)

#### `app/routes/_index.tsx`
- **مسیر:** `/`
- **عملکرد:** نمایش لیست تمام پست‌ها
- **ویژگی‌ها:**
  - نمایش پست‌ها در grid layout
  - نمایش عکس پست (اگر موجود باشد)
  - نمایش تاریخ و ساعت ساخت پست
  - دکمه‌های Edit و Delete برای هر پست
  - Dialog برای تایید حذف

#### `app/routes/posts.$slug.tsx`
- **مسیر:** `/posts/:slug`
- **عملکرد:** نمایش یک پست کامل
- **ویژگی‌ها:**
  - نمایش عکس پست در بالای صفحه (اگر موجود باشد)
  - نمایش کامل محتوای پست
  - نمایش تاریخ و ساعت ساخت پست
  - دکمه‌های Edit و Delete
  - Dialog برای تایید حذف

#### `app/routes/admin.new.tsx`
- **مسیر:** `/admin/new`
- **عملکرد:** ایجاد پست جدید
- **ویژگی‌ها:**
  - فرم با فیلدهای title, slug, content, imageUrl
  - فیلد imageUrl اختیاری است
  - اعتبارسنجی فرم
  - نمایش خطاها

#### `app/routes/admin.edit.$slug.tsx`
- **مسیر:** `/admin/edit/:slug`
- **عملکرد:** ویرایش پست موجود
- **ویژگی‌ها:**
  - فرم پر شده با داده‌های فعلی (شامل imageUrl)
  - اعتبارسنجی و بررسی slug تکراری
  - به‌روزرسانی پست

### 3. Service Layer (ساختار فولدربندی شده)

#### `app/lib/db/` - مدیریت دیتابیس
- **`index.server.ts`**: اتصال Prisma Client
  - Singleton pattern برای اتصال دیتابیس
  - مدیریت اتصال در development و production
- **`index.ts`**: Re-export برای استفاده در client-side (در صورت نیاز)

#### `app/lib/posts/` - منطق و تایپ‌های پست
- **`post.service.ts`**: شامل تمام توابع مربوط به عملیات CRUD:
  - `getAllPosts()` - دریافت همه پست‌ها
  - `getPostBySlug(slug)` - دریافت پست با slug
  - `getPostById(id)` - دریافت پست با ID
  - `createPost(data)` - ایجاد پست جدید
  - `updatePost(slug, data)` - به‌روزرسانی پست
  - `deletePostById(id)` - حذف پست با ID
  - `deletePostBySlug(slug)` - حذف پست با slug
  - `validatePostData(data)` - اعتبارسنجی داده‌های پست
  - `slugExists(slug)` - بررسی وجود slug

- **`post.types.ts`**: Type definitions:
  - `Post` - نوع پست
  - `CreatePostData` - داده‌های ایجاد پست
  - `UpdatePostData` - داده‌های به‌روزرسانی پست
  - `ValidationResult` - نتیجه اعتبارسنجی

- **`index.ts`**: Export مرکزی برای import راحت‌تر

#### `app/lib/utils/` - توابع کمکی
- **`cn.ts`**: تابع `cn()` برای merge کردن کلاس‌های Tailwind CSS
- **`index.ts`**: Export مرکزی

**مزایای ساختار جدید:**
- ✅ سازماندهی بهتر: هر domain در فولدر خودش
- ✅ مقیاس‌پذیری: افزودن domain جدید آسان‌تر است
- ✅ جداسازی: دیتابیس، سرویس‌ها و utilities جدا هستند
- ✅ قابلیت نگهداری: پیدا کردن فایل‌ها راحت‌تر است

### 4. UI Components

#### shadcn/ui Components
تمام کامپوننت‌های UI از shadcn/ui استفاده می‌کنند:
- **Button** - دکمه با variant های مختلف
- **Card** - کارت برای نمایش محتوا
- **Input** - فیلد ورودی
- **Textarea** - فیلد متن چندخطی
- **Alert** - نمایش پیام‌های خطا
- **Dialog** - Modal برای تایید حذف

#### Custom Components
- **Footer** (`app/components/footer.tsx`) - Footer مشترک برای همه صفحات
  - شامل لینک‌های سریع
  - اطلاعات درباره پروژه
  - Timer component
  - Copyright با سال جاری
  
- **Timer** (`app/components/clock.tsx`) - تایمر stopwatch
  - نمایش مدت زمان حضور کاربر در صفحه
  - به‌روزرسانی هر ثانیه
  - فرمت: `MM:SS` یا `HH:MM:SS`

## 🗄️ ساختار دیتابیس

### Model: Post

```prisma
model Post {
  id        String   @id @default(uuid())
  title     String
  slug      String   @unique
  content   String   @db.Text
  imageUrl  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}
```

**فیلدها:**
- `id` - شناسه یکتا (UUID)
- `title` - عنوان پست
- `slug` - شناسه URL-friendly (یکتا)
- `content` - محتوای پست (Text)
- `imageUrl` - URL عکس پست (اختیاری)
- `createdAt` - تاریخ و ساعت ایجاد
- `updatedAt` - تاریخ و ساعت آخرین به‌روزرسانی

## 🛠️ نصب و راه‌اندازی

### پیش‌نیازها
- Node.js >= 20.0.0
- PostgreSQL (remote یا local)
- npm یا yarn

### مراحل نصب

1. **Clone یا دانلود پروژه**
```bash
cd blog
```

2. **نصب Dependencies**
```bash
npm install
```

3. **تنظیم Environment Variables**
فایل `.env` را در ریشه پروژه ایجاد کنید:
```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=schema_name"
```

**مثال:**
```env
DATABASE_URL="postgresql://root:password@makalu.liara.cloud:33009/postgres?schema=testblog"
```

4. **Push Schema به دیتابیس**
```bash
npx prisma db push
```

این دستور جدول `posts` را در دیتابیس شما ایجاد می‌کند.

5. **اجرای پروژه**
```bash
npm run dev
```

پروژه در `http://localhost:5173` در دسترس خواهد بود.

## 📜 Scripts

```bash
# Development
npm run dev          # اجرای سرور توسعه

# Build
npm run build        # Build برای production

# Production
npm start            # اجرای سرور production

# Utilities
npm run typecheck    # بررسی TypeScript
npm run lint         # اجرای ESLint
```

## ✨ ویژگی‌ها

### CRUD Operations
- ✅ **Create** - ایجاد پست جدید
- ✅ **Read** - نمایش لیست و جزئیات پست
- ✅ **Update** - ویرایش پست
- ✅ **Delete** - حذف پست با تایید

### UI/UX Features
- 🎨 طراحی مدرن با shadcn/ui
- 📱 Responsive design
- 🎭 Dialog برای تایید حذف
- ⚡ Loading states
- 🚨 Error handling
- ✨ Animations و transitions
- 🦶 Footer مشترک در همه صفحات
- ⏱️ Timer برای نمایش مدت زمان حضور
- 🖼️ پشتیبانی از تصویر برای پست‌ها
- 🕐 نمایش تاریخ و ساعت ساخت پست

### Developer Experience
- 🔷 TypeScript برای type safety
- 🏗️ Service layer ساختارمند و فولدربندی شده
- 📦 کامپوننت‌های قابل استفاده مجدد
- 🎯 File-based routing
- 🔍 ESLint برای code quality
- 📁 ساختار منظم lib برای مقیاس‌پذیری
- 🔄 استفاده از Response.json() (Remix v2+)

## 🗺️ Routes

| Route | Description |
|-------|-------------|
| `/` | صفحه اصلی - لیست تمام پست‌ها |
| `/posts/:slug` | نمایش یک پست کامل |
| `/admin/new` | ایجاد پست جدید |
| `/admin/edit/:slug` | ویرایش پست |

## 🔐 اعتبارسنجی

### ایجاد/ویرایش پست
- فیلدهای الزامی: title, slug, content
- فیلد اختیاری: imageUrl (URL عکس)
- Slug باید فقط شامل حروف کوچک، اعداد و خط تیره باشد
- Slug باید یکتا باشد
- ImageUrl باید یک URL معتبر باشد (اگر ارائه شود)

### حذف پست
- تایید کاربر از طریق Dialog
- نمایش نام پست در پیام تایید

## 🎨 Styling

پروژه از Tailwind CSS با CSS Variables استفاده می‌کند:
- **Theme Variables** در `app/tailwind.css`
- **Dark Mode** آماده (فعلاً غیرفعال)
- **Custom Colors** برای primary, secondary, destructive و غیره

## 📦 Dependencies

### Production
- `@remix-run/*` - Remix framework
- `@prisma/client` - Prisma ORM
- `react` & `react-dom` - React library
- `tailwindcss` - CSS framework
- `class-variance-authority` - Variant management
- `lucide-react` - Icons

### Development
- `@remix-run/dev` - Remix dev tools
- `prisma` - Prisma CLI
- `typescript` - TypeScript compiler
- `vite` - Build tool
- `eslint` - Linter

## 🚀 Deployment

### Build برای Production
```bash
npm run build
```

### Environment Variables
مطمئن شوید که `DATABASE_URL` در production environment تنظیم شده است.

### Prisma در Production
```bash
npx prisma generate
npx prisma db push
```

## 📝 نکات مهم

1. **Database Connection**: اطمینان حاصل کنید که connection string دیتابیس صحیح است
2. **Schema Name**: در connection string، schema name را مشخص کنید (مثلاً `?schema=testblog`)
3. **Prisma Client**: بعد از تغییر schema، `npx prisma generate` را اجرا کنید
4. **Type Safety**: تمام route ها و service functions از TypeScript استفاده می‌کنند
5. **Import Paths**: از مسیرهای جدید استفاده کنید:
   - `~/lib/posts/post.service` برای توابع پست
   - `~/lib/db/index.server` برای دیتابیس
   - `~/lib/utils/cn` برای utilities
6. **Response.json()**: پروژه از `Response.json()` به جای `json()` deprecated استفاده می‌کند

## 🤝 Contributing

برای مشارکت در پروژه:
1. Fork کنید
2. Branch جدید ایجاد کنید (`git checkout -b feature/AmazingFeature`)
3. تغییرات را commit کنید (`git commit -m 'Add some AmazingFeature'`)
4. Push کنید (`git push origin feature/AmazingFeature`)
5. Pull Request باز کنید

## 📄 License

این پروژه تحت مجوز MIT منتشر شده است.

## 👨‍💻 Author

ساخته شده با ❤️ توسط Remix و React

---

**نکته:** این پروژه یک نمونه کامل از یک وبلاگ با Remix است و می‌تواند به عنوان پایه برای پروژه‌های بزرگ‌تر استفاده شود.
# remix-blog-sample
