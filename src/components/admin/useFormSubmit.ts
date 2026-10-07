import { startTransition, type FormEvent } from "react";

// Envía el formulario sin el reseteo automático de React 19, para que un error de
// validación no borre lo que la persona ya cargó.
export function submitWithoutReset(dispatch: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  };
}
