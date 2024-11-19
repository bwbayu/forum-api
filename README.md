# Fitur : 
- ~~Registrasi Pengguna;~~
- ~~Login dan Logout;~~
- ~~Menambahkan Thread;~~
- ~~Melihat Thread;~~
- ~~Menambahkan dan Menghapus Komentar pada Thread;~~ serta
- ~~Menambahkan dan Menghapus Balasan Komentar Thread (opsional).~~

# Set Up Database
- create db -> CREATE DATABASE forumapi; CREATE DATABASE forumapi_test;
- grant user -> GRANT ALL PRIVILEGES ON DATABASE forumapi, forumapi_test TO developer;
- grant user 2 -> ALTER DATABASE forumapi OWNER TO developer; ALTER DATABASE forumapi_test OWNER TO developer;
- create migrate file -> npm run migrate create "create table users"
- run migrate file -> npm run migrate up; npm run migrate:test up;

# ESlint config
- npx eslint --init
- config
How would you like to use ESLint? -> To check syntax and find problems.
What type of modules does your project use? -> CommonJS (require/exports).
Which framework does your framework use? -> None of these. 
Does your project use TypeScript? -> No.
Where does your code run? -> Node (pilih menggunakan spasi).
Would you like to …… (seluruh pertanyaan selanjutnya) -> Y.
- add "lint": "eslint ./" to script package.json
- check eslint : npm run lint
- auto fix : npx eslint . --fix