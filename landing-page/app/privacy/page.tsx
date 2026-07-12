"use client";

import Navbar from "../../components/sections/navbar/default";
import Footer from "../../components/sections/footer/default";
import Glow from "../../components/ui/glow";
import Particles from "../../components/ui/particles";
import { LayoutLines } from "../../components/ui/layout-lines";

export default function PrivacyPage() {
    return (
        <main className="bg-background text-foreground min-h-screen w-full relative overflow-hidden">
            <LayoutLines />
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-32 sm:py-40">
                <h1 className="animate-appear from-foreground to-foreground dark:to-muted-foreground relative z-10 inline-block bg-linear-to-r bg-clip-text text-4xl leading-tight font-heading font-bold tracking-tighter text-balance text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-[5rem] md:leading-tight pb-8">
                    Privacy Policy
                </h1>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 animate-appear opacity-0 delay-100 fill-mode-forwards">
                    <p>
                        This Privacy Policy explains how TradePilot (“we”, “us”, or “our”) collects, uses, and protects your information when you use our website and services.
                    </p>

                    <p>
                        TradePilot operates an AI-powered trading automation platform designed to help users create and deploy trading bots through simple, conversational input.
                    </p>

                    <p>
                        By accessing or using our Service, you agree to the collection and use of information in accordance with this policy.
                    </p>

                    <h2 className="text-2xl font-bold pt-4">Information This Policy Covers</h2>

                    <p>This policy explains:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>What personal information we collect and how it is used</li>
                        <li>What choices you have regarding your data</li>
                        <li>How we protect your information</li>
                        <li>How you can access, update, or request deletion of your data</li>
                    </ul>

                    <p>
                        This Privacy Policy applies only to information collected through the TradePilot website and platform.
                    </p>

                    <h2 className="text-2xl font-bold pt-4">Information Collection, Use, and Sharing</h2>

                    <p>
                        TradePilot is the sole owner of the information collected on this platform. We only collect information that you voluntarily provide while using the Service.
                    </p>

                    <p>
                        We do not sell, rent, or trade your personal information to third parties.
                    </p>

                    <h2 className="text-2xl font-bold pt-4">Information We May Collect</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Account information such as name and email address</li>
                        <li>Trading preferences and bot configuration details</li>
                        <li>Broker API keys (stored securely and encrypted)</li>
                        <li>Usage data related to platform interaction</li>
                    </ul>

                    <h2 className="text-2xl font-bold pt-4">How We Use Your Information</h2>

                    <p>We use your information to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Provide and operate the TradePilot service</li>
                        <li>Create, test, and deploy trading bots</li>
                        <li>Improve platform performance and user experience</li>
                        <li>Communicate important updates or service-related notices</li>
                    </ul>

                    <p>
                        Your information is never shared outside TradePilot except where required to deliver the requested service or comply with legal obligations.
                    </p>

                    <h2 className="text-2xl font-bold pt-4">Broker & Trading Data</h2>

                    <p>If you connect a broker or exchange account using API keys:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Keys are encrypted and stored securely</li>
                        <li>TradePilot cannot withdraw funds or change account ownership</li>
                        <li>Credentials are never shared with third parties</li>
                    </ul>

                    <p>
                        You remain in full control of your trading account at all times.
                    </p>

                    <h2 className="text-2xl font-bold pt-4">Analytics & Cookies</h2>

                    <p>We may collect anonymous statistical data using standard web analytics tools. This data may include:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>IP address</li>
                        <li>Browser type</li>
                        <li>Device information</li>
                        <li>Pages visited</li>
                    </ul>

                    <p>
                        This information is used strictly for performance monitoring and platform improvement. No personally identifiable data is shared with analytics providers.
                    </p>

                    <h2 className="text-2xl font-bold pt-4">Your Access to and Control Over Information</h2>

                    <p>You have full control over your personal data. At any time, you may:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Request access to your stored data</li>
                        <li>Request correction of inaccurate information</li>
                        <li>Request deletion of your account and associated data</li>
                        <li>Opt out of non-essential communications</li>
                    </ul>

                    <p>
                        Requests can be made by contacting us via email.
                    </p>

                    <h2 className="text-2xl font-bold pt-4">Security</h2>

                    <p>We take data security seriously and implement industry-standard safeguards to protect your information.</p>

                    <p>Security measures include:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Encrypted data storage (AES-256)</li>
                        <li>Secure communication protocols (SSL/TLS)</li>
                        <li>Restricted access to sensitive information</li>
                    </ul>

                    <p>
                        While no system can guarantee absolute security, we continuously work to protect your data against unauthorized access or misuse.
                    </p>

                    <h2 className="text-2xl font-bold pt-4">Policy Updates</h2>

                    <p>
                        We may update this Privacy Policy from time to time. Any changes will be reflected on this page. Continued use of the Service after updates constitutes acceptance of the revised policy.
                    </p>

                    <h2 className="text-2xl font-bold pt-4">Contact Us</h2>

                    <p>
                        If you have questions, concerns, or believe we are not following this Privacy Policy, please contact us at:
                        <br />
                        Email: <a href="mailto:tradepilot69@gmail.com" className="text-primary hover:underline">tradepilot69@gmail.com</a>
                    </p>
                </div>
            </div>
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Particles className="absolute inset-0 w-full h-full" />
            </div>
            <Footer />
        </main>
    );
}
