import { Acompanamiento } from "@/components/landing/acompanamiento";
import { Contacto } from "@/components/landing/contacto";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import { Servicios } from "@/components/landing/servicios";
import { Testimonios } from "@/components/landing/testimonios";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#4E3427]">
      <Navbar />
      <Hero />
      <Servicios />
      <Acompanamiento />
      <Testimonios />
      <Contacto />
      <Footer />
    </main>
  );
}