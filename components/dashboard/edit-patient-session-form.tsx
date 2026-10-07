"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  updatePatientSessionAction,
  type UpdatePatientSessionActionState,
} from "@/app/dashboard/mis-pacientes/[patientId]/actions";

type EditPatientSessionFormProps = {
  sessionId: string;
  initialTitle: string;
  initialDate: string;
  initialTime: string;
  initialDurationMinutes: number;
  initialStatus: string;
  initialNotesInternal: string | null;
  initialNotesVisibleToPatient:
    string | null;
};

const INITIAL_STATE: UpdatePatientSessionActionState = {
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
        ? "Guardando cambios..."
        : "Guardar cambios"}
    </button>
  );
}

export function EditPatientSessionForm({
  sessionId,
  initialTitle,
  initialDate,
  initialTime,
  initialDurationMinutes,
  initialStatus,
  initialNotesInternal,
  initialNotesVisibleToPatient,
}: EditPatientSessionFormProps) {
  const [state, formAction] =
    useActionState(
      updatePatientSessionAction,
      INITIAL_STATE,
    );

  return (
    <form
      action={formAction}
      className="mt-5"
    >
      <input
        type="hidden"
        name="session_id"
        value={sessionId}
      />

      {state.status === "success" ? (
        <div
          role="status"
          className="mb-5 rounded-2xl border border-[#C5DDCB] bg-[#EEF8F1] p-4 text-sm font-medium leading-7 text-[#42664C]"
        >
          {state.message}
        </div>
      ) : null}

      {state.status === "error" ? (
        <div
          role="alert"
          className="mb-5 rounded-2xl border border-[#E8C4C4] bg-[#FFF1F1] p-4 text-sm font-medium leading-7 text-[#8A3737]"
        >
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-semibold text-[#4E3427]">
            Título
          </span>

          <input
            type="text"
            name="title"
            required
            minLength={3}
            maxLength={200}
            defaultValue={initialTitle}
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
            defaultValue={initialDate}
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
            defaultValue={initialTime}
            className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#4E3427]">
            Duración
          </span>

          <select
            name="duration_minutes"
            defaultValue={String(
              initialDurationMinutes,
            )}
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

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#4E3427]">
            Estado
          </span>

          <select
            name="status"
            defaultValue={initialStatus}
            className="min-h-12 rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
          >
            <option value="scheduled">
              Programada
            </option>

            <option value="confirmed">
              Confirmada
            </option>

            <option value="rescheduled">
              Reprogramada
            </option>

            <option value="completed">
              Realizada
            </option>

            <option value="canceled">
              Cancelada
            </option>

            <option value="no_show">
              No asistió
            </option>
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#4E3427]">
            Notas internas
          </span>

          <textarea
            name="notes_internal"
            maxLength={10000}
            rows={6}
            defaultValue={
              initialNotesInternal ?? ""
            }
            className="resize-y rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 leading-7 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
          />

          <span className="text-xs leading-6 text-[#80695B]">
            🔐 Información exclusiva del
            profesional.
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
            defaultValue={
              initialNotesVisibleToPatient ??
              ""
            }
            className="resize-y rounded-2xl border border-[#D5C2D0] bg-[#FDF9FC] px-4 py-3 leading-7 outline-none transition focus:border-[#76516E] focus:ring-2 focus:ring-[#E8D9E4]"
          />

          <span className="text-xs leading-6 text-[#76516E]">
            👤 Este contenido puede ser
            consultado por el paciente.
          </span>
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-[#E7D8C8] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-7 text-[#6E5648]">
          Los cambios de estado, fecha y hora se
          reflejarán también en el espacio del
          paciente.
        </p>

        <SubmitButton />
      </div>
    </form>
  );
}