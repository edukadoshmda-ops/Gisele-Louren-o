-- ============================================================================
-- SCHEMA OFICIAL SUPABASE (PLANO GRATUITO)
-- Clube Gisele Lourenço & DaviLiz Brinquedos
-- Cole e execute este script no SQL Editor do seu projeto Supabase.
-- ============================================================================

-- 1. Tabela principal de estado da plataforma (Planos, Cursos, Vídeos, Assinantes, Webhooks)
create table if not exists public.clube_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Segurança RLS: somente a Service Role (backend na Vercel/Netlify) acessa diretamente
alter table public.clube_state enable row level security;

-- 2. Bucket público de mídias (Áudios MP3, Vídeos MP4, Playbooks PDF e Capas)
insert into storage.buckets (id, name, public)
values ('clube-media', 'clube-media', true)
on conflict (id) do nothing;

-- Política para leitura pública dos arquivos no bucket clube-media
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Leitura publica clube-media'
  ) then
    create policy "Leitura publica clube-media"
      on storage.objects for select
      using ( bucket_id = 'clube-media' );
  end if;
end $$;
