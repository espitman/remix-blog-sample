import { Link } from "@remix-run/react";
import { Timer } from "./clock";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Remix Blog</h3>
            <p className="text-sm text-muted-foreground">
              A modern blog application built with Remix, React, and Prisma.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/new"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Create Post
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">About</h4>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ using Remix, React, Prisma, and shadcn/ui
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Timer</h4>
            <Timer />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} Remix Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

