import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

serve(async (req) => {
  const body = await req.json();

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { event_type, payload } = body;

  try {
    if (event_type === 'application_created') {
      const { job_id, candidate_id } = payload;

      const { data: job } = await supabase
        .from('jobs')
        .select('title, recruiter_id')
        .eq('id', job_id)
        .single();

      if (job?.recruiter_id) {
        await supabase.from('notifications').insert({
          user_id: job.recruiter_id,
          title: 'Nouvelle candidature',
          message: `Un candidat a postulé à votre offre "${job.title}".`,
          type: 'info',
        });
      }
    }

    if (event_type === 'job_created') {
      const { job_id } = payload;

      const { data: job } = await supabase
        .from('jobs')
        .select('title')
        .eq('id', job_id)
        .single();

      const { data: admins } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('role', 'admin');

      if (admins && job) {
        const notifications = admins.map((admin) => ({
          user_id: admin.user_id,
          title: 'Nouvelle offre publiée',
          message: `Une nouvelle offre "${job.title}" a été publiée.`,
          type: 'info',
        }));

        await supabase.from('notifications').insert(notifications);
      }
    }

    return new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
  } catch (e) {
    console.error('Error:', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});
