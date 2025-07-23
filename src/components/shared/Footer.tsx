import Link from "next/link";

type FooterLink = {
    name: string;
    href: string;
}

export default function Footer() {

    const footerLinks: FooterLink[] = [
        {
            name: "Contact Us",
            href: "/contact"
        },
        {
            name: "Privacy Policy",
            href: "/privacy-policy"
        },
        {
            name: "Terms of Service",
            href: "/terms"
        },
        {
            name: "Roadmap",
            href: "/roadmap"
        }
    ];

    return (
        <footer className="w-full py-8 relative flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-transparent to-blue-50/30">
            <hr className="w-full border-none h-[1px] bg-gradient-to-r from-blue-50 via-blue-300 to-blue-50 absolute top-0" />
            <div className="w-full flex items-center justify-center gap-8">
                {footerLinks.map((link) => (
                    <Link key={`${Math.random().toString(36).substring(2, 5)}`} href={link.href} className="text-blue-600 text-sm font-light hover:text-blue-700 duration-200 ease-in-out transition-all">{link.name}</Link>
                ))}
            </div>
            <h1 className="bg-clip-text text-transparent from-blue-600 via-blue-400 to-blue-200 bg-gradient-to-t text-9xl font-semibold"><span className="font-black">Creati</span>.AI</h1>
        </footer>
    )
}