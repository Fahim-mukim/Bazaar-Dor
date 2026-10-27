import Link from "next/link";

const NavLinks = async () => {
    const res = await fetch(
        "https://api.abcz.workers.dev/api/bazardor/categories"
    );
    const data = await res.json();

    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 overflow-x-auto py-3 sm:gap-3 [&::-webkit-scrollbar]:hidden">
                    {data.map((item) => (
                        <Link
                            key={item.slug}
                            href={`/category/${item.slug}`}
                            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 sm:px-5"
                        >
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-base shadow-sm">
                                {item.icon}
                            </span>

                            <span>{item.nameBn}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default NavLinks;    