TASK : 
- Registrasi Pengguna;
- Login dan Logout;
- Menambahkan Thread;
- Melihat Thread;
- Menambahkan dan Menghapus Komentar pada Thread; serta
- Menambahkan dan Menghapus Balasan Komentar Thread (opsional).

# Set Up Database
- create db -> CREATE DATABASE forumapi; CREATE DATABASE forumapi_test;
- grant user -> GRANT ALL PRIVILEGES ON DATABASE forumapi, forumapi_test TO developer;
- grant user 2 -> ALTER DATABASE forumapi OWNER TO developer; ALTER DATABASE forumapi_test OWNER TO developer;
- create migrate file -> npm run migrate create "create table users"
- run migrate file -> npm run migrate up; npm run migrate:test up;

# 