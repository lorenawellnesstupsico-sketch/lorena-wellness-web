"use client";

import {
  useActionState,
  useEffect,
  useState,
} from "react";
import { useFormStatus } from "react-dom";

import {
  createPatientAction,
  type CreatePatientActionState,
} from "@/app/dashboard/pacientes/actions";

type PsychologistOption = {
  id: string;
  full_name: string;
  email: string | null;
};

type PlanOption = {
  id: string;
  name: string;
  session_count: number;
  session_duration_minutes: number;
  price: number;
  currency: string;
};

type CreatePatientFormProps = {
  psychologists: PsychologistOption[];
  plans: PlanOption[];
};

const INITIAL_STATE: CreatePatientActionState = {
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
        ? "Creando paciente..."
        : "Crear paciente"}
    </button>
  );
}

export function CreatePatientForm({
  psychologists,
  plans,
}: CreatePatientFormProps) {
  const [state, formAction] = useActionState(
    createPatientAction,
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
      "Credenciales de acceso TuPsico",
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
            Paciente creado correctamente
          </p>

          <h2 className="mt-4 text-2xl font-semibold text-[#4E3427]">
            Copia las credenciales ahora
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-[#6E5648]">
            La contraseña se muestra únicamente como
            resultado de esta creación. No quedará
            almacenada en texto visible dentro de la base de
            datos.
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
            Nueva cuenta
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-[#4E3427]">
            Crear paciente
          </h2>

          <p className="mt-3 leading-7 text-[#6E5648]">
            Completa los datos personales, selecciona el
            plan y asigna las credenciales iniciales.
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
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
              placeholder="Nombre y apellidos"
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
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
              placeholder="paciente@correo.com"
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
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
              placeholder="+57 300 000 0000"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#4E3427]">
              Fecha de nacimiento
            </span>

            <input
              type="date"
              name="birth_date"
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
            />

            <span className="text-xs leading-5 text-[#80695B]">
              Corresponde a la fecha de nacimiento del
              paciente.
            </span>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#4E3427]">
              Fecha de inicio del proceso
            </span>

            <input
              type="date"
              name="start_date"
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
            />

            <span className="text-xs leading-5 text-[#80695B]">
              Indica cuándo comienza el acompañamiento
              terapéutico en TuPsico.
            </span>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#4E3427]">
              Plan
            </span>

            <select
              name="current_plan_id"
              required
              defaultValue=""
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
            >
              <option value="" disabled>
                Selecciona un plan
              </option>

              {plans.map((plan) => (
                <option
                  key={plan.id}
                  value={plan.id}
                >
                  {plan.name} · {plan.session_count}{" "}
                  sesión
                  {plan.session_count === 1 ? "" : "es"}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#4E3427]">
              Psicólogo asignado
            </span>

            <select
              name="assigned_psychologist_id"
              defaultValue=""
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
            >
              <option value="">
                Asignar más adelante
              </option>

              {psychologists.map((psychologist) => (
                <option
                  key={psychologist.id}
                  value={psychologist.id}
                >
                  {psychologist.full_name}
                  {psychologist.email
                    ? ` · ${psychologist.email}`
                    : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#4E3427]">
              Estado de pago
            </span>

            <select
              name="payment_status"
              defaultValue="pending"
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
            >
              <option value="pending">
                Pendiente
              </option>

              <option value="partial">
                Pago parcial
              </option>

              <option value="paid">
                Pagado
              </option>

              <option value="overdue">
                Vencido
              </option>

              <option value="canceled">
                Cancelado
              </option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#4E3427]">
              Estado de acceso
            </span>

            <select
              name="access_status"
              defaultValue="active"
              className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
            >
              <option value="active">
                Activo
              </option>

              <option value="invited">
                Invitado
              </option>

              <option value="inactive">
                Inactivo
              </option>

              <option value="suspended">
                Suspendido
              </option>
            </select>
          </label>
        </div>

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
                className="min-h-12 rounded-2xl border border-[#D5C2D0] bg-white px-4 py-3 font-mono outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
                placeholder="Generando contraseña..."
              />
            </label>

            <button
              type="button"
              onClick={createNewPassword}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#76516E] bg-white px-6 py-3 text-sm font-semibold text-[#76516E] transition hover:bg-[#F1E5EE]"
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

        {plans.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-[#E7CDAA] bg-[#FFF7EA] p-5 text-sm leading-7 text-[#815827]">
            No hay planes activos disponibles. Debes activar
            al menos un plan antes de crear pacientes.
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-4 border-t border-[#E7D8C8] pt-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-sm leading-7 text-[#6E5648]">
            Al crear la cuenta, el correo quedará confirmado
            y la contraseña solo se mostrará como resultado
            de esta operación.
          </p>

          <SubmitButton
            disabled={
              plans.length === 0 || password.length === 0
            }
          />
        </div>
      </form>
    </div>
  );
}