"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type OtpType = "signup" | "magiclink" | "recovery" | "email_change" | "email";

function normalizeOtpType(raw: string | null): OtpType {
  switch (raw) {
    case "invite": // Supabase invites behave like signup
    case null:
    case undefined:
      return "signup";
    case "signup":
    case "magiclink":
    case "recovery":
    case "email_change":
    case "email":
      return raw;
    default:
      return "signup";
  }
}

export default function AcceptInvitePage() {
  const supabase = createClient();
  const router = useRouter();
  const search = useSearchParams();

  const [phase, setPhase] = useState<
    "verifying" | "needs_password" | "updating"
  >("verifying");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // Prefer PKCE code
        const code = search.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          setPhase("needs_password");
          return;
        }

        // token_hash fallback (hash or query)
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const token_hash = search.get("token_hash") || hash.get("token_hash");
        if (token_hash) {
          const type = normalizeOtpType(search.get("type") || hash.get("type"));
          const { error } = await supabase.auth.verifyOtp({ type, token_hash });
          if (error) throw error;
          setPhase("needs_password");
          return;
        }

        // Legacy hash tokens (rare now)
        const access_token = hash.get("access_token");
        const refresh_token = hash.get("refresh_token");
        const expires_in = Number(hash.get("expires_in") ?? 0);
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
            expires_in,
            token_type: "bearer",
          } as any);
          if (error) throw error;
          setPhase("needs_password");
          return;
        }

        // If nothing to exchange, treat as failure
        throw new Error("Invalid or missing invite token");
      } catch (e: any) {
        // Send them to a dedicated error page with a hint
        const reason = encodeURIComponent(
          e?.message ?? "Error confirming user"
        );
        router.replace(`/auth/error?reason=${reason}`);
      }

      // // 1) PKCE code flow
      // const code = search.get("code");
      // if (code) {
      //   const { error } = await supabase.auth.exchangeCodeForSession(code);
      //   if (!error) return router.replace("/backoffice");
      //   // fall through to hash/token flow if needed
      // }

      // // 2) Hash or token_hash flow
      // const hash = new URLSearchParams(window.location.hash.slice(1));
      // const token_hash = search.get("token_hash") || hash.get("token_hash");

      // if (token_hash) {
      //   const type = normalizeOtpType(search.get("type") || hash.get("type"));
      //   const { error } = await supabase.auth.verifyOtp({ type, token_hash });
      //   if (!error) return router.replace("/backoffice");
      // }

      // // 3) Legacy access/refresh tokens in hash (rare)
      // const access_token = hash.get("access_token");
      // const refresh_token = hash.get("refresh_token");
      // const expires_in = Number(hash.get("expires_in") ?? 0);
      // if (access_token && refresh_token) {
      //   const { error } = await supabase.auth.setSession({
      //     access_token,
      //     refresh_token,
      //     expires_in,
      //     token_type: "bearer",
      //   } as any);
      //   if (!error) return router.replace("/backoffice");
      // }

      // // If nothing matched, just go somewhere sane
      // router.replace("/backoffice");
    })();
  }, [router, search, supabase]);

  // 2) Submit password to finalize the account
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // client-side validation
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      setPhase("updating");
      setErrorMsg(null);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      // Success → to backoffice
      router.replace("/backoffice");
    } catch (e: any) {
      setPhase("needs_password");
      setErrorMsg(e?.message ?? "Could not set password. Please try again.");
    }
  };

  if (phase === "verifying") {
    return (
      <div className="grid place-items-center min-h-svh">
        <p className="text-muted-foreground">Verifying your invite…</p>
      </div>
    );
  }

  return (
    <div className="grid place-items-center min-h-svh p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set your password</CardTitle>
          <CardDescription>
            Your email has been verified. Choose a password to finish setting up
            your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {errorMsg ? (
              <>
                <Separator />
                <p className="text-sm text-destructive">{errorMsg}</p>
              </>
            ) : null}

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                disabled={phase === "updating"}
              >
                {phase === "updating" ? "Saving…" : "Save password & continue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
