"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const MyBorrowsPage = () => {
    const router = useRouter();

    const { data: session, isPending: sessionLoading } =
        authClient.useSession();

    const [borrows, setBorrows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [returningId, setReturningId] = useState(null);

    useEffect(() => {
        document.title = "BookNook | My Borrows";
    }, []);

    useEffect(() => {
        if (sessionLoading) return;

        if (!session?.user) {
            router.push("/login");
            return;
        }

        let ignore = false;

        const loadBorrows = async () => {
            try {
                const { data: tokenData, error: tokenError } =
                    await authClient.token();

                if (tokenError || !tokenData?.token) {
                    throw new Error("Token is missing. Please log in again.");
                }

                const response = await fetch(`${API_BASE}/borrows`, {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch borrowed books.");
                }

                const data = await response.json();

                if (!ignore) {
                    setBorrows(data);
                }
            } catch (error) {
                if (!ignore) {
                    toast.error(
                        error.message || "Could not load borrowed books.",
                    );
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadBorrows();

        return () => {
            ignore = true;
        };
    }, [session, sessionLoading, router]);

    const handleReturn = async (borrowId) => {
        try {
            setReturningId(borrowId);

            const { data: tokenData, error: tokenError } =
                await authClient.token();

            if (tokenError || !tokenData?.token) {
                throw new Error("Token is missing. Please log in again.");
            }

            const response = await fetch(`${API_BASE}/borrows/${borrowId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to return book.");
            }

            toast.success("Book returned successfully!");

            setBorrows((previousBorrows) =>
                previousBorrows.filter((borrow) => borrow._id !== borrowId),
            );
        } catch (error) {
            toast.error(error.message || "Could not return the book.");
        } finally {
            setReturningId(null);
        }
    };

    if (sessionLoading || loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-[#f8faf9]">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#dcece3] border-t-brand" />

                    <p className="mt-4 text-sm font-medium text-gray-500">
                        Loading borrowed books...
                    </p>
                </div>
            </div>
        );
    }

    if (!session?.user) return null;

    return (
        <section className="min-h-[70vh] bg-[#f8faf9] py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-5 md:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-[#1f2937] md:text-4xl">
                        My Borrows
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Manage the books you have borrowed.
                    </p>
                </div>

                {borrows.length === 0 ? (
                    <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
                        <h2 className="text-xl font-semibold text-[#1f2937]">
                            No Borrowed Books
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            You havent borrowed any books yet.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-187.5 text-left">
                                <thead className="bg-[#f0f7f2]">
                                    <tr className="text-xs font-semibold tracking-wide text-brand">
                                        <th className="px-6 py-5">BOOK</th>

                                        <th className="px-6 py-5">
                                            BORROW DATE
                                        </th>

                                        <th className="px-6 py-5">
                                            RETURN DATE
                                        </th>

                                        <th className="px-6 py-5 text-center">
                                            ACTION
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {borrows.map((borrow) => (
                                        <tr
                                            key={borrow._id}
                                            className="transition hover:bg-[#f8faf9]"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    {borrow.image ? (
                                                        <Image
                                                            src={borrow.image}
                                                            alt={
                                                                borrow.title ||
                                                                "Book cover"
                                                            }
                                                            width={48}
                                                            height={64}
                                                            unoptimized
                                                            className="h-16 w-12 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-16 w-12 items-center justify-center rounded-lg bg-[#f0f7f2] text-xs text-gray-400">
                                                            No Image
                                                        </div>
                                                    )}

                                                    <span className="font-semibold text-[#1f2937]">
                                                        {borrow.title}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 text-sm text-gray-600">
                                                {borrow.borrowedAt
                                                    ? new Date(
                                                          borrow.borrowedAt,
                                                      ).toLocaleDateString()
                                                    : "N/A"}
                                            </td>

                                            <td className="px-6 py-5 text-sm text-gray-600">
                                                {borrow.returnDate
                                                    ? new Date(
                                                          borrow.returnDate,
                                                      ).toLocaleDateString()
                                                    : "Not set"}
                                            </td>

                                            <td className="px-6 py-5 text-center">
                                                <button
                                                    onClick={() =>
                                                        handleReturn(borrow._id)
                                                    }
                                                    disabled={
                                                        returningId ===
                                                        borrow._id
                                                    }
                                                    className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#294f44] disabled:cursor-not-allowed disabled:bg-gray-300"
                                                >
                                                    {returningId === borrow._id
                                                        ? "Returning..."
                                                        : "Return Book"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MyBorrowsPage;
