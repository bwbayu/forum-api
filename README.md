# Fitur : 
- Registrasi Pengguna;
- Login dan Logout;
- Menambahkan Thread;
- Melihat Thread;
- Menambahkan dan Menghapus Komentar pada Thread;
- Menambahkan dan Menghapus Balasan Komentar Thread; serta
- Menerapkan unit testing dan integration testing. 

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

# **Alur Kerja Program dengan Clean Architecture**

Dokumen ini menjelaskan struktur dan alur kerja program berbasis **Clean Architecture**. Penjelasan ini bertujuan untuk memberikan panduan yang jelas mengenai peran setiap lapisan dalam aplikasi.

---

## **1. Controller (/Interfaces/http/api)**  
Lapisan **Controller** bertanggung jawab untuk menerima permintaan (request) dari pengguna dan menentukan bagaimana permintaan tersebut diproses. Komponen utama dalam lapisan ini adalah:  

- **`route.js`**  
  - Berfungsi untuk menangani URL dan menentukan fungsi handler yang sesuai dengan URL yang diterima.  
  - Bertindak sebagai penghubung awal antara aplikasi dan permintaan dari klien.  

- **`handler.js`**  
  - Menerima permintaan dari `route.js`.  
  - Berkomunikasi dengan lapisan **Use Case** untuk menyiapkan data (`payload`) yang diperlukan.  
  - Menjalankan logika dari **Use Case**, menerima hasilnya, dan mengembalikan data yang siap digunakan oleh Front-End (FE).  

---

## **2. Use Case (/Applications/use_case)**  
Lapisan **Use Case** bertanggung jawab untuk menjalankan logika bisnis utama aplikasi. Setiap fungsi atau operasi bisnis tertentu biasanya diimplementasikan dalam file terpisah.  

Contoh:  
- Operasi seperti menambahkan atau menghapus komentar dilakukan oleh file **AddCommentUseCase.js** dan **DeleteCommentUseCase.js**.  

**Peran utama:**  
1. **Komunikasi:**  
   - Menerima `payload` dari **Controller** untuk melanjutkan operasi.  
   - Berinteraksi dengan **Repository/Database** untuk mengambil atau memanipulasi data.  

2. **Validasi:**  
   - Melakukan validasi terhadap data yang diterima dari **Controller** sebelum diteruskan ke database.  
   - Validasi dapat dilakukan langsung di file Use Case atau melalui entitas di lapisan **Entity** untuk memastikan integritas logika bisnis.  

Contoh:  
Pada file **DeleteCommentUseCase.js**, validasi data dilakukan sebelum melanjutkan ke operasi utama.  

---

## **3. Repository/Database (/Infrastructures/repository)**  
Lapisan **Repository** adalah penghubung antara aplikasi dan database.  

**Peran utama:**  
- Menangani query ke database dan mengelola data yang diminta oleh **Use Case**.  
- Mengembalikan data dalam format yang sesuai untuk digunakan pada lapisan-lapisan berikutnya.

---

## **4. Entity (/Domains/comments/entities)**  
Lapisan **Entity** digunakan untuk mengelola data bisnis inti dari aplikasi. Selain itu, pada lapisan ini juga bertugas untuk memastikan data yang diterima atau diproses memenuhi kelengkapan dan konsistensi tipe. 

---
## **Beberapa File Penting**  
Berikut adalah deskripsi beberapa file penting dalam proyek ini:  

1. **`container.js`**  
   - Berfungsi untuk membuat **container** yang mengelola dependensi dalam aplikasi.  
   - Melakukan registrasi **repository/database** dan **use case** ke dalam container, sehingga masing-masing komponen dapat diakses dengan mudah.  

2. **`createServer.js`**  
   - Mendefinisikan konfigurasi server, termasuk otentikasi (**auth**) dan middleware.  
   - Melakukan registrasi **container** ke dalam server agar dependensi tersedia pada setiap lapisan.  
   - Menangani **error** yang diterima dari berbagai lapisan, memberikan respon yang konsisten kepada pengguna.  

3. **`DomainErrorTranslator.js`**  
   - Bertanggung jawab untuk menerjemahkan error yang diterima dari berbagai lapisan aplikasi ke dalam bentuk yang lebih dapat dipahami.  
   - Memastikan error yang dikirimkan ke pengguna memiliki pesan yang jelas dan relevan.  

4. **Repository di folder `entity`**  
   - Berisi file abstrak untuk repository yang berkaitan dengan database tertentu.  
   - Contoh: **`ThreadRepositoryPostgres.js`**, yaitu implementasi spesifik repository untuk entitas thread menggunakan PostgreSQL sebagai database.