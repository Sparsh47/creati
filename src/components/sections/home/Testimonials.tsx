import SectionHeader from "@/components/shared/SectionHeader";
import { BsChatLeftHeartFill } from "react-icons/bs";
import {CardStack} from "@/components/ui/card-stack";

const CARDS = [
    {
        id: 0,
        name: "Alice Johnson",
        designation: "Product Manager",
        content: (
            <p>
                The system design generator saved me hours of work. Absolutely love how I can quickly tweak designs and collaborate with my team in real-time.
            </p>
        ),
    },
    {
        id: 1,
        name: "Bob Smith",
        designation: "Lead Developer",
        content: (
            <p>
                As a developer, I appreciate the seamless integration with my tools. It really makes my workflow more efficient.
            </p>
        ),
    },
    {
        id: 2,
        name: "Clara Lee",
        designation: "UX Designer",
        content: (
            <p>
                The real-time collaboration feature is a game-changer. I can easily work with developers and get instant feedback on designs. Highly recommend this tool!
            </p>
        ),
    },
    {
        id: 3,
        name: "David Miller",
        designation: "Full Stack Engineer",
        content: (
            <p>
                I love how the platform generates customizable templates that I can modify to fit my project’s unique needs. It speeds up my design process significantly.
            </p>
        ),
    },
    {
        id: 4,
        name: "Eva Chen",
        designation: "Software Architect",
        content: (
            <p>
                The ability to export designs in multiple formats is perfect for presenting to stakeholders. It makes my job so much easier.
            </p>
        ),
    },
    {
        id: 5,
        name: "Frank Turner",
        designation: "Technical Lead",
        content: (
            <p>
                The multi-language support is a lifesaver when collaborating with international teams. It&apos;s simple to use and saves a lot of time. Fantastic feature!
            </p>
        ),
    },
    {
        id: 6,
        name: "Grace Patel",
        designation: "Project Manager",
        content: (
            <p>
                I was initially skeptical about using AI for system designs, but this tool proved me wrong. The AI-powered generation creates designs that are spot on for my needs.
            </p>
        ),
    },
    {
        id: 7,
        name: "Henry Adams",
        designation: "DevOps Engineer",
        content: (
            <p>
                The auto-save and versioning features are extremely useful for ensuring nothing gets lost. I can confidently make changes without worrying.
            </p>
        ),
    },
    {
        id: 8,
        name: "Isla Robinson",
        designation: "Frontend Developer",
        content: (
            <p>
                The export options make it easy to integrate designs into my project management tools. The seamless integration is a huge time-saver.
            </p>
        ),
    },
];


export default function Testimonials() {
    return (
        <section className="w-full min-h-screen flex flex-col items-center justify-center gap-28">
            <SectionHeader Icon={BsChatLeftHeartFill} title="What Our Clients Say" section="testimonials" />
            <div className="w-full max-w-6xl grid grid-cols-3 content-center gap-10">
                <div className="mr-4">
                    <CardStack items={CARDS.slice(0, 3)} />
                </div>
                <div className="mr-4">
                    <CardStack items={CARDS.slice(3, 6)} />
                </div>
                <div>
                    <CardStack items={CARDS.slice(6, 9)} />
                </div>
            </div>
        </section>
    )
}