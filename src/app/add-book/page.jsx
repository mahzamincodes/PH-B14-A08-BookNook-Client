
"use client";

import { useEffect, useRef, useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

const initialForm = {
    title: "",
    author: "",
    category: "",
    copies: "1",
    description: "",
};

const tips = [
    "Use a clear photo of the actual cover.",
    "Write a short, honest description.",
    "Set the copies you can really lend.",
];

const labelClass = "text-[13px] font-medium text-ink";

const fieldClass = (hasError) =>
    `h-11 w-full rounded-lg border bg-white px-3.5 text-[15px] text-ink outline-none transition placeholder:text-muted/60 focus:ring-2 ${
        hasError
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-black/10 focus:border-brand focus:ring-brand/15"
    }`;

const textareaClass = (hasError) =>
    `w-full rounded-lg border bg-white px-3.5 py-3 text-[15px] leading-7 text-ink outline-none transition placeholder:text-muted/60 focus:ring-2 ${
        hasError
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-black/10 focus:border-brand focus:ring-brand/15"
    }`;

const FieldError = ({ id, message }) => {
    if (!message) return null;

    return (
        <p id={id} className="mt-1.5 text-[12.5px] text-red-600">
            {message}
        </p>
    );
};

const AddBookPage = () => {
    const { data: session, isPending } = useSession();
    const user = session?.user;

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        document.title = "BookNook | Add Book";
    }, []);

    useEffect(() => {
        if (!toast) return;

        const timer = setTimeout(() => setToast(null), 4000);

        return () => clearTimeout(timer);
    }, [toast]);

    useEffect(() => {
        return () => {
            if (image?.preview) {
                URL.revokeObjectURL(image.preview);
            }
        };
    }, [image]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setErrors((current) => {
            if (!current[name]) return current;

            const next = { ...current };
            delete next[name];

            return next;
        });
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setToast({
                type: "error",
                title: "Unsupported file",
                message: "Choose a PNG, JPG, or WebP image for the cover.",
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setToast({
                type: "error",
                title: "Image too large",
                message: "The cover image must be 5MB or smaller.",
            });
            return;
        }

        setErrors((current) => {
            if (!current.image) return current;

            const next = { ...current };
            delete next.image;

            return next;
        });

        setImage({
            file,
            preview: URL.createObjectURL(file),
        });
    };

    const handleRemoveImage = () => {
        setImage(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const validate = () => {
        const nextErrors = {};
        const copies = Number(form.copies);

        if (!form.title.trim()) {
            nextErrors.title = "Book title is required.";
        }

        if (!form.author.trim()) {
            nextErrors.author = "Author name is required.";
        }

        if (!form.category) {
            nextErrors.category = "Please choose a category.";
        }

        if (!Number.isInteger(copies) || copies < 1 || copies > 99) {
            nextErrors.copies = "Enter a whole number between 1 and 99.";
        }

        if (!form.description.trim()) {
            nextErrors.description = "A short description is required.";
        } else if (form.description.trim().length < 20) {
            nextErrors.description = "Write at least 20 characters.";
        }

        return nextErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting || isPending) return;

        if (!user?.name || !user?.email) {
            setToast({
                type: "error",
                title: "Login required",
                message: "Please log in before adding a book.",
            });
            return;
        }

        const nextErrors = validate();

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);

            setToast({
                type: "error",
                title: "Check the form",
                message: "Please fix the highlighted fields and try again.",
            });

            return;
        }

        setIsSubmitting(true);

        try {
            // Get JWT token from Better Auth
            const { data: tokenData, error: tokenError } =
                await authClient.token();

            if (tokenError || !tokenData?.token) {
                throw new Error(
                    "Could not verify your login. Please log in again.",
                );
            }

            const token = tokenData.token;

            let imageUrl = "";

            // Upload book cover with JWT
            if (image?.file) {
                const formData = new FormData();
                formData.append("image", image.file);

                const uploadResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/upload-image`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                    },
                );

                const uploadResult = await uploadResponse.json();

                if (!uploadResponse.ok || !uploadResult.imageUrl) {
                    throw new Error(
                        uploadResult.message || "Image upload failed.",
                    );
                }

                imageUrl = uploadResult.imageUrl;
            }

            const newBook = {
                title: form.title.trim(),
                author: form.author.trim(),
                category: form.category,
                totalCopies: Number(form.copies),
                description: form.description.trim(),
                image: imageUrl,
                addedBy: {
                    name: user.name,
                    email: user.email,
                },
            };

            // Add book with JWT
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/books`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(newBook),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to add book.");
            }

            setForm(initialForm);
            handleRemoveImage();
            setErrors({});

            setToast({
                type: "success",
                title: "Book added",
                message: "Your book has been saved successfully.",
            });
        } catch (error) {
            setToast({
                type: "error",
                title: "Something went wrong",
                message: error.message || "Could not connect to the server.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-surface">
            <div className="mx-auto w-full max-w-[1440px] px-6 py-12 sm:py-16 xl:px-10">
                <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
                    <aside className="lg:sticky lg:top-28 lg:self-start">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-brand">
                            Your Shelf
                        </p>

                        <h1 className="mt-3 text-[34px] leading-[1.1] font-semibold tracking-[-0.02em] text-ink sm:text-[42px] lg:text-[46px]">
                            Add a new book
                        </h1>

                        <p className="mt-4 max-w-[360px] text-[15px] leading-7 text-muted">
                            Share a title from your shelf with the community.
                            Add the details once and let another reader borrow
                            it.
                        </p>

                        <div className="mt-8 hidden rounded-2xl border border-black/[0.06] bg-white p-5 lg:block">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand">
                                Before you add
                            </p>

                            <ul className="mt-4 space-y-3">
                                {tips.map((tip) => (
                                    <li key={tip} className="flex items-start gap-3">
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                                            <svg
                                                className="h-3 w-3"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <path d="m3.5 8.5 3 3 6-7" />
                                            </svg>
                                        </span>

                                        <span className="text-[13.5px] leading-6 text-muted">
                                            {tip}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="w-full max-w-[760px] rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_20px_60px_-40px_rgba(27,31,34,0.45)] sm:p-8"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-ink">
                                    Book details
                                </h2>

                                <p className="mt-1 text-[14px] text-muted">
                                    Fields marked{" "}
                                    <span className="font-medium text-brand">*</span>{" "}
                                    are required.
                                </p>
                            </div>

                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                                <svg
                                    className="h-6 w-6"
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
                        </div>

                        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label htmlFor="title" className={labelClass}>
                                    Book title <span className="text-brand">*</span>
                                </label>

                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="e.g. The Midnight Library"
                                    className={`mt-2 ${fieldClass(Boolean(errors.title))}`}
                                    aria-invalid={Boolean(errors.title)}
                                    aria-describedby={errors.title ? "title-error" : undefined}
                                    required
                                />

                                <FieldError id="title-error" message={errors.title} />
                            </div>

                            <div>
                                <label htmlFor="author" className={labelClass}>
                                    Author name <span className="text-brand">*</span>
                                </label>

                                <input
                                    id="author"
                                    name="author"
                                    type="text"
                                    value={form.author}
                                    onChange={handleChange}
                                    placeholder="e.g. Matt Haig"
                                    className={`mt-2 ${fieldClass(Boolean(errors.author))}`}
                                    aria-invalid={Boolean(errors.author)}
                                    aria-describedby={errors.author ? "author-error" : undefined}
                                    required
                                />

                                <FieldError id="author-error" message={errors.author} />
                            </div>

                            <div>
                                <label htmlFor="category" className={labelClass}>
                                    Category <span className="text-brand">*</span>
                                </label>

                                <div className="relative mt-2">
                                    <select
                                        id="category"
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className={`${fieldClass(Boolean(errors.category))} appearance-none pr-10 ${form.category ? "text-ink" : "text-muted/70"}`}
                                        aria-invalid={Boolean(errors.category)}
                                        aria-describedby={errors.category ? "category-error" : undefined}
                                        required
                                    >
                                        <option value="">Select a category</option>

                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>

                                    <svg
                                        className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-muted"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M3.5 6 8 10.5 12.5 6" />
                                    </svg>
                                </div>

                                <FieldError id="category-error" message={errors.category} />
                            </div>

                            <div>
                                <label htmlFor="copies" className={labelClass}>
                                    Total copies <span className="text-brand">*</span>
                                </label>

                                <input
                                    id="copies"
                                    name="copies"
                                    type="number"
                                    min="1"
                                    max="99"
                                    inputMode="numeric"
                                    value={form.copies}
                                    onChange={handleChange}
                                    className={`mt-2 ${fieldClass(Boolean(errors.copies))}`}
                                    aria-invalid={Boolean(errors.copies)}
                                    aria-describedby={errors.copies ? "copies-error" : "copies-help"}
                                    required
                                />

                                {errors.copies ? (
                                    <FieldError id="copies-error" message={errors.copies} />
                                ) : (
                                    <p id="copies-help" className="mt-1.5 text-[12.5px] text-muted">
                                        How many copies can you lend?
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="description" className={labelClass}>
                                    Short description <span className="text-brand">*</span>
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    rows={5}
                                    maxLength={300}
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="What is the book about, and what kind of reader will enjoy it?"
                                    className={`mt-2 min-h-[132px] resize-y ${textareaClass(Boolean(errors.description))}`}
                                    aria-invalid={Boolean(errors.description)}
                                    aria-describedby={errors.description ? "description-error" : undefined}
                                    required
                                />

                                <div className="mt-1.5 flex items-start justify-between gap-4">
                                    <FieldError id="description-error" message={errors.description} />

                                    <span className="ml-auto text-[12px] text-muted">
                                        {form.description.length}/300
                                    </span>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <span className={labelClass}>
                                    Book cover{" "}
                                    <span className="text-muted">(Optional for now)</span>
                                </span>

                                <input
                                    ref={fileInputRef}
                                    id="book-cover"
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handleImageChange}
                                    className="sr-only"
                                />

                                {image ? (
                                    <div className="mt-2 flex flex-col gap-4 rounded-xl border border-black/[0.08] bg-surface/60 p-4 sm:flex-row sm:items-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={image.preview}
                                            alt="Selected book cover preview"
                                            className="h-24 w-20 rounded-md border border-black/[0.08] object-cover"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-[14px] font-medium text-ink">
                                                {image.file.name}
                                            </p>

                                            <p className="mt-1 text-[12.5px] text-muted">
                                                {Math.max(1, Math.round(image.file.size / 1024))} KB · ready to upload
                                            </p>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2">
                                            <label
                                                htmlFor="book-cover"
                                                className="inline-flex h-9 cursor-pointer items-center rounded-md border border-black/10 bg-white px-3 text-[13px] font-medium text-ink transition-colors hover:border-brand/30 hover:text-brand"
                                            >
                                                Replace
                                            </label>

                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="inline-flex h-9 items-center rounded-md border border-transparent px-3 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="book-cover"
                                        className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-9 text-center transition-colors ${
                                            errors.image
                                                ? "border-red-400 bg-red-50/30"
                                                : "border-black/15 bg-surface/60 hover:border-brand/40 hover:bg-brand-soft/20"
                                        }`}
                                    >
                                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand shadow-sm">
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
                                                <path d="M12 16V4" />
                                                <path d="m7 9 5-5 5 5" />
                                                <path d="M5 16v2.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V16" />
                                            </svg>
                                        </span>

                                        <span className="mt-3 text-[14px] font-medium text-ink">
                                            Click to upload or drag and drop
                                        </span>

                                        <span className="mt-1 text-[12.5px] text-muted">
                                            PNG, JPG or WebP · up to 5MB
                                        </span>
                                    </label>
                                )}

                                <FieldError id="image-error" message={errors.image} />
                            </div>
                        </div>

                        <div className="my-7 h-px bg-black/[0.06]" />

                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <svg
                                    className="h-4 w-4 text-muted"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <rect x="5" y="10" width="14" height="10" rx="2" />
                                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                </svg>

                                <h2 className="text-[16px] font-semibold text-ink">
                                    Added by
                                </h2>

                                <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium tracking-[0.02em] text-muted">
                                    Read only
                                </span>
                            </div>

                            <p className="mt-1.5 text-[13.5px] leading-6 text-muted">
                                These details come from your account and appear on the book page.
                            </p>

                            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="added-by-name" className={labelClass}>
                                        Your name
                                    </label>

                                    <input
                                        id="added-by-name"
                                        type="text"
                                        value={user?.name || ""}
                                        readOnly
                                        placeholder={isPending ? "Loading account..." : "Your name"}
                                        className={`mt-2 cursor-not-allowed bg-surface text-muted ${fieldClass(false)}`}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="added-by-email" className={labelClass}>
                                        Your email
                                    </label>

                                    <input
                                        id="added-by-email"
                                        type="email"
                                        value={user?.email || ""}
                                        readOnly
                                        placeholder={isPending ? "Loading account..." : "Your email"}
                                        className={`mt-2 cursor-not-allowed bg-surface text-muted ${fieldClass(false)}`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-4 border-t border-black/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <p className="max-w-[280px] text-[13px] leading-6 text-muted">
                                You can edit or delete this book later from{" "}
                                <span className="font-medium text-ink">My Books</span>.
                            </p>

                            <button
                                type="submit"
                                disabled={isSubmitting || isPending}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand px-6 text-[14px] font-medium text-white transition-colors hover:bg-[#2b5548] focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <svg
                                        className="h-4 w-4 animate-spin"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="9"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            className="opacity-25"
                                        />
                                        <path
                                            d="M21 12a9 9 0 0 0-9-9"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-4 w-4"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M8 3v10" />
                                        <path d="M3 8h10" />
                                    </svg>
                                )}

                                {isPending
                                    ? "Loading account..."
                                    : isSubmitting
                                      ? "Adding…"
                                      : "Add Book"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {toast && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed inset-x-6 bottom-6 z-[60] flex items-start gap-3 rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_24px_60px_-24px_rgba(27,31,34,0.5)] sm:left-auto sm:w-[360px]"
                >
                    <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            toast.type === "success"
                                ? "bg-brand-soft text-brand"
                                : "bg-red-50 text-red-500"
                        }`}
                    >
                        {toast.type === "success" ? (
                            <svg
                                className="h-4 w-4"
                                viewBox="0 0 16 16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="m3.5 8.5 3 3 6-7" />
                            </svg>
                        ) : (
                            <svg
                                className="h-4 w-4"
                                viewBox="0 0 16 16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                aria-hidden="true"
                            >
                                <path d="M8 4.5v4.5" />
                                <path d="M8 12h.01" />
                            </svg>
                        )}
                    </span>

                    <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold text-ink">
                            {toast.title}
                        </p>

                        <p className="mt-0.5 text-[13px] leading-5 text-muted">
                            {toast.message}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setToast(null)}
                        aria-label="Dismiss notification"
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-black/5 hover:text-ink"
                    >
                        <svg
                            className="h-3.5 w-3.5"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            aria-hidden="true"
                        >
                            <path d="M4 4l8 8M12 4l-8 8" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddBookPage;
