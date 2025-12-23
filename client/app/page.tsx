import { Sidebar } from '@/components/layout';
import {
    Hero,
    Story,
    Influencers,
    FeaturedKits,
    StoreCTA,
    Footer,
} from '@/components/landing';

export default function LandingPage() {
    return (
        <>
            <Sidebar />
            <main>
                <Hero />
                <Story />
                <FeaturedKits />
                <Influencers />
                <StoreCTA />
                <Footer />
            </main>
        </>
    );
}
