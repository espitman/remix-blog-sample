import { Link } from "@remix-run/react";
import { Timer } from "./clock";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-right">
            <h3 className="text-lg font-semibold mb-4">وبلاگ Remix</h3>
            <p className="text-sm text-muted-foreground">
              یک اپلیکیشن وبلاگ مدرن ساخته شده با Remix، React و Prisma.
            </p>
          </div>
          
          <div className="text-right">
            <h4 className="text-sm font-semibold mb-4">لینک‌های سریع</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  خانه
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/new"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ایجاد پست
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-right">
            <h4 className="text-sm font-semibold mb-4">درباره</h4>
            <p className="text-sm text-muted-foreground">
              ساخته شده با ❤️ با استفاده از Remix، React، Prisma و shadcn/ui
            </p>
          </div>

          <div className="text-right">
            <h4 className="text-sm font-semibold mb-4">تایمر جلسه</h4>
            <Timer />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} وبلاگ Remix. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}

