"use client"
import { useAuth } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export default function ConvexClerkProvider({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
            appearance={{
                variables: {
                    // base colours
                    colorBackground:        "#0e0e14",
                    colorInputBackground:   "#16161f",
                    colorInputText:         "#f0f0f4",
                    colorText:              "#f0f0f4",
                    colorTextSecondary:     "#71717a",
                    colorPrimary:           "#fbbf24",   // amber-400
                    colorDanger:            "#f87171",

                    // shape
                    borderRadius:           "0.875rem",

                    // font — inherits your Berkshire Swash via CSS var
                    fontFamily:             "var(--font-berkshire-swash), sans-serif",
                },
                elements: {
                    // ── modal / card shell ──────────────────────────────
                    card: {
                        background:    "rgba(14, 14, 20, 0.95)",
                        backdropFilter:"blur(20px)",
                        border:        "1px solid rgba(255,255,255,0.07)",
                        boxShadow:     "0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.8), 0 0 60px rgba(251,191,36,0.06)",
                    },
                    modalBackdrop: {
                        backdropFilter: "blur(6px)",
                        background:     "rgba(0,0,0,0.70)",
                    },
                    modalContent: {
                        background: "transparent",
                    },

                    // ── header ──────────────────────────────────────────
                    headerTitle: {
                        color:      "#f0f0f4",
                        fontWeight: "800",
                    },
                    headerSubtitle: {
                        color: "#71717a",
                    },

                    // ── form inputs ─────────────────────────────────────
                    formFieldInput: {
                        background:  "rgba(255,255,255,0.04)",
                        border:      "1px solid rgba(255,255,255,0.09)",
                        color:       "#f0f0f4",
                        borderRadius:"0.65rem",
                        outline:     "none",
                    },
                    formFieldLabel: {
                        color:     "#a1a1aa",
                        fontSize:  "12px",
                        fontWeight:"600",
                    },

                    // ── primary button ──────────────────────────────────
                    formButtonPrimary: {
                        background:    "linear-gradient(135deg, #fcd34d 0%, #fbbf24 55%, #f59e0b 100%)",
                        boxShadow:     "0 0 20px rgba(251,191,36,0.30)",
                        color:         "#1a0f00",
                        fontWeight:    "700",
                        borderRadius:  "0.75rem",
                        border:        "none",
                    },

                    // ── social / oauth buttons ──────────────────────────
                    socialButtonsBlockButton: {
                        background:   "rgba(255,255,255,0.04)",
                        border:       "1px solid rgba(255,255,255,0.08)",
                        color:        "#d4d4d8",
                        borderRadius: "0.75rem",
                    },
                    socialButtonsBlockButtonText: {
                        color: "#d4d4d8",
                    },

                    // ── divider ─────────────────────────────────────────
                    dividerLine: {
                        background: "rgba(255,255,255,0.07)",
                    },
                    dividerText: {
                        color: "#52525b",
                    },

                    // ── footer links ────────────────────────────────────
                    footerActionLink: {
                        color: "#fbbf24",
                    },
                    footerActionText: {
                        color: "#52525b",
                    },

                    // ── identity preview (logged-in state in modal) ─────
                    identityPreviewText: {
                        color: "#f0f0f4",
                    },
                    identityPreviewEditButton: {
                        color: "#fbbf24",
                    },
                },
            }}
        >
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}