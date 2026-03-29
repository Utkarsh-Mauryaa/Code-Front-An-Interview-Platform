import type { Metadata } from "next";
import { Berkshire_Swash } from "next/font/google";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./globals.css";
import ConvexClerkProvider from "@/components/providers/ConvexClerkProvider";
import Navbar from "@/components/Navbar";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";

const berkshireSwash = Berkshire_Swash({
    variable: "--font-berkshire-swash",
    subsets: ["latin"],
    weight: "400",
});

export const metadata: Metadata = {
    title: "CodeSync — Interview Platform",
    description: "Technical interview platform with live coding and video",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${berkshireSwash.variable} font-sans antialiased`}>
                <ConvexClerkProvider>
                    <Show when="signed-in">
                        <div className="min-h-screen flex flex-col">
                            <Navbar />
                            <main className="flex-1">{children}</main>
                        </div>
                    </Show>

                    <Show when="signed-out">
                        <div
                            className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
                            style={{
                                background: "radial-gradient(ellipse 100% 55% at 50% 0%, rgba(251,191,36,0.07) 0%, transparent 60%), #0a0a0f",
                            }}
                        >
                            {/* logo */}
                            <div className="flex flex-col items-center gap-3 mb-2">
                                <div
                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center"
                                    style={{
                                        background: "rgba(251,191,36,0.10)",
                                        border: "1px solid rgba(251,191,36,0.22)",
                                    }}
                                >
                                    <span className="text-xl sm:text-2xl">{"</>"}</span>
                                </div>
                                <h1
                                    className="text-2xl sm:text-3xl font-black tracking-tight"
                                    style={{
                                        background: "linear-gradient(135deg, #fcd34d 0%, #fbbf24 50%, #f59e0b 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundClip: "text",
                                    }}
                                >
                                    CodeSync
                                </h1>
                                <p className="text-xs sm:text-sm text-zinc-500 tracking-wide">
                                    Technical Interview Platform
                                </p>
                            </div>

                            {/* glass card */}
                            <div
                                className="w-full max-w-[340px] sm:max-w-sm rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-5"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    backdropFilter: "blur(16px)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 24px 64px rgba(0,0,0,0.5), 0 0 40px rgba(251,191,36,0.05)",
                                }}
                            >
                                <div className="text-center space-y-1">
                                    <h2 className="text-base sm:text-lg font-bold text-zinc-100">Welcome back</h2>
                                    <p className="text-[11px] sm:text-xs text-zinc-500">
                                        Sign in to access your interviews and recordings
                                    </p>
                                </div>

                                <SignInButton mode="modal">
                                    <button className="btn-emerald w-full py-3 rounded-xl text-[13px] tracking-wide">
                                        Sign In
                                    </button>
                                </SignInButton>

                                <p className="text-[11px] text-zinc-700 text-center">
                                    Don&apos;t have an account?{" "}
                                    <SignUpButton mode="modal">
                                        <span className="text-amber-400 cursor-pointer hover:text-amber-300 transition-colors">
                                            Sign up for free
                                        </span>
                                    </SignUpButton>
                                </p>
                            </div>
                        </div>
                    </Show>
                </ConvexClerkProvider>
            </body>
        </html>
    );
}