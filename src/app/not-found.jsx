import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <h1 className="text-7xl font-bold text-primary">404</h1>

            <h2 className="mt-4 text-2xl font-semibold">
                Page Not Found
            </h2>

            <p className="mt-2 text-gray-500">
                Sorry, the page you are looking for does not exist.
            </p>

            <Link
                href="/"
                className="mt-6 rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:opacity-90"
            >
                Back to Home
            </Link>
        </main>
    );
}