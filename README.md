[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/w8H8oomW)
**<ins>Note</ins>: Students must update this `README.md` file to be an installation manual or a README file for their own CS403 projects.**

**รหัสโครงงาน:** 67-1_04_tnt-r2

**ชื่อโครงงาน (ไทย):** การพัฒนาโปรแกรมสร้างผลเฉลยข้อมูลสำหรับฝึกสอนโมเดลปัญญาประดิษฐ์ทางการแพทย์

**Project Title (Eng):** Development of a Data Labeling Program for Training Medical AI Models

**อาจารย์ที่ปรึกษาโครงงาน:** รศ.ดร.ธนาธร ทะนานทอง

**ผู้จัดทำโครงงาน:** 
1. นายกันตพล แท่นประทุม  6209610010  kantapol.tha@dome.tu.ac.th 
2. นางสาวกานชญา นิลพันธุ์  6209610135  kunchaya.nil@tu.ac.th
   
# โครงสร้างไฟล์ของระบบ

- Project/
  - public/
    - xxxxx.css
    - xxxxx.html
    - xxxxx.js
  - upload/
  - package.json
  - package-lock.json
  - server.js


# ขั้นตอนการโหลดไฟล์

# ชุดโปรแกรมที่จำเป็น

1. [node js](https://nodejs.org/en).
   
   ทำหน้าที่เป็น เซิร์ฟเวอร์ฝั่ง Backend สำหรับโปรแกรม Labeling โดยรับผิดชอบในการจัดการคำขอ (request) จากฝั่งผู้ใช้

2. [MySQL](https://dev.mysql.com/downloads/installer/).
   
   เป็นตัวจัดการฐานข้อมูลหลักของโปรแกรม

3. [Visual Studio Code](https://code.visualstudio.com/).
   
   โปรแกรมสำหรับการจัดการโค้ด
   
# การติดตั้ง

1. ผู้ใช้จำเป็นจะต้องติดตั้ง node.js, Mysql, และ Visual Studio Code
2. สร้าง folder สำหรับการใส่โปรเจค
   
   ```
   mkdir (Whatever you want to name your folder)
   cd (your folder's name)
   mkdir uploads
   mkdir public
   npm init -y
   ```
   
3. จากนั้นจึงทำการ install library ที่จำเป็น
   
   ```
   npm install mysql2
   npm install cors
   npm install bcryptjs jsonwebtoken
   npm install express multer cors
   npm install express multer mysql2 cors
   npm install archiver
   npm install sharp
   ```
4. ไฟล์ที่ดาวโหลดผู้ใช้สามารถเลือกวางตามลำดับโครงสร้างไฟล์ของระบบ
   หลังจากที่ทำการ install library ที่จำเป็นทั้งหมดแล้ว folder ที่เก็บโปรเจคต้องประกอบไปด้วย

   4.1 public/ เป็น folder สำหรับเก็บไฟล์ฝั่ง Frontend ที่ใช้แสดงผลบนเว็บเบราว์เซอร์ซึ่งมี
         4.1.1 ไฟล์ CSS(.css)
         4.1.1 ไฟล์ HTML(.html)
         4.1.1 ไฟล์ JavaScript(.js)

   4.2 upload/ เป็น folder สำหรับเก็บรูปภาพที่ผู้ใช้อัปโหลดในเว็บเบราว์เซอร์

   4.3 node modules/ เป็น folder สำหรับเก็บ Library ที่ผู้ใช้ได้ทำการติดตั้งในขั้นตอนที่ 3

   4.4 ไฟล์ server.js

   4.5 ไฟล์ package.json

   4.6 package-lock.json

6. นำเข้าไฟล์ database.sql ใน mysql work bench ที่เชื่อมต่อกับโปรเจค

    ขั้นตอนการนำเข้าไฟล์
   
      5.1 เปิด MySQL Workbench
   
      5.2 เลือก Local instance MySQL80
   
      5.3 ใส่ Password ที่ได้ตั้งเอาไว้ในขั้นตอนที่ติดตั้ง MySQL
   
      5.4 เลือก File -> Open SQL Script…
   
      5.5 เลือกไฟล์ database.sql จากนั้นจะมีสคริปต์ SQL ปรากฏ
   
      5.6 กดปุ่ม สายฟ้า (⚡️) หรือปุ่ม Ctrl + Shift + Enter เพื่อทำการรัน
   
7. ดำเนินการรันคำสั่งใน Terminal
    ```
    node server.js
    ```

# การใช้งาน
