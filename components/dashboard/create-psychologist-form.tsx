"use client";

import {
  useActionState,
  useEffect,
  useState,
} from "react";
import { useFormStatus } from "react-dom";

import {
  createPsychologistAction,
  type CreatePsychologistActionState,
} from "@/app/dashboard/psicologos/actions";

const INITIAL_STATE: CreatePsychologistActionState = {
  status: "idle",
  message: "",
};

function generateSecurePassword(length = 16) {
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lowercase = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#$%*_-";

  const requiredCharacterSets = [
    uppercase,
    lowercase,
    numbers,
    symbols,
  ];

  const allCharacters =
    uppercase + lowercase + numbers + symbols;

  const randomValues = new Uint32Array(length);

  globalThis.crypto.getRandomValues(randomValues);

  const passwordCharacters = requiredCharacterSets.map(
    (characterSet, index) =>
      characterSet[
        randomValues[index] % characterSet.length
      ],
  );

  for (
    let index = requiredCharacterSets.length;
    index < length;
    index += 1
  ) {
    passwordCharacters.push(
      allCharacters[
        randomValues[index] % allCharacters.length
      ],
    );
  }

  for (
    let index = passwordCharacters.length - 1;
    index > 0;
    index -= 1
  ) {
    const randomIndex =
      randomValues[index] % (index + 1);

    [
      passwordCharacters[index],
      passwordCharacters[randomIndex],
    ] = [
      passwordCharacters[randomIndex],
      passwordCharacters[index],
    ];
  }

  return passwordCharacters.join("");
}

function SubmitButton({
  disabled,
}: {
  disabled: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#76516E] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#66445F] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending
        ? "Creando psicólogo..."
        : "Crear psicólogo"}
    </button>
  );
}

