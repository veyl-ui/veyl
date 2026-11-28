"use client";

import { LoginPage } from "@/registry/veyl/login-page";

export function LoginPageDemo() {
  // Demo rule: any password with 8 or more characters signs in, anything shorter fails.
  return <LoginPage onSubmit={({ password }) => password.length >= 8} />;
}