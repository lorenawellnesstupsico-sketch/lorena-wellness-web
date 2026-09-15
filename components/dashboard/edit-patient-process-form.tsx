"use client";

import {
  useActionState,
} from "react";
import { useFormStatus } from "react-dom";

import {
  savePatientProcessAction,
  type SavePatientProcessActionState,
} from "@/app/dashboard/mis-pacientes/[patientId]/actions";

type EditPatientProcessFormProps = {
  patientId: string;

  initialValues: {
    enfoqueActual: string | null;
    objetivoPrincipal: string | null;
    trabajoActual: string | null;
    siguientePaso: string | null;
    recordatorioTerapeutico:
      string | null;
  };
};

const INITIAL_STATE: SavePatientProcessActionState = {
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
        ? "Guardando..."
        : "Guardar proceso"}
    </button>
  );
}

export function EditPatientProcessForm({
  patientId,
  initialValues,
}: EditPatientProcessFormProps) {
  const [state, formAction] =
    useActionState(
      savePatientProcessAction,
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
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#4E3427]">
            Enfoque actual
          </span>

          <textarea
            name="enfoque_actual"
            defaultValue={
              initialValues.enfoqueActual ??
              ""
            }
            maxLength={3000}
            rows={5}
            placeholder="Describe el foco terapéutico actual del proceso."
            className="resize-y rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 leading-7 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
          />

          <span className="text-xs leading-5 text-[#80695B]">
            Máximo 3.000 caracteres.
          </span>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#4E3427]">
            Objetivo principal
          </span>

          <textarea
            name="objetivo_principal"
            defaultValue={
              initialValues.objetivoPrincipal ??
              ""
            }
            maxLength={3000}
            rows={5}
            placeholder="Define el objetivo terapéutico principal."
            className="resize-y rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 leading-7 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
          />

          <span className="text-xs leading-5 text-[#80695B]">
            Máximo 3.000 caracteres.
          </span>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#4E3427]">
            Trabajo actual
          </span>

          <textarea
            name="trabajo_actual"
            defaultValue={
              initialValues.trabajoActual ??
              ""
            }
            maxLength={5000}
            rows={6}
            placeholder="Registra las áreas, habilidades o temas que se están trabajando."
            className="resize-y rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 leading-7 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
          />

          <span className="text-xs leading-5 text-[#80695B]">
            Máximo 5.000 caracteres.
          </span>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#4E3427]">
            Siguiente paso
          </span>

          <textarea
            name="siguiente_paso"
            defaultValue={
              initialValues.siguientePaso ??
              ""
            }
            maxLength={3000}
            rows={6}
            placeholder="Define el siguiente paso del acompañamiento."
            className="resize-y rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 leading-7 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
          />

          <span className="text-xs leading-5 text-[#80695B]">
            Máximo 3.000 caracteres.
          </span>
        </label>
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-[#DCC9D7] bg-[#F4EAF2] p-5 md:p-6">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#4E3427]">
            Recordatorio terapéutico visible
            para el paciente
          </span>

          <textarea
            name="recordatorio_terapeutico"
            defaultValue={
              initialValues.recordatorioTerapeutico ??
              ""
            }
            maxLength={3000}
            rows={5}
            placeholder="Escribe un mensaje, reflexión o recordatorio que el paciente pueda consultar desde su cuenta."
            className="resize-y rounded-2xl border border-[#D5C2D0] bg-white px-4 py-3 leading-7 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
          />

          <span className="text-xs leading-6 text-[#6E5648]">
            Este campo sí podrá aparecer en el
            espacio personal del paciente. No
            registres aquí información clínica
            privada que no deba ser visible para
            esa persona.
          </span>
        </label>
      </div>

      <div className="mt-7 flex flex-col gap-4 border-t border-[#E7D8C8] pt-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-[#4E3427]">
            Seguimiento terapéutico
          </p>

          <p className="mt-2 text-sm leading-7 text-[#6E5648]">
            Los cambios quedarán vinculados a
            este paciente. Las notas clínicas
            privadas se gestionarán en un módulo
            independiente.
          </p>
        </div>

        <SubmitButton />
      </div>
    </form>
  );
}