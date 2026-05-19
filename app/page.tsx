import Hero from "@/components/Home/Hero";
import WhyKite from "@/components/Home/WhyKite";
import FoundationalIntelligence from "@/components/Home/FoundationalIntelligence";
import Process from "@/components/Home/Process";
import Industries from "@/components/Home/Industries";
import ContactForm from "@/components/Home/ContactForm";
import LevaPanel from "@/components/Layout/LevaPanel";

export default function Home() {
  return (
    <div className=" overflow-x-hidden">
      <LevaPanel />
      <Hero />
      <Process />
      <FoundationalIntelligence />
      <WhyKite />
      <Industries />
      <ContactForm />
    </div>
  );
}