export function CreatePsychologistForm() {
  const [state, formAction] = useActionState(
    createPsychologistAction,
    INITIAL_STATE,
  );

  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPassword(generateSecurePassword());
  }, []);

  function createNewPassword() {
    setPassword(generateSecurePassword());
    setCopied(false);
  }

  async function copyCredentials() {
    if (!state.credentials) {
      return;
    }

    const credentialsText = [
      "Credenciales profesionales TuPsico",
      `Nombre: ${state.credentials.fullName}`,
      `Correo: ${state.credentials.email}`,
      `Contraseña: ${state.credentials.password}`,
      "Ingreso: https://lorena-wellness-web.vercel.app/login",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(
        credentialsText,
      );

      setCopied(true);
    } catch (error) {
      console.error(
        "No fue posible copiar las credenciales:",
        error,
      );

      setCopied(false);
    }
  }

  return (
    <div className="space-y-6">
      {state.status === "success" &&
      state.credentials ? (
        <section className="rounded-[2rem] border border-[#CDB7C8] bg-[#F4EAF2] p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#76516E]">
            Psicólogo creado correctamente
          </p>

          <h2 className="mt-4 text-2xl font-semibold text-[#4E3427]">
            Copia las credenciales ahora
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-[#6E5648]">
            La contraseña se muestra únicamente después de
            crear la cuenta. No quedará almacenada como texto
            visible dentro de la base de datos.
          </p>

          <div className="mt-6 grid gap-4 rounded-2xl border border-[#DCC9D7] bg-white p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8C5A3C]">
                Nombre
              </p>

              <p className="mt-1 font-semibold">
                {state.credentials.fullName}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8C5A3C]">
                Correo
              </p>

              <p className="mt-1 break-all font-semibold">
                {state.credentials.email}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8C5A3C]">
                Contraseña
              </p>

              <p className="mt-1 break-all font-mono text-lg font-bold">
                {state.credentials.password}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={copyCredentials}
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#76516E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#66445F]"
          >
            {copied
              ? "Credenciales copiadas"
              : "Copiar credenciales"}
          </button>
        </section>
      ) : null}

      {state.status === "error" ? (
        <div
          role="alert"
          className="rounded-2xl border border-[#E8C4C4] bg-[#FFF1F1] p-5 text-sm leading-7 text-[#8A3737]"
        >
          {state.message}
        </div>
      ) : null}

      <form
        action={formAction}
        className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-6 shadow-sm md:p-8"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8C5A3C]">
            Nuevo profesional
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-[#4E3427]">
            Crear psicólogo
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-[#6E5648]">
            Registra la cuenta de acceso y la información
            profesional del nuevo integrante de TuPsico.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#4E3427]">
              Nombre completo
            </span>

            <input
              type="text"
              name="full_name"
              required
              minLength={3}
              maxLength={120}
              autoComplete="name"
              placeholder="Nombre y apellidos"
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#4E3427]">
              Correo electrónico
            </span>

            <input
              type="email"
              name="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder="psicologo@correo.com"
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#4E3427]">
              Teléfono
            </span>

            <input
              type="tel"
              name="phone"
              maxLength={30}
              autoComplete="tel"
              placeholder="+57 300 000 0000"
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#4E3427]">
              Fecha de incorporación
            </span>

            <input
              type="date"
              name="joined_at"
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
            />

            <span className="text-xs leading-5 text-[#80695B]">
              Fecha en la que comienza a trabajar con
              TuPsico.
            </span>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#4E3427]">
              Título profesional
            </span>

            <input
              type="text"
              name="professional_title"
              required
              minLength={3}
              maxLength={120}
              defaultValue="Psicólogo"
              placeholder="Psicólogo clínico"
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#4E3427]">
              Especialidad
            </span>

            <input
              type="text"
              name="specialty"
              maxLength={180}
              placeholder="Ej. Terapia cognitivo-conductual"
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#4E3427]">
              Tarjeta profesional
            </span>

            <input
              type="text"
              name="professional_license_number"
              minLength={3}
              maxLength={80}
              placeholder="Número de tarjeta profesional"
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
            />

            <span className="text-xs leading-5 text-[#80695B]">
              Este dato puede dejarse vacío mientras se
              verifica la documentación.
            </span>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#4E3427]">
              País de la tarjeta profesional
            </span>

            <input
              type="text"
              name="professional_license_country"
              required
              minLength={2}
              maxLength={80}
              defaultValue="Colombia"
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#4E3427]">
              Ciudad
            </span>

            <input
              type="text"
              name="city"
              maxLength={120}
              placeholder="Ciudad de residencia o atención"
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#4E3427]">
              País
            </span>

            <input
              type="text"
              name="country"
              required
              minLength={2}
              maxLength={80}
              defaultValue="Colombia"
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#4E3427]">
              Disponibilidad para pacientes
            </span>

            <select
              name="is_accepting_patients"
              defaultValue="true"
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
            >
              <option value="true">
                Aceptando nuevos pacientes
              </option>

              <option value="false">
                Sin disponibilidad
              </option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#4E3427]">
              Estado de acceso
            </span>

            <select
              name="is_active"
              defaultValue="true"
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
            >
              <option value="true">
                Cuenta activa
              </option>

              <option value="false">
                Cuenta inactiva
              </option>
            </select>
          </label>
        </div>

        <label className="mt-6 grid gap-2">
          <span className="text-sm font-semibold text-[#4E3427]">
            Presentación profesional
          </span>

          <textarea
            name="short_bio"
            maxLength={1500}
            rows={5}
            placeholder="Experiencia, enfoque terapéutico y forma de acompañamiento."
            className="resize-y rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 leading-7 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
          />

          <span className="text-xs leading-5 text-[#80695B]">
            Máximo 1.500 caracteres.
          </span>
        </label>

        <div className="mt-6 rounded-2xl border border-[#DCC9D7] bg-[#F8F0F6] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <label className="grid flex-1 gap-2">
              <span className="text-sm font-semibold text-[#4E3427]">
                Contraseña inicial
              </span>

              <input
                type="text"
                name="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                minLength={10}
                maxLength={72}
                autoComplete="new-password"
                placeholder="Generando contraseña..."
                className="min-h-12 rounded-2xl border border-[#D5C2D0] bg-white px-4 py-3 font-mono outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
              />
            </label>

            <button
              type="button"
              onClick={createNewPassword}
              disabled={!password}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#76516E] bg-white px-6 py-3 text-sm font-semibold text-[#76516E] transition hover:bg-[#F1E5EE] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Generar otra
            </button>
          </div>

          <p className="mt-3 text-xs leading-6 text-[#6E5648]">
            Puedes usar la contraseña generada o escribir una
            propia. Debe incluir mayúscula, minúscula, número
            y símbolo.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-[#E7D8C8] pt-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-sm leading-7 text-[#6E5648]">
            El correo se confirmará automáticamente. Las
            credenciales se mostrarán una sola vez después de
            crear la cuenta.
          </p>

          <SubmitButton
            disabled={password.length === 0}
          />
        </div>
      </form>
    </div>
  );
}