import Link from "next/link";

const categories = [
    {
        name: "Fiction",
        text: "Novels, short stories, and a good escape.",
        icon: (
            <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H5.5A1.5 1.5 0 0 1 4 16.5v-11Zm16 0A1.5 1.5 0 0 0 18.5 4H14a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h4.5a1.5 1.5 0 0 0 1.5-1.5v-11Z" />
        ),
    },
    {
        name: "Science",
        text: "Ideas, discoveries, and the natural world.",
        icon: (
            <>
                <path d="M9 3h6M10 3v6.2L5.4 17a2 2 0 0 0 1.7 3h9.8a2 2 0 0 0 1.7-3L14 9.2V3" />
                <path d="M7.5 15h9" />
            </>
        ),
    },
    {
        name: "History",
        text: "People, places, and times before us.",
        icon: (
            <>
                <path d="M4 21h16" />
                <path d="M5 21V10m4 11V10m6 11V10m4 11V10" />
                <path d="M3 10h18L12 3 3 10Z" />
            </>
        ),
    },
    {
        name: "Kids",
        text: "Picture books and young readers.",
        icon: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M8.5 14a4 4 0 0 0 7 0" />
                <path d="M9 9.5h.01M15 9.5h.01" />
            </>
        ),
    },
    {
        name: "Others",
        text: "Poetry, essays, and everything between.",
        icon: (
            <>
                <path d="M20 7h-7l-2-3H4a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Z" />
                <path d="M3 11h18" />
            </>
        ),
    },
];

const TopCategories = () => {
    return (
        <section className="bg-white py-16 sm:py-20 lg:py-24">
            <div className="mx-auto w-full max-w-360 px-6 xl:px-10">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
                    <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-brand">
                            Browse by Genre
                        </p>
                        <h2 className="mt-3 max-w-140 text-[30px] leading-[1.12] font-semibold tracking-[-0.02em] text-ink sm:text-[38px] lg:text-[44px]">
                            Find your next read by category
                        </h2>
                    </div>

                    <p className="max-w-105 text-[15px] leading-7 text-muted lg:pb-1">
                        Every shelf is organised by genre. Pick a direction and
                        start browsing the collection.
                    </p>
                </div>

                <ul className="mt-10 grid list-none grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-12 lg:grid-cols-5">
                    {categories.map((category) => (
                        <li key={category.name} className="h-full">
                            <Link
                                href={`/books?category=${category.name}`}
                                className="group flex h-full flex-col rounded-2xl border border-black/6 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_18px_40px_-30px_rgba(27,31,34,0.45)]"
                            >
                                <div className="flex items-start justify-between">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                                        <svg
                                            className="h-5.25 -[21px]"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            {category.icon}
                                        </svg>
                                    </span>

                                    <svg
                                        className="mt-1 h-4 w-4 text-muted/60 transition duration-200 group-hover:translate-x-0.5 group-hover:text-brand"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M3 8h10" />
                                        <path d="m9 4 4 4-4 4" />
                                    </svg>
                                </div>

                                <h3 className="mt-5 text-[17px] font-semibold text-ink transition-colors group-hover:text-brand">
                                    {category.name}
                                </h3>
                                <p className="mt-1.5 text-[13px] leading-6 text-muted">
                                    {category.text}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default TopCategories;
