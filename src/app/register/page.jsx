
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        image: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validatePassword = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasMinimumLength = password.length >= 6;

        return hasUppercase && hasLowercase && hasMinimumLength;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword(formData.password)) {
            toast.error(
                "Password must contain uppercase, lowercase and at least 6 characters.",
            );
            return;
        }

        try {
            setLoading(true);

            const { error } = await authClient.signUp.email({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                image: formData.image || undefined,
            });

            if (error) {
                throw new Error(error.message || "Registration failed");
            }

            toast.success("Registration successful! Redirecting to login...");

            setTimeout(() => {
                router.push("/login");
            }, 1200);
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });
        } catch (err) {
            toast.error(err.message || "Google sign up failed");
        }
    };

    return (
        <section className="flex min-h-[80vh] items-center justify-center bg-[#f8faf9] px-5 py-12">
            <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#1f2937]">
                        Create an Account
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Join BookNook and discover your next favorite book.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#247a50] focus:ring-2 focus:ring-[#247a50]/10"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#247a50] focus:ring-2 focus:ring-[#247a50]/10"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="image"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Photo URL
                        </label>
                        <input
                            id="image"
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="Enter your photo URL"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#247a50] focus:ring-2 focus:ring-[#247a50]/10"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#247a50] focus:ring-2 focus:ring-[#247a50]/10"
                        />
                        <p className="mt-2 text-xs leading-5 text-gray-400">
                            Must contain uppercase, lowercase and at least 6
                            characters.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#247a50] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1b603d] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-xs text-gray-400">
                            OR CONTINUE WITH
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignUp}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                    <svg
                        viewBox="0 0 48 48"
                        className="h-5 w-5"
                        aria-hidden="true"
                    >
                        <path
                            fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                            transform="translate(0 3)"
                        />
                        <path
                            fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.75 7.18l7.73 6C44.42 37.92 46.98 31.8 46.98 24.55z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"
                            transform="translate(0 3)"
                        />
                        <path
                            fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.45-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48z"
                        />
                    </svg>
                    Sign up with Google
                </button>

                <p className="mt-7 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-[#247a50] hover:text-[#1b603d]"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
}
