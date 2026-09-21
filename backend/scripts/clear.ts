import { db } from '../src/db/db';


console.log('clearing out whole db! 🟡', '...')

db.execute(`DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE';
    END LOOP;
END $$;
`).finally(()=> console.log('db cleared! ✅'))