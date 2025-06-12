[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/w8H8oomW)

**<ins>Note</ins>: Students must update this `README.md` file to be an installation manual or a README file for their own CS403 projects.**


**รหัสโครงงาน:** 67-1_04_tnt-r2

**ชื่อโครงงาน (ไทย):** การพัฒนาโปรแกรมสร้างผลเฉลยข้อมูลสำหรับฝึกสอนโมเดลปัญญาประดิษฐ์ทางการแพทย์

**Project Title (Eng):** Development of a Data Labeling Program for Training Medical AI Models

**อาจารย์ที่ปรึกษาโครงงาน:** รศ.ดร.ธนาธร ทะนานทอง

**ผู้จัดทำโครงงาน:** 
1. นายกันตพล แท่นประทุม  6209610010  kantapol.tha@dome.tu.ac.th 
2. นางสาวกานชญา นิลพันธุ์  6209610135  kunchaya.nil@dome.tu.ac.th 
   
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
  - database.sql


# ขั้นตอนการโหลดไฟล์
ผู้ใช้สามารถเลือกกดปุ่ม ![image](https://github.com/user-attachments/assets/76ed8aea-848b-42a9-b728-b5f89e306591)
 หน้าgithup ของโปรเจคเพื่อจะ

**วิธีที่ 1 Download Zip**
1. ผู้ใช้สามารถแตกไฟล์ .zip ที่ดาวโหลดได้
2. เปิดโฟลเดอร์ใน Visual studio code เพื่อดูโค้ด

**วิธีที่ 2 Clone using the web URL**
1. ผู้ใช้ใช้คำสั่งใน git brush
   ```
   git clone https://github.com/ComSciThammasatU/2567-2-cs403-final-submission-67-1_04_tnt-r2.git
   ```
2. เปิด folder project 

# ชุดโปรแกรมที่จำเป็น

1. [node js](https://nodejs.org/en).
   
   ทำหน้าที่เป็น เซิร์ฟเวอร์ฝั่ง Backend สำหรับโปรแกรม Labeling โดยรับผิดชอบในการจัดการคำขอ (request) จากฝั่งผู้ใช้

2. [MySQL](https://dev.mysql.com/downloads/installer/).
   
   เป็นตัวจัดการฐานข้อมูลหลักของโปรแกรม โดยผู้ใช้จำเป็นต้องดาวน์โหลด MySQL Server และ MySQL Workbecnh โดยในขั้นตอนนี้จะให้ผู้ทำการสร้าง Password เพื่อใช้ล็อกอินเข้า MySQL

3. [Visual Studio Code](https://code.visualstudio.com/).
   
   โปรแกรมสำหรับการจัดการโค้ด
   
# การติดตั้ง

1. ผู้ใช้จำเป็นจะต้องติดตั้ง node.js, Mysql, และ Visual Studio Code
2. สร้าง folder สำหรับการใส่โปรเจค
   
   ```
   mkdir (Whatever you want to name your folder)
   cd (your folder's name)
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
4. ไฟล์ที่ดาวน์โหลดผู้ใช้สามารถเลือกวางตามลำดับโครงสร้างไฟล์ของระบบ
   
   หลังจากที่ทำการ install library ที่จำเป็นทั้งหมดแล้ว folder ที่เก็บโปรเจคต้องประกอบไปด้วย

   4.1 public/ เป็น folder สำหรับเก็บไฟล์ฝั่ง Frontend ที่ใช้แสดงผลบนเว็บเบราว์เซอร์ซึ่งมี
   - ไฟล์ CSS (.css)
   - ไฟล์ HTML (.html)
   - ไฟล์ JavaScript (.js)

   4.2 upload/ เป็น folder สำหรับเก็บรูปภาพที่ผู้ใช้อัปโหลดในเว็บเบราว์เซอร์

   4.3 node modules/ เป็น folder สำหรับเก็บ Library ที่ผู้ใช้ได้ทำการติดตั้งในขั้นตอนที่ 3

   4.4 server.js ผู้ใช้ต้องแก้ไข Password ในไฟล์ JavaScript ให้ตรงกับ Password ที่ผู้ใช้ได้ตั้งเอาไว้ในขั้นตอนที่ติดตั้ง MySQL
   ```
         password: process.env.DB_PASSWORD || "(MySQL's password)",
   ```

   4.5 package.json

   4.6 package-lock.json

   4.7 database.sql

6. นำเข้าไฟล์ database.sql ใน MySQL Workbench ที่เชื่อมต่อกับโปรเจค

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

หลังจากรันคำสั่ง node server.js ใน Terminal แล้ว ให้เข้าใช้งานผ่านเว็บเบราว์เซอร์ที่ http://localhost:5000 และดำเนินการตามขั้นตอนด้านล่างนี้:

**1. การสร้างบัญชี (สำหรับผู้ใช้ที่ยังไม่ได้สร้างบัญชี ถ้าผู้ใช้สร้างบัญชีแล้วให้ข้ามไปขั้นตอนที่ 2 ได้เลย)** 
1. คลิก Sign up
2. กรอก ชื่อ, E-mail และ Password 
3. คลิกปุ่ม Sign up

**2. การเข้าสู่ระบบ**
1. เปิดหน้า Login
2. กรอก E-mail และ Password
3. คลิกปุ่ม Log in
4. คลิกปุ่ม OK ที่ Pop-up Login successful!

**3. การสร้างโปรเจค** 
1. คลิกที่เมนู Project ในแท็บ Dashboard
2. คลิกปุ่ม Create New Project
3. ใส่ ชื่อ และ Tag ของโปรเจคใหม่ที่จะสร้าง
4. คลิกปุ่ม Create จะแสดง Project Card ใหม่
5. หากต้องการลบ Project Card ให้คลิกปุ่ม Delete บน Project Card

**4. การอัปโหลดรูปภาพลงโปรเจค** 
1. คลิกปุ่ม Open บน Project Card ที่สร้างใหม่เพื่อเข้าโปรเจค
2. คลิกปุ่ม Select Image
3. เลือกรูปภาพที่ต้องการ
4. คลิกปุ่ม Open แล้วภาพจะแสดงในโปรเจค
5. หากต้องการลบรูปภาพให้คลิกไอคอน กากบาท (❌) ที่มุมของภาพ

**5. การสร้างผลเฉลย**
1. คลิกเมนู Labeling ในโปรเจค
2. คลิกปุ่ม Start Labeling
3. เลือกรูปภาพที่ต้องการสร้างผลเฉลย
4. คลิกปุ่ม Create Label
5. ตั้งชื่อและเลือกสีของ Label
6. คลิกปุ่ม Create
7. คลิกที่ Label ที่สร้างไว้ทางด้านขวามือ
8. สร้างผลเฉลยโดยการตีกรอบบนตำแหน่งที่ต้องการบนรูปภาพ
9. หลังจากสร้างผลเฉลยที่ต้องการทั้งหมดแล้วคลิกปุ่ม Back

**6. การสร้างส่งออกไฟล์ผลเฉลย**
1. คลิกเมนู Dataset ในโปรเจค
2. คลิกเลือกรูปแบบของไฟล์ที่ผู้ใช้ต้องการส่งออก
   - Export Raw จะส่งออกเป็นไฟล์รูปภาพ
   - Export COCO จะส่งออกไฟล์ JSON ที่แสดงข้อมูลผลเฉลยในรูปแบบ COCO
3. คลิกที่ปุ่ม Back ที่มุมซ้ายบนเพื่อออกจากโปรเจค
    
**7. การออกจากระบบ**
1. เมื่อผู้ใช้กลับมาที่หน้า Projects แล้วให้คลิกที่ชื่อของผู้ใช้ที่มุมซ้ายล่าง
2. คลิก Sign Out เพื่อออกจากระบบ  
