import { expect, test, vi } from "vitest";

const signOutSpy = vi.fn().mockResolvedValue({ error: null });
const redirectSpy = vi.fn();

vi.mock("../../../lib/supabase/server", () => ({
  createClient: async () => ({ auth: { signOut: signOutSpy } }),
}));
vi.mock("next/navigation", () => ({ redirect: redirectSpy }));

test("signs out this session only, then goes to /sign-in", async () => {
  const { signOut } = await import("./actions");
  await signOut();
  expect(signOutSpy).toHaveBeenCalledWith({ scope: "local" });
  expect(redirectSpy).toHaveBeenCalledWith("/sign-in");
});
