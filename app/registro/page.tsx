"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegistroPage() {
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSuccessMsg(
      "Tu cuenta fue creada. Revisa tu correo si Supabase solicita confirmación antes de iniciar sesión."
    );
    setFullName("");
    setEmail("");
    setPassword("");
  }

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#4E3427]">
      <section className="border-b border-[#DED2C5] bg-[#FAF6F1]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
          <a
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8C5A3C]"
          >
            Lorena Wellness TuPsico
          </a>

          <nav className="hidden gap-8 text-sm text-[#6E5648] md:flex">
            <a href="/" className="transition hover:text-[#C97B57]">
              Inicio
            </a>
            <a href="/servicios" className="transition hover:text-[#C97B57]">
              Servicios
            </a>
            <a href="/sobre-mi" className="transition hover:text-[#C97B57]">
              Sobre mí
            </a>
            <a href="/contacto" className="transition hover:text-[#C97B57]">
              Contacto
            </a>
          </nav>
        </div>
      </section>

      <section className="mx-auto flex min-h-[calc(100vh-81px)] max-w-6xl items-center justify-center px-6 py-16 md:px-10">
        <div className="grid w-full max-w-5xl gap-10 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
              Registro
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              Crea tu cuenta y empieza tu proceso
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#6E5648]">
              Regístrate para acceder a tu espacio personal, seguimiento,
              recursos y herramientas dentro de Lorena Wellness TuPsico.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm md:p-10">
            <p className="text-2xl font-semibold">Crear cuenta</p>
            <p className="mt-2 text-[#6E5648]">
              Completa tus datos para registrarte.
            </p>

            <form onSubmit={handleRegister} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Nombre completo
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
                  required
                />
              </div>

              {errorMsg ? (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMsg}
                </p>
              ) : null}

              {successMsg ? (
                <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
                  {successMsg}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#C97B57] px-8 py-3.5 text-white transition hover:bg-[#B96E4C] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </form>

            <p className="mt-6 text-sm text-[#6E5648]">
              ¿Ya tienes cuenta?{" "}
              <a
                href="/login"
                className="font-medium text-[#8C5A3C] transition hover:text-[#C97B57]"
              >
                Iniciar sesión
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}