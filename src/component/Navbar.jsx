
import Image from "next/image";
import logo from "/public/assets/logo-icon.png"
import NavLinks from "./NavLinks";
const Navbar = () => {
    const date = new Date().toLocaleDateString("bn-BD", {
        dateStyle: "full",
    })
    return (

        <header >
            <div className="border-b border-gray-200 bg-white">
                <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
                    {/* Left: Logo and Date */}
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center   rounded-xl  sm:h-14 sm:w-14">
                            <Image
                                src="/assets/logo-icon.png"
                                alt="বাজার দর লোগো"
                                width={40}
                                height={40}
                                className="h-8 w-8 object-contain sm:h-10 sm:w-10"
                                priority
                            />
                        </div>

                        <div className="min-w-0">
                            <h1 className="text-lg font-bold leading-tight text-gray-900 sm:text-2xl">
                                বাজার দর
                            </h1>

                            <p className="mt-1 text-[10px] leading-relaxed text-gray-500 sm:text-sm">
                                {date}
                            </p>
                        </div>
                    </div>

                    {/* Right: Buttons */}
                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <button className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-emerald-600 hover:bg-emerald-50 sm:px-5 sm:py-2.5 sm:text-sm">
                            সাইন ইন
                        </button>

                        <button className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 sm:px-5 sm:py-2.5 sm:text-sm">
                            সাইন আপ
                        </button>
                    </div>
                </nav>
               
            </div>
             <NavLinks ></NavLinks>
            
        </header>
    );


};

export default Navbar;