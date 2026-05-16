import Hero from "@/components/Home/Hero";
import WhyKite from "@/components/Home/WhyKite";
import FoundationalIntelligence from "@/components/Home/FoundationalIntelligence";
import Industries from "@/components/Home/Industries";
import ContactForm from "@/components/Home/ContactForm";
import LevaPanel from "@/components/Layout/LevaPanel";

export default function Home() {
  return (
    <div>
      <LevaPanel />
      <Hero />
      <FoundationalIntelligence />
      <WhyKite />
      <Industries />
      <ContactForm />
    </div>
  );
}
