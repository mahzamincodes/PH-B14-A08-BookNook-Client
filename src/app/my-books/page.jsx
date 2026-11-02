"use client";

import { useEffect, useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Pencil, Trash2, X, BookOpen } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

export default function MyBookPage() {
    useEffect(() => {
        document.title = "BookNook | My Books";
    }, []);

    const { data: session, isPending } = useSession();
    const user = session?.user;

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBook, setEditingBook] = useState(null);
    const [deletingBook, setDeletingBook] = useState(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        category: "Fiction",
        description: "",
        totalCopies: 1,
    });

    useEffect(() => {
        if (isPending) return;

        if (!user?.email) {
            setLoading(false);
            return;
        }

        const fetchMyBooks = async () => {
            try {
                setLoading(true);

                const response = await fetch(`${API_BASE}/books`);

                if (!response.ok) {
                    throw new Error("Failed to fetch books");
                }

                const data = await response.json();

                const myBooks = data.filter(
                    (book) =>
                        book.addedBy?.email?.toLowerCase() ===
                        user.email.toLowerCase()
                );

                setBooks(myBooks);
            } catch (error) {
                toast.error(error.message || "Could not load your books.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyBooks();
    }, [user?.email, isPending]);

    const handleEditClick = (book) => {
        setEditingBook(book);

        setFormData({
            title: book.title || "",
            author: book.author || "",
            category: book.category || "Fiction",
            description: book.description || "",
            totalCopies: book.totalCopies || 1,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "totalCopies" ? Number(value) : value,
        }));
    };

    // Update book with JWT authentication
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!editingBook) return;

        if (
            !formData.title.trim() ||
            !formData.author.trim() ||
            !formData.description.trim() ||
            formData.totalCopies < 1
        ) {
            toast.error("Please fill in all fields correctly.");
            return;
        }

        try {
            setSaving(true);

            const { data: tokenData, error: tokenError } =
                await authClient.token();

            if (tokenError || !tokenData?.token) {
                throw new Error("Token is missing. Please log in again.");
            }

            const response = await fetch(
                `${API_BASE}/books/${editingBook._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to update book.");
            }

            setBooks((prev) =>
                prev.map((book) =>
                    book._id === editingBook._id
                        ? {
                              ...book,
                              ...formData,
                              availableCopies:
                                  result.book?.availableCopies ??
                                  book.availableCopies,
                          }
                        : book
                )
            );

            toast.success("Book updated successfully!");
            setEditingBook(null);
        } catch (error) {
            toast.error(error.message || "Could not update the book.");
        } finally {
            setSaving(false);
        }
    };

    // Delete book with JWT authentication
    const handleDelete = async () => {
        if (!deletingBook) return;

        try {
            const { data: tokenData, error: tokenError } =
                await authClient.token();

            if (tokenError || !tokenData?.token) {
                throw new Error("Token is missing. Please log in again.");
            }

            const response = await fetch(
                `${API_BASE}/books/${deletingBook._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to delete book.");
            }

            setBooks((prev) =>
                prev.filter((book) => book._id !== deletingBook._id)
            );

            toast.success("Book deleted successfully!");
            setDeletingBook(null);
        } catch (error) {
            toast.error(error.message || "Could not delete the book.");
        }
    };

    if (isPending || loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#356759] border-t-transparent" />
            </div>
        );
    }

    if (!user?.email) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <BookOpen size={48} className="mb-4 text-[#356759]" />
                <h2 className="text-2xl font-semibold text-gray-800">
                    Please log in
                </h2>
                <p className="mt-2 text-gray-500">
                    Log in to see the books you have added.
                </p>
                <a
                    href="/login"
                    className="mt-5 rounded-lg bg-[#356759] px-6 py-3 font-medium text-white transition hover:bg-[#284f44]"
                >
                    Go to Login
                </a>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-[#f8faf9] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <p className="mb-2 font-medium text-[#356759]">
                        YOUR COLLECTION
                    </p>
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        My Books
                    </h1>
                    <p className="mt-3 text-gray-600">
                        Manage the books you have added to BookNook.
                    </p>
                </div>

                <div className="mb-8 rounded-xl border border-[#e3ebe6] bg-white p-5">
                    <p className="text-sm text-gray-500">Total books added</p>
                    <p className="mt-1 text-3xl font-bold text-[#356759]">
                        {books.length}
                    </p>
                </div>

                {books.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
                        <BookOpen
                            size={48}
                            className="mx-auto mb-4 text-[#356759]"
                        />
                        <h2 className="text-xl font-semibold text-gray-800">
                            You haven't added any books yet
                        </h2>
                        <p className="mt-2 text-gray-500">
                            Books you add will appear here.
                        </p>
                        <a
                            href="/add-book"
                            className="mt-6 inline-block rounded-lg bg-[#356759] px-6 py-3 font-medium text-white transition hover:bg-[#284f44]"
                        >
                            Add a Book
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {books.map((book) => (
                            <article
                                key={book._id}
                                className="overflow-hidden rounded-2xl border border-[#e5ebe7] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="h-64 overflow-hidden bg-[#edf3ef]">
                                    {book.image ? (
                                        <img
                                            src={book.image}
                                            alt={book.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-[#356759]">
                                            <BookOpen size={52} />
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <span className="rounded-full bg-[#eaf2ed] px-3 py-1 text-xs font-medium text-[#356759]">
                                        {book.category}
                                    </span>

                                    <h2 className="mt-3 line-clamp-1 text-xl font-semibold text-gray-900">
                                        {book.title}
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        by {book.author}
                                    </p>

                                    <div className="mt-4 flex justify-between text-sm text-gray-600">
                                        <span>Total copies</span>
                                        <span className="font-semibold text-gray-800">
                                            {book.totalCopies}
                                        </span>
                                    </div>

                                    <div className="mt-1 flex justify-between text-sm text-gray-600">
                                        <span>Available copies</span>
                                        <span className="font-semibold text-[#356759]">
                                            {book.availableCopies}
                                        </span>
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() =>
                                                handleEditClick(book)
                                            }
                                            className="flex items-center justify-center gap-2 rounded-lg border border-[#356759] py-2.5 text-sm font-medium text-[#356759] transition hover:bg-[#eaf2ed]"
                                        >
                                            <Pencil size={16} />
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                setDeletingBook(book)
                                            }
                                            className="flex items-center justify-center gap-2 rounded-lg border border-red-200 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                    <div className="my-8 w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl sm:p-8">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Edit Book
                            </h2>
                            <button
                                onClick={() => setEditingBook(null)}
                                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                                aria-label="Close edit form"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Book Title
                                </label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#356759]"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Author
                                </label>
                                <input
                                    name="author"
                                    value={formData.author}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#356759]"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#356759]"
                                >
                                    {categories.map((category) => (
                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#356759]"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Total Copies
                                </label>
                                <input
                                    type="number"
                                    name="totalCopies"
                                    min="1"
                                    value={formData.totalCopies}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#356759]"
                                />
                            </div>

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setEditingBook(null)}
                                    className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-[#356759] px-5 py-3 font-medium text-white transition hover:bg-[#284f44] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                            <Trash2 size={24} />
                        </div>

                        <h2 className="text-xl font-bold text-gray-900">
                            Delete this book?
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-gray-800">
                                {deletingBook.title}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                onClick={() => setDeletingBook(null)}
                                className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
                            >
                                Delete Book
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}