-- Create buckets if they don't exist
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('tracks', 'tracks', true)
on conflict (id) do nothing;

-- Policy for 'covers' bucket
-- Allow public read access
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'covers' );

-- Allow authenticated users to upload
create policy "Authenticated users can upload"
  on storage.objects for insert
  with check ( bucket_id = 'covers' and auth.role() = 'authenticated' );

-- Allow authenticated users to update
create policy "Authenticated users can update"
  on storage.objects for update
  with check ( bucket_id = 'covers' and auth.role() = 'authenticated' );

-- Allow authenticated users to delete
create policy "Authenticated users can delete"
  on storage.objects for delete
  using ( bucket_id = 'covers' and auth.role() = 'authenticated' );


-- Policy for 'tracks' bucket
-- Allow public read access
create policy "Public Access Tracks"
  on storage.objects for select
  using ( bucket_id = 'tracks' );

-- Allow authenticated users to upload
create policy "Authenticated users can upload tracks"
  on storage.objects for insert
  with check ( bucket_id = 'tracks' and auth.role() = 'authenticated' );

-- Allow authenticated users to update
create policy "Authenticated users can update tracks"
  on storage.objects for update
  with check ( bucket_id = 'tracks' and auth.role() = 'authenticated' );

-- Allow authenticated users to delete
create policy "Authenticated users can delete tracks"
  on storage.objects for delete
  using ( bucket_id = 'tracks' and auth.role() = 'authenticated' );
