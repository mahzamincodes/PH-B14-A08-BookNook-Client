"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { User, Mail, CalendarDays, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
    useEffect(() => {
        document.title = "BookNook | My Profile";
    }, []);

    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/login");
        }
    }, [isPending, session, router]);

    if (isPending || !session) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#247a50] border-t-transparent" />
            </div>
        );
    }

    const user = session.user;

    return (
        <section className="min-h-[80vh] bg-[#f8faf9] px-5 py-12">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#247a50]"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="bg-[#356759] px-6 py-10 text-center">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white text-3xl font-bold text-[#247a50] shadow-md">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name || "Profile"}
                                    width={96}
                                    height={96}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            ) : (
                                user.name?.charAt(0).toUpperCase() || "U"
                            )}
                        </div>

                        <h1 className="mt-4 text-2xl font-bold text-white">
                            {user.name}
                        </h1>

                        <p className="mt-1 text-sm text-white/80">
                            BookNook Member
                        </p>
                    </div>

                    <div className="p-6 sm:p-8">
                        <h2 className="mb-6 text-xl font-bold text-[#1f2937]">
                            Profile Information
                        </h2>

                        <div className="space-y-5">
                            <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#eaf4ee] text-[#247a50]">
                                    <User size={21} />
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">
                                        Full Name
                                    </p>
                                    <p className="mt-1 font-semibold text-gray-800">
                                        {user.name || "Not available"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#eaf4ee] text-[#247a50]">
                                    <Mail size={21} />
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">
                                        Email Address
                                    </p>
                                    <p className="mt-1 break-all font-semibold text-gray-800">
                                        {user.email || "Not available"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#eaf4ee] text-[#247a50]">
                                    <CalendarDays size={21} />
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">
                                        Member Since
                                    </p>
                                    <p className="mt-1 font-semibold text-gray-800">
                                        {user.createdAt
                                            ? new Date(
                                                  user.createdAt,
                                              ).toLocaleDateString("en-US", {
                                                  year: "numeric",
                                                  month: "long",
                                                  day: "numeric",
                                              })
                                            : "Not available"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}