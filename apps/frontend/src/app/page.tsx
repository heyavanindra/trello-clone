import Footer from "@/components/dashboard/footer";
import CTASection from "@/section/dashboard/cta-section";
import Features from "@/section/dashboard/features";
import HeroSection from "@/section/dashboard/hero";
import ValueSection from "@/section/dashboard/value";


export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-neutral-200">
      <HeroSection />
      <Features />
      <ValueSection />
      <CTASection />
      <Footer />
    </div>
  );
}
