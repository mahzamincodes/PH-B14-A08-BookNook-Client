
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const publicLinks = [
    { label: "Home", href: "/" },
    { label: "All Books", href: "/all-books" },
];

const privateLinks = [
    ...publicLinks,
    { label: "Add Book", href: "/add-book" },
    { label: "My Books", href: "/my-books" },
    { label: "My Borrows", href: "/my-borrows" },
];

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const { data: session, isPending } = authClient.useSession();

    const user = session?.user;
    const isLoggedIn = !!user;
    const navLinks = isLoggedIn ? privateLinks : publicLinks;

    const isActive = (href) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);

            const { error } = await authClient.signOut();

            if (error) {
                throw new Error(error.message || "Logout failed");
            }

            toast.success("Logged out successfully!", {
                duration: 2000,
            });

            setIsProfileOpen(false);
            setIsMenuOpen(false);

            router.push("/");
            router.refresh();
        } catch (error) {
            toast.error(error.message || "Something went wrong.");
        } finally {
            setIsLoggingOut(false);
        }
    };

    const renderNavLinks = (mobile = false) =>
        navLinks.map((link) => {
            const active = isActive(link.href);

            return (
                <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                        if (mobile) setIsMenuOpen(false);
                    }}
                    aria-current={active ? "page" : undefined}
                    className={
                        mobile
                            ? `rounded-lg px-3 py-2.5 text-[15px] transition-colors ${
                                  active
                                      ? "bg-brand-soft font-semibold text-brand"
                                      : "font-medium text-muted hover:bg-black/3 hover:text-ink"
                              }`
                            : `relative flex h-22 items-center text-[15px] transition-colors after:absolute after:bottom-4.5 after:left-0 after:h-0.75 after:w-full after:rounded-full after:transition-colors ${
                                  active
                                      ? "font-semibold text-brand after:bg-brand"
                                      : "font-medium text-muted after:bg-transparent hover:text-ink"
                              }`
                    }
                >
                    {link.label}
                </Link>
            );
        });

    return (
        <header className="sticky top-0 z-50 border-b border-black/6 bg-white">
            <div className="mx-auto flex h-22 w-full max-w-360 items-center justify-between gap-6 px-6 xl:px-10">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex shrink-0 items-center gap-3"
                    aria-label="BookNook home"
                >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white">
                        <svg
                            className="h-6.25 w-6.25"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M12 7v14" />
                            <path d="M3 18V5.5A1.5 1.5 0 0 1 4.5 4H8a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3.5A1.5 1.5 0 0 1 21 5.5V18a1 1 0 0 1-1 1h-4a4 4 0 0 0-4 2 4 4 0 0 0-4-2H4a1 1 0 0 1-1-1Z" />
                        </svg>
                    </span>

                    <span className="text-[25px] font-bold leading-none tracking-[-0.035em] text-ink">
                        BookNook
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav
                    className="hidden items-center gap-6 lg:ml-20 lg:flex"
                    aria-label="Main navigation"
                >
                    {renderNavLinks()}
                </nav>

                {/* Auth / Profile */}
                <div className="flex shrink-0 items-center gap-2">
                    {!isPending && (
                        <>
                            {!isLoggedIn ? (
                                <div className="hidden items-center gap-3 sm:flex">
                                    <Link
                                        href="/login"
                                        className="rounded-full px-5 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand-soft"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                                    >
                                        Register
                                    </Link>
                                </div>
                            ) : (
                                <div className="relative hidden sm:block">
                                    {/* Profile Button */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsProfileOpen((open) => !open)
                                        }
                                        className="group flex max-w-52 items-center gap-2.5 rounded-full"
                                        aria-label="Open profile menu"
                                        aria-expanded={isProfileOpen}
                                    >
                                        {/* User Image or First Letter */}
                                        {user.image?.trim() ? (
                                            <Image
                                                src={user.image}
                                                alt={user.name || "Profile"}
                                                width={44}
                                                height={44}
                                                className="h-11 w-11 shrink-0 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-black text-xl font-medium text-black">
                                                {user.name
                                                    ?.trim()
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "U"}
                                            </span>
                                        )}

                                        {/* Username */}
                                        <span className="max-w-28 truncate text-[15px] font-semibold text-ink">
                                            {user.name}
                                        </span>

                                        {/* Dropdown Arrow */}
                                        <svg
                                            className="h-3.5 w-3.5 shrink-0 text-muted"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M3.5 6l4.5 4.5L12.5 6"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>

                                    {/* Profile Dropdown */}
                                    {isProfileOpen && (
                                        <div className="absolute top-full right-0 mt-3 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                                            <div className="border-b border-gray-100 px-3 py-2">
                                                <p className="truncate text-sm font-semibold text-ink">
                                                    {user.name}
                                                </p>

                                                <p className="truncate text-xs text-muted">
                                                    {user.email}
                                                </p>
                                            </div>

                                            <Link
                                                href="/profile"
                                                onClick={() =>
                                                    setIsProfileOpen(false)
                                                }
                                                className="mt-1 block rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-brand-soft hover:text-brand"
                                            >
                                                My Profile
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                disabled={isLoggingOut}
                                                className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                                            >
                                                {isLoggingOut
                                                    ? "Logging out..."
                                                    : "Logout"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((open) => !open)}
                        className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5 lg:hidden"
                        aria-label={
                            isMenuOpen ? "Close menu" : "Open menu"
                        }
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-navigation"
                    >
                        <svg
                            className="h-6 w-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            {isMenuOpen ? (
                                <path
                                    d="M6 6l12 12M18 6L6 18"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />
                            ) : (
                                <path
                                    d="M4 7h16M4 12h16M4 17h16"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div
                    id="mobile-navigation"
                    className="border-t border-black/6 bg-white lg:hidden"
                >
                    <nav
                        className="mx-auto flex w-full max-w-360 flex-col gap-1 px-6 py-4"
                        aria-label="Mobile navigation"
                    >
                        {renderNavLinks(true)}

                        {!isPending && !isLoggedIn && (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="rounded-lg px-3 py-2.5 text-[15px] font-semibold text-brand hover:bg-brand-soft"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="rounded-lg px-3 py-2.5 text-[15px] font-semibold text-brand hover:bg-brand-soft"
                                >
                                    Register
                                </Link>
                            </>
                        )}

                        {!isPending && isLoggedIn && (
                            <>
                                <div className="my-2 border-t border-gray-100 pt-3">
                                    <div className="flex items-center gap-3 px-3">
                                        {user.image?.trim() ? (
                                            <Image
                                                src={user.image}
                                                alt={user.name || "Profile"}
                                                width={40}
                                                height={40}
                                                className="h-10 w-10 shrink-0 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-black text-lg font-medium text-black">
                                                {user.name
                                                    ?.trim()
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "U"}
                                            </span>
                                        )}

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-ink">
                                                {user.name}
                                            </p>

                                            <p className="truncate text-xs text-muted">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href="/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-muted hover:bg-brand-soft hover:text-brand"
                                >
                                    My Profile
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="rounded-lg px-3 py-2.5 text-left text-[15px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                                >
                                    {isLoggingOut
                                        ? "Logging out..."
                                        : "Logout"}
                                </button>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
