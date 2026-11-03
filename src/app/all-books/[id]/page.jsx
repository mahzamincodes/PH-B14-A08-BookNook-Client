
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const BookDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();

    const { data: session, isPending: sessionLoading } =
        authClient.useSession();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isBorrowing, setIsBorrowing] = useState(false);

    // Fetch book details with JWT authentication
    const fetchBook = useCallback(async () => {
        try {
            const { data: tokenData, error: tokenError } =
                await authClient.token();

            if (tokenError || !tokenData?.token) {
                throw new Error("Token is missing. Please log in again.");
            }

            const response = await fetch(`${API_BASE}/books/${id}`, {
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch book details");
            }

            const data = await response.json();
            setBook(data);
            setError("");
        } catch (error) {
            setError(error.message);
        }
    }, [id]);

    // Load book details after session is ready
    useEffect(() => {
        if (!id || sessionLoading) return;

        if (!session?.user) {
            router.push("/login");
            return;
        }

        let ignore = false;

        const loadBook = async () => {
            await Promise.resolve();

            if (ignore) return;

            try {
                const { data: tokenData, error: tokenError } =
                    await authClient.token();

                if (tokenError || !tokenData?.token) {
                    throw new Error(
                        "Token is missing. Please log in again."
                    );
                }

                const response = await fetch(`${API_BASE}/books/${id}`, {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch book details");
                }

                const data = await response.json();

                if (!ignore) {
                    setBook(data);
                    setError("");
                }
            } catch (error) {
                if (!ignore) {
                    setError(error.message);
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadBook();

        return () => {
            ignore = true;
        };
    }, [id, sessionLoading, session?.user, router]);

    // Borrow book with JWT authentication
    const handleBorrow = async () => {
        if (!session?.user) {
            toast.error("Please login to borrow this book.");
            router.push("/login");
            return;
        }

        if (!book || book.availableCopies <= 0) {
            toast.error("This book is currently unavailable.");
            return;
        }

        try {
            setIsBorrowing(true);

            const { data: tokenData, error: tokenError } =
                await authClient.token();

            if (tokenError || !tokenData?.token) {
                throw new Error("Token is missing. Please log in again.");
            }

            const response = await fetch(`${API_BASE}/borrows`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenData.token}`,
                },
                body: JSON.stringify({
                    bookId: book._id,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to borrow book.");
            }

            toast.success("Book borrowed successfully!");

            await fetchBook();
        } catch (error) {
            toast.error(error.message || "Something went wrong.");
        } finally {
            setIsBorrowing(false);
        }
    };

    if (sessionLoading || loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-[#f8faf9]">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#dcece3] border-t-brand" />
                    <p className="mt-4 text-sm font-medium text-gray-500">
                        Loading book details...
                    </p>
                </div>
            </div>
        );
    }

    if (!session?.user) return null;

    if (error || !book) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-[#f8faf9] px-6">
                <p className="rounded-xl border border-red-100 bg-white px-6 py-4 text-center text-red-500 shadow-sm">
                    {error || "Book not found"}
                </p>
            </div>
        );
    }

    const isAvailable = book.availableCopies > 0;

    return (
        <section className="bg-[#f8faf9] py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-5 md:px-8">
                <div className="grid items-center gap-10 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:grid-cols-2 md:gap-12 md:p-10 lg:p-14">
                    {/* Book Image */}
                    <div className="flex min-h-87.5 items-center justify-center overflow-hidden rounded-2xl bg-[#f2f6f3] p-6 md:min-h-120">
                        {book.image ? (
                            <Image
                                src={book.image}
                                alt={book.title || "Book cover"}
                                width={400}
                                height={500}
                                unoptimized
                                className="max-h-107.5 w-full rounded-xl object-contain"
                            />
                        ) : (
                            <div className="flex h-87.5 items-center justify-center text-sm text-gray-400">
                                No Image Available
                            </div>
                        )}
                    </div>

                    {/* Book Information */}
                    <div className="py-3">
                        <span className="inline-flex rounded-full bg-[#e8f3ec] px-4 py-2 text-xs font-semibold tracking-wide text-brand">
                            {book.category}
                        </span>

                        <h1 className="mt-5 text-3xl leading-tight font-bold tracking-tight text-[#1f2937] md:text-4xl lg:text-[42px]">
                            {book.title}
                        </h1>

                        <p className="mt-4 text-base text-gray-500">
                            Written by{" "}
                            <span className="font-semibold text-brand">
                                {book.author}
                            </span>
                        </p>

                        <div className="my-7 h-px bg-gray-100" />

                        <h2 className="text-lg font-semibold text-[#1f2937]">
                            About This Book
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-gray-500 md:text-base">
                            {book.description}
                        </p>

                        {/* Book Statistics */}
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-gray-100 bg-[#f8faf9] p-5">
                                <p className="text-xs font-medium tracking-wide text-gray-500">
                                    TOTAL COPIES
                                </p>
                                <p className="mt-2 text-3xl font-bold text-[#1f2937]">
                                    {book.totalCopies}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-[#e0eee5] bg-[#f0f7f2] p-5">
                                <p className="text-xs font-medium tracking-wide text-gray-500">
                                    AVAILABLE COPIES
                                </p>
                                <p className="mt-2 text-3xl font-bold text-brand">
                                    {book.availableCopies}
                                </p>
                            </div>
                        </div>

                        {/* Borrow Button */}
                        <button
                            onClick={handleBorrow}
                            disabled={!isAvailable || isBorrowing}
                            className="mt-8 w-full rounded-xl bg-brand px-6 py-4 text-sm font-semibold text-white shadow-sm transition duration-300 hover:bg-[#294f44] hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                        >
                            {isBorrowing
                                ? "Borrowing..."
                                : isAvailable
                                  ? "Borrow This Book"
                                  : "Currently Unavailable"}
                        </button>

                        <p className="mt-4 text-center text-xs text-gray-400">
                            Discover your next favorite read with BookNook.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookDetailsPage;
