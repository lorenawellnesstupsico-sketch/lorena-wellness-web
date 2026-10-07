"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  createPatientSessionAction,
  type CreatePatientSessionActionState,
} from "@/app/dashboard/mis-pacientes/[patientId]/actions";

type CreatePatientSessionFormProps = {
  patientId: string;
};

const INITIAL_STATE: CreatePatientSessionActionState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#76516E] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#66445F] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending
        ? "Programando..."
        : "Programar sesión"}
    </button>
  );
}

export function CreatePatientSessionForm({
  patientId,
}: CreatePatientSessionFormProps) {
  const [state, formAction] =
    useActionState(
      createPatientSessionAction,
      INITIAL_STATE,
    );

  return (
    <form
      action={formAction}
      className="mt-6"
    >
      <input
        type="hidden"
        name="patient_id"
        value={patientId}
      />

      {state.status === "success" ? (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-[#C5DDCB] bg-[#EEF8F1] p-5 text-sm font-medium leading-7 text-[#42664C]"
        >
          {state.message}
        </div>
      ) : null}

      {state.status === "error" ? (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-[#E8C4C4] bg-[#FFF1F1] p-5 text-sm font-medium leading-7 text-[#8A3737]"
        >
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-semibold text-[#4E3427]">
            Título de la sesión
          </span>

          <input
            type="text"
            name="title"
            required
            minLength={3}
            maxLength={200}
            defaultValue="Sesión privada"
            className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#4E3427]">
            Fecha
          </span>

          <input
            type="date"
            name="session_date"
            required
            className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#4E3427]">
            Hora Colombia
          </span>

          <input
            type="time"
            name="session_time"
            required
            className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
          />

          <span className="text-xs leading-5 text-[#80695B]">
            Zona horaria inicial: Colombia (UTC-5).
          </span>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#4E3427]">
            Duración
          </span>

          <select
            name="duration_minutes"
            defaultValue="60"
            className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
          >
            <option value="30">
              30 minutos
            </option>

            <option value="45">
              45 minutos
            </option>

            <option value="60">
              60 minutos
            </option>

            <option value="75">
              75 minutos
            </option>

            <option value="90">
              90 minutos
            </option>

            <option value="120">
              120 minutos
            </option>
          </select>
        </label>

        <div className="rounded-2xl border border-[#DCC9D7] bg-[#F4EAF2] p-5">
          <p className="text-sm font-semibold text-[#4E3427]">
            Google Meet
          </p>

          <p className="mt-2 text-sm leading-7 text-[#6E5648]">
            El enlace se incorporará automáticamente
            cuando conectemos Google Calendar y
            Google Meet.
          </p>

          <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#76516E]">
            Integración pendiente
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#4E3427]">
            Notas internas
          </span>

          <textarea
            name="notes_internal"
            maxLength={10000}
            rows={6}
            placeholder="Información de trabajo exclusiva para el profesional."
            className="resize-y rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 leading-7 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
          />

          <span className="text-xs leading-6 text-[#80695B]">
            🔐 Este contenido no debe mostrarse al
            paciente.
          </span>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#4E3427]">
            Mensaje visible para el paciente
          </span>

          <textarea
            name="notes_visible_to_patient"
            maxLength={5000}
            rows={6}
            placeholder="Ej. Para nuestra próxima sesión recuerda tener a mano el registro emocional trabajado durante la semana."
            className="resize-y rounded-2xl border border-[#D5C2D0] bg-[#FDF9FC] px-4 py-3 leading-7 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
          />

          <span className="text-xs leading-6 text-[#76516E]">
            👤 Este mensaje sí podrá mostrarse en la
            cuenta del paciente.
          </span>
        </label>
      </div>

      <div className="mt-7 flex flex-col gap-4 border-t border-[#E7D8C8] pt-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-[#4E3427]">
            Programación de sesión
          </p>

          <p className="mt-2 text-sm leading-7 text-[#6E5648]">
            La sesión quedará inicialmente con
            estado Programada. El enlace de Meet se
            añadirá en la etapa de integración con
            Google.
          </p>
        </div>

        <SubmitButton />
      </div>
    </form>
  );
}