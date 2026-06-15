"use client";

import { useFormStatus } from "react-dom";

type DeleteSessionButtonProps = {
  label?: string;
};

export function DeleteSessionButton({
  label = "Eliminar sesión",
}: DeleteSessionButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (pending) return;

        const confirmed = window.confirm(
          "¿Estás segura de que deseas eliminar esta sesión? Esta acción no se puede deshacer."
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
      className="rounded-full bg-[#B85C38] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#9F4C2D] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Eliminando..." : label}
    </button>
  );
}