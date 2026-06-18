-- Create databases if they don't exist
SELECT 'CREATE DATABASE talk2job_userdb' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'talk2job_userdb')\gexec
SELECT 'CREATE DATABASE talk2job' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'talk2job')\gexec
