"use client";

import { Button as BaseButton } from "@/components/ui/button";
import { forwardRef } from "react";

const Button = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseButton>
>((props, ref) => {
  return <BaseButton ref={ref} suppressHydrationWarning {...props} />;
});

Button.displayName = "Button";

export { Button };
