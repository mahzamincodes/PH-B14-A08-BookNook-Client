"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const formatAddedDate = (value) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return null;

    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const BookCover = ({ book }) => {
    const addedDate = formatAddedDate(book.createdAt);

    return (
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-surface">
            {book.image ? (
                <img
                    src={book.image}
                    alt={`${book.title} cover`}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-soft via-[#e8f0eb] to-[#cfdfd5] px-4 text-center">
                    <svg
                        className="h-8 w-8 text-brand/60"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M12 7v14" />
                        <path d="M3 18V5.5A1.5 1.5 0 0 1 4.5 4H8a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3.5A1.5 1.5 0 0 1 21 5.5V18a1 1 0 0 1-1 1h-4a4 4 0 0 0-4 2 4 4 0 0 0-4-2H4a1 1 0 0 1-1-1Z" />
                    </svg>
                    <span className="line-clamp-3 text-[11.5px] leading-4 font-medium tracking-[0.02em] text-brand/70">
                        {book.title}
                    </span>
                </div>
            )}

            {book.category && (
                <span className="absolute top-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.08em] text-brand uppercase backdrop-blur">
                    {book.category}
                </span>
            )}

            {addedDate && (
                <span className="absolute right-2.5 bottom-2.5 rounded-full bg-ink/70 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
                    {addedDate}
                </span>
            )}
        </div>
    );
};

const BookCard = ({ book }) => {
    const total = Number(book.totalCopies) || 0;
    const available = Number(book.availableCopies) || 0;
    const isAvailable = available > 0;

    return (
        <li className="h-full">
            <Link
                href={`/all-books/${book._id}`}
                className="group flex h-full flex-col rounded-2xl border border-black/[0.06] bg-white p-3 transition duration-200 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-[0_20px_44px_-32px_rgba(27,31,34,0.5)]"
            >
                <BookCover book={book} />

                <h3 className="mt-4 line-clamp-2 px-1 text-[15px] leading-snug font-semibold text-ink transition-colors group-hover:text-brand">
                    {book.title}
                </h3>
                <p className="mt-1 truncate px-1 text-[13px] text-muted">
                    {book.author}
                </p>

                <div className="mt-auto flex items-center justify-between px-1 pt-3.5">
                    <span className="text-[12px] font-medium text-brand uppercase tracking-[0.05em]">
                        {book.category}
                    </span>
                    <div className="flex items-center gap-2">
                        <span
                            aria-hidden="true"
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${isAvailable ? "bg-brand" : "bg-muted/40"}`}
                        />
                        <span className="truncate text-[12px] text-muted">
                            {isAvailable
                                ? `${available} of ${total} available`
                                : "All copies borrowed"}
                        </span>
                    </div>
                </div>
            </Link>
        </li>
    );
};

const BookSkeleton = () => (
    <li className="h-full animate-pulse rounded-2xl border border-black/[0.06] bg-white p-3">
        <div className="aspect-[3/4] rounded-xl bg-black/[0.05]" />
        <div className="mt-4 h-3.5 w-4/5 rounded bg-black/[0.06]" />
        <div className="mt-2 h-3 w-1/2 rounded bg-black/[0.04]" />
        <div className="mt-4 h-2.5 w-2/3 rounded bg-black/[0.04]" />
    </li>
);

const EmptyState = () => (
    <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-black/10 bg-surface/60 px-6 py-14 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand shadow-sm">
            <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M12 7v14" />
                <path d="M3 18V5.5A1.5 1.5 0 0 1 4.5 4H8a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3.5A1.5 1.5 0 0 1 21 5.5V18a1 1 0 0 1-1 1h-4a4 4 0 0 0-4 2 4 4 0 0 0-4-2H4a1 1 0 0 1-1-1Z" />
            </svg>
        </span>
        <p className="mt-4 text-[17px] font-semibold text-ink">
            The shelf is waiting for its first book
        </p>
        <p className="mt-1.5 max-w-[380px] text-[14px] leading-6 text-muted">
            Nothing has been added yet. Share a title from your shelf and it
            will show up here.
        </p>
        <Link
            href="/add-book"
            className="mt-6 inline-flex h-10 items-center rounded-md bg-brand px-5 text-[13.5px] font-medium text-white transition-colors hover:bg-[#2b5548]"
        >
            Add the first book
        </Link>
    </div>
);

const ErrorState = ({ onRetry }) => (
    <div className="mt-10 flex flex-col items-center rounded-2xl border border-black/[0.06] bg-surface/60 px-6 py-14 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M12 8v5" />
                <path d="M12 16.5h.01" />
                <circle cx="12" cy="12" r="9" />
            </svg>
        </span>
        <p className="mt-4 text-[17px] font-semibold text-ink">
            Books could not load
        </p>
        <p className="mt-1.5 max-w-[380px] text-[14px] leading-6 text-muted">
            The library service did not respond. Check the connection and try
            again.
        </p>
        <button
            type="button"
            onClick={onRetry}
            className="mt-6 inline-flex h-10 items-center rounded-md border border-black/10 bg-white px-5 text-[13.5px] font-medium text-ink transition-colors hover:border-brand/30 hover:text-brand"
        >
            Try again
        </button>
    </div>
);

const AllBooksPage = () => {
    const [books, setBooks] = useState([]);
    const [status, setStatus] = useState("loading");
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        document.title = "BookNook | All Books";
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        const loadBooks = async () => {
            setStatus("loading");

            try {
                const response = await fetch(
                    `${API_BASE}/books`,
                    { signal: controller.signal },
                );

                if (!response.ok) {
                    throw new Error(`Request failed with ${response.status}`);
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Unexpected response shape");
                }

                const sortedBooks = [...data].sort(
                    (a, b) =>
                        new Date(b.createdAt ?? 0) -
                        new Date(a.createdAt ?? 0),
                );

                setBooks(sortedBooks);
                setStatus("success");
            } catch (error) {
                if (error.name === "AbortError") return;

                setBooks([]);
                setStatus("error");
            }
        };

        loadBooks();

        return () => controller.abort();
    }, [attempt]);

    const retry = useCallback(() => setAttempt((value) => value + 1), []);

    return (
        <section className="bg-white py-16 sm:py-20 lg:py-24">
            <div className="mx-auto w-full max-w-[1440px] px-6 xl:px-10">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
                    <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-brand">
                            All Books
                        </p>
                        <h1 className="mt-3 max-w-[560px] text-[30px] leading-[1.12] font-semibold tracking-[-0.02em] text-ink sm:text-[38px] lg:text-[44px]">
                            Explore the complete collection
                        </h1>
                    </div>

                    <p className="max-w-[420px] text-[15px] leading-7 text-muted lg:pb-1">
                        Browse every title shared by readers. Use the categories to narrow your search.
                    </p>
                </div>

                {status === "success" && books.length === 0 ? (
                    <EmptyState />
                ) : status === "error" ? (
                    <ErrorState onRetry={retry} />
                ) : (
                    <ul
                        aria-busy={status === "loading"}
                        aria-live="polite"
                        className="mt-10 grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5 xl:grid-cols-3"
                    >
                        {status === "loading"
                            ? Array.from({ length: 6 }, (_, index) => (
                                <BookSkeleton key={index} />
                            ))
                            : books.map((book) => (
                                <BookCard key={book._id} book={book} />
                            ))}
                    </ul>
                )}

                <div className="mt-10 flex flex-col items-start gap-3 border-t border-black/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[13.5px] leading-6 text-muted">
                        Every book here belongs to another reader.
                    </p>

                    <Link
                        href="/add-book"
                        className="group inline-flex items-center gap-2 text-[13.5px] font-medium text-brand transition-colors hover:text-[#2b5548]"
                    >
                        Add a book
                        <svg
                            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M8 3v10" />
                            <path d="M3 8h10" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AllBooksPage;