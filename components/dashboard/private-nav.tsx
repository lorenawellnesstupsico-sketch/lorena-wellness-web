"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/proceso", label: "Mi proceso" },
  { href: "/dashboard/recursos", label: "Recursos" },
  { href: "/dashboard/sesiones", label: "Sesiones" },
  { href: "/dashboard/perfil", label: "Perfil" },
];

export function PrivateNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex flex-wrap gap-3">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex items-center rounded-full px-4 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-[#C97B57] text-white shadow-sm"
                : "border border-[#DED2C5] bg-white/90 text-[#4E3427] hover:bg-[#F6EFE8]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}