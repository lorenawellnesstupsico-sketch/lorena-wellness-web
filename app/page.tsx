import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Servicios } from "@/components/landing/servicios";
import { Acompanamiento } from "@/components/landing/acompanamiento";
import { Testimonios } from "@/components/landing/testimonios";
import { Contacto } from "@/components/landing/contacto";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
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