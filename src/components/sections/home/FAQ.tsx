import SectionHeader from "@/components/shared/SectionHeader";
import { FaCircleQuestion } from "react-icons/fa6";
import FaqItem from "@/components/shared/FaqItem";

export type FAQItemType = {
    title: string;
    description: string;
}

const faqItems: FAQItemType[] = [
    {
        title: "What is the AI-powered system design creator?",
        description: "The AI-powered system design creator allows you to generate fully editable system architecture designs based on your project description. Simply describe your project, and our AI will create a professional design tailored to your needs, which you can then customize as per your requirements."
    },
    {
        title: "Is my work saved automatically?",
        description: "Yes! Your design is automatically saved every 5 seconds, so you never have to worry about losing progress. You can also access version history to roll back to previous versions if needed."
    },
    {
        title: "What is the multi-tenant support?",
        description: "Multi-tenant support ensures that users can create and manage separate workspaces for different projects or clients. Each tenant's data is securely isolated, and you can easily switch between workspaces as needed."
    },
    {
        title: "How secure is my data?",
        description: "We take security seriously. Your designs are stored securely in the cloud with encryption and access control measures. You can also manage the visibility of your designs, keeping them private or making them public as needed."
    },
    {
        title: "What types of designs can I create?",
        description: "You can create a wide range of system designs, including but not limited to cloud infrastructures, microservices architectures, APIs, and data flows. The AI can also help with dependency mapping and identifying key components in your design."
    },
    {
        title: "Is there any limit on the number of designs I can create?",
        description: "There is no limit on the number of designs you can create. Whether you're working on a personal project or collaborating with a team, you can create and save as many designs as you need."
    },
    {
        title: "What programming languages are supported for code generation?",
        description: "Our platform can generate skeleton code for system components in popular programming languages like Java, Python, Node.js, and more, depending on your design's requirements."
    },
    {
        title: "How do I get started with the platform?",
        description: "Getting started is easy! Simply sign up for an account, describe your project, and let our AI generate a system design for you. You can then customize it, collaborate with your team, and export it to fit your needs."
    },
    {
        title: "Can I keep my designs private?",
        description: "Yes, you have full control over the visibility of your designs. You can keep your designs private or share them publicly with others based on your preferences."
    },
    {
        title: "Do I need any special technical skills to use this platform?",
        description: "No! The platform is designed to be user-friendly and intuitive. You don’t need to be a technical expert to create professional system designs. However, having a basic understanding of system architecture concepts will help you get the most out of the platform."
    },
    {
        title: "Can I collaborate with external users?",
        description: "Yes, you can invite external users to collaborate on your design. You can assign different permissions to each collaborator, such as view-only or edit access."
    },
    {
        title: "Is there a free trial available?",
        description: "Yes, we offer a free trial that lets you explore the core features of the platform before committing to a subscription. This gives you the opportunity to test the AI-powered design generation and editing tools."
    }
];

export default function FAQ() {
    return (
        <section className="w-full min-h-screen flex flex-col items-center justify-center gap-10 relative py-32">
            <div className="absolute top-0 w-full h-[300px] bg-gradient-to-b from-blue-500/20 to-transparent blur-3xl"></div>
            <SectionHeader Icon={FaCircleQuestion} title="Your Questions Answered" section="FAQ" description="Answers to some of the Most Important Questions" />
            <div className="w-full max-w-5xl flex flex-col items-center justify-center gap-5">
                {faqItems.map((faqItem) => (
                    <FaqItem key={Math.random().toString(32).substring(2, 5)} {...faqItem} />
                ))}
            </div>
        </section>
    )
}