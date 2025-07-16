"use client";

import { Input as BaseInput } from "@/components/ui/input";
import { forwardRef } from "react";

const Input = forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof BaseInput>
>((props, ref) => {
  return <BaseInput ref={ref} suppressHydrationWarning {...props} />;
});

Input.displayName = "Input";

export { Input };
