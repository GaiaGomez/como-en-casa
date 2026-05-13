import { createServerSupabase } from "@/lib/supabase/server";

export default async function TestSupabasePage() {
  const supabase = await createServerSupabase();

  if (!supabase) {
    return (
      <main style={{ padding: "24px", color: "white" }}>
        <h1>Test Supabase</h1>
        <p style={{ color: "orange" }}>Supabase not configured (missing env vars).</p>
      </main>
    );
  }

  const { data, error } = await supabase.from("employees").select("*");

  return (
    <main style={{ padding: "24px", color: "white" }}>
      <h1>Test Supabase</h1>

      {error ? (
        <pre style={{ color: "red", whiteSpace: "pre-wrap" }}>
          {JSON.stringify(error, null, 2)}
        </pre>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  );
}
