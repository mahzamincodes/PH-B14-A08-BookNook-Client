const steps = [
    {
        number: "01",
        title: "Add a book",
        text: "List a title from your shelf with a photo, category, and how many copies you can lend.",
        icon: (
            <>
                <path d="M12 7v14" />
                <path d="M3 18V5.5A1.5 1.5 0 0 1 4.5 4H8a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3.5A1.5 1.5 0 0 1 21 5.5V18a1 1 0 0 1-1 1h-4a4 4 0 0 0-4 2 4 4 0 0 0-4-2H4a1 1 0 0 1-1-1Z" />
            </>
        ),
    },
    {
        number: "02",
        title: "Find your next read",
        text: "Browse the shared shelf, open any book, and check who added it and how many copies are free.",
        icon: (
            <>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
            </>
        ),
    },
    {
        number: "03",
        title: "Borrow and return",
        text: "Confirm a borrow in one click. When you are finished, return it so the next reader can pick it up.",
        icon: (
            <>
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 4v5h5" />
                <path d="M12 7v5l3 2" />
            </>
        ),
    },
];

const HowItWorks = () => {
    return (
        <section className="bg-surface py-16 sm:py-20 lg:py-24">
            <div className="mx-auto w-full max-w-360 px-6 xl:px-10">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
                    <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-brand">
                            How It Works
                        </p>
                        <h2 className="mt-3 max-w-140 text-[30px] leading-[1.12] font-semibold tracking-[-0.02em] text-ink sm:text-[38px] lg:text-[44px]">
                            Borrow a book in three simple steps
                        </h2>
                    </div>

                    <p className="max-w-105 text-[15px] leading-7 text-muted lg:pb-1">
                        No fees, no queues — just readers passing good books
                        along. Here is the whole loop, from shelf to shelf.
                    </p>
                </div>

                <ol className="mt-10 grid list-none grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
                    {steps.map((step) => (
                        <li key={step.number} className="h-full">
                            <div className="flex h-full flex-col rounded-2xl border border-black/6 bg-white p-6 transition-shadow duration-200 hover:shadow-[0_18px_40px_-30px_rgba(27,31,34,0.45)] lg:p-7">
                                <div className="flex items-center justify-between">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-[13px] font-semibold tracking-[0.02em] text-brand">
                                        {step.number}
                                    </span>

                                    <svg
                                        className="h-5.5 w-5.5 text-brand/70"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        {step.icon}
                                    </svg>
                                </div>

                                <h3 className="mt-6 text-[19px] font-semibold leading-snug text-ink">
                                    {step.title}
                                </h3>
                                <p className="mt-2 text-[15px] leading-7 text-muted">
                                    {step.text}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
};

export default HowItWorks;
