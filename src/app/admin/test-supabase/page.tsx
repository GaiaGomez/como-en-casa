import { supabase } from '@/lib/supabase/client'

export default async function TestSupabasePage() {
  const { data, error } = await supabase.from('employees').select('*')

  return (
    <main style={{ padding: '24px', color: 'white' }}>
      <h1>Test Supabase</h1>

      {error ? (
        <pre style={{ color: 'red', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(error, null, 2)}
        </pre>
      ) : (
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  )
}