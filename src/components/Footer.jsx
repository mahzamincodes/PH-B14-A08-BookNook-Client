import Link from "next/link";

const exploreLinks = [
    { label: "All Books", href: "/books" },
    { label: "Categories", href: "/categories" },
    { label: "My Borrows", href: "/my-borrows" },
];

const socialLinks = [
    {
        label: "Facebook",
        href: "https://www.facebook.com/",
        icon: (
            <path d="M13.5 8H16V5h-2.5C10.8 5 9 6.8 9 9.5V11H7v3h2v6h3v-6h3l.5-3H12V9.5c0-.9.4-1.5 1.5-1.5Z" />
        ),
    },
    {
        label: "Instagram",
        href: "https://www.instagram.com/",
        icon: (
            <>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                    cx="18"
                    cy="6"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                />
            </>
        ),
    },
    {
        label: "GitHub",
        href: "https://github.com/",
        icon: (
            <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9c0-1.1.1-1.6-.5-2.2 3.3-.4 6.8-1.6 6.8-7.2 0-1.6-.6-2.9-1.6-3.9.2-.4.7-1.9-.2-3.9 0 0-1.3-.4-4.1 1.5a14 14 0 0 0-7.4 0C5.2.5 3.9.9 3.9.9c-.9 2-.4 3.5-.2 3.9-1 1-1.6 2.3-1.6 3.9 0 5.6 3.5 6.8 6.8 7.2-.5.5-.6 1.1-.6 2.2V22" />
        ),
    },
    {
        label: "X",
        href: "https://x.com/",
        icon: (
            <path d="M18.9 3H22l-6.8 7.8L23.2 21h-6.3l-4.9-6.4L6.4 21H3.2l7.3-8.4L2.8 3h6.5l4.4 5.9L18.9 3Zm-1.1 16h1.7L8.3 4.9H6.5L17.8 19Z" />
        ),
    },
];

const Footer = () => {
    return (
        <footer className="border-t border-black/4 bg-surface">
            <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-12 xl:px-10">
                {/* Brand */}
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3"
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

                    <p className="mt-3 max-w-xs text-[15px] leading-7 text-muted">
                        A little corner for every curious mind. Discover
                        stories, explore ideas, and find your next favorite
                        book.
                    </p>
                </div>

                {/* Explore */}
                <div>
                    <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-brand">
                        Explore
                    </h2>

                    <ul className="mt-4 flex flex-col gap-3">
                        {exploreLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="text-[15px] text-ink transition-colors hover:text-brand"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact & Social */}
                <div>
                    <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-brand">
                        Say Hello
                    </h2>

                    <a
                        href="mailto:hello@booknook.library"
                        className="mt-4 inline-block text-[15px] text-ink transition-colors hover:text-brand"
                    >
                        hello@booknook.library
                    </a>

                    <h3 className="mt-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-brand">
                        Follow Us
                    </h3>

                    <div className="mt-3 flex items-center gap-3">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/8 text-muted transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand"
                            >
                                <svg
                                    className="h-4.25 w-4.25"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    {social.icon}
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-black/6">
                <div className="mx-auto flex w-full max-w-360 flex-col items-center justify-between gap-2 px-6 py-5 text-center sm:flex-row sm:text-left xl:px-10">
                    <p className="text-[13px] text-muted">
                        © 2026 BookNook. All rights reserved.
                    </p>

                    <p className="text-[13px] text-muted">
                        Made with care for book lovers.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
