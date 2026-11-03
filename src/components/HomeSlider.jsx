"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    A11y,
    Autoplay,
    EffectFade,
    Keyboard,
    Navigation,
    Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
    {
        image: "/images/banner/slide-1.jpg",
        title: "Share the books on your shelf",
        text: "Add the books you have finished. Let other readers enjoy them too.",
        href: "/all-books",
    },
    {
        image: "/images/banner/slide-2.jpg",
        title: "Borrow from readers near you",
        text: "Browse a growing shelf of community books and take home your next favourite.",
        href: "/all-books",
    },
    {
        image: "/images/banner/slide-3.jpg",
        title: "Every book finds a new reader",
        text: "Lend, borrow, and keep stories moving from one shelf to the next.",
        href: "/all-books",
    },
];

const HomeSlider = () => {
    return (
        <section className="relative w-full overflow-hidden bg-ink">
            <h1 className="sr-only">
                BookNook — share the books on your shelf and borrow from readers
                near you
            </h1>

            <Swiper
                modules={[
                    A11y,
                    Autoplay,
                    EffectFade,
                    Keyboard,
                    Navigation,
                    Pagination,
                ]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={800}
                loop
                autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                keyboard={{ enabled: true }}
                navigation
                pagination={{ clickable: true }}
                a11y={{ enabled: true }}
                className="home-slider h-135 w-full sm:h-150 lg:h-160"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={slide.title} className="relative">
                        <Image
                            src={slide.image}
                            alt=""
                            fill
                            sizes="100vw"
                            className="object-cover"
                            loading={index === 0 ? "eager" : "lazy"}
                            fetchPriority={index === 0 ? "high" : "auto"}
                        />

                        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-black/25" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-black/10" />

                        <div className="relative z-10 mx-auto flex h-full w-full max-w-360 items-center px-6 xl:px-10">
                            <div className="max-w-155 pb-10 sm:pb-0">
                                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/70">
                                    BookNook
                                </p>

                                <h2 className="mt-4 text-[34px] leading-[1.08] font-semibold tracking-[-0.02em] text-white sm:text-[46px] lg:text-[60px]">
                                    {slide.title}
                                </h2>

                                <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-white/75 sm:text-[17px]">
                                    {slide.text}
                                </p>

                                <Link
                                    href={slide.href}
                                    className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-brand px-6 text-[14px] font-medium text-white transition-colors hover:bg-[#2b5548] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 focus-visible:outline-none"
                                >
                                    Browse Books
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default HomeSlider;
