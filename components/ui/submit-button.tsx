"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  idleText: string;
  loadingText: string;
  className?: string;
};

export function SubmitButton({
  idleText,
  loadingText,
  className = "",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
    >
      {pending ? loadingText : idleText}
    </button>
  );
}