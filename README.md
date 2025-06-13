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
   
   เป็นตัวจัดการฐานข้อมูลหลักของโปรแกรม โดยผู้ใช้จำเป็นต้องดาวน์โหลด MySQL Server และ MySQL Workbecnh หลังจากติดตั้งเสร็จผู้ใช้ควรจดจำ Root Password ที่ตั้งไว้ให้ดีเพราะจำเป็นต้องใช้ในการเชื่อมต่อฐานข้อมูล

3. [Visual Studio Code](https://code.visualstudio.com/).
   
   โปรแกรมสำหรับการจัดการโค้ด
   
# การติดตั้ง

1. ผู้ใช้จำเป็นจะต้องติดตั้ง node.js, Mysql, และ Visual Studio Code

   1.1 การติดตั้ง node.js จากเว็บไซต์ https://nodejs.org/en

   - 1.1.1 โดยผู้ใช้กด Download Node.js (LTS) เพื่อดาวโหลดและดำเนินการ install
   - 1.1.2 กดยอมรับ term of service
   - 1.1.3 เลือกโฟลเดอร์ที่จะติดตั้ง
   - 1.1.4 ระบบจะมีให้เลือกว่าต้องการติดตั้ง/ไม่ติดตั้งตัวใด ด้านนี้หากไม่ได้ต้องการอะไรเป็นพิเศษสามารถกดไปต่อได้เลย
   - 1.1.5 node.js จะชวนให้ติดตั้ง native modules หากไม่สนใจสามารถกดต่อไปได้เลย
   - 1.1.6 จากนั้นจึงสามารถกด install ได้
   - 1.1.7 ระบบจะใช้เวลา install และเมื่อสำเร็จจะขึ้นหน้าที่สามารถกดเสร็จสิ้นได้และระบบจะอัพโหลดตัวเองขึ้นในระบบ terminal และจะขออนุญาตเข้าถึงระบบคอมพิวเตอร์ ขอให้ผู้ใช้กดตกลงเมื่อระบบรันในterminalเสร็จสิ้นจะมีข้อความ press any key to continue.. ให้ผู้ใช้กดปุ่มใดก็ได้ระบบจะเริ่มดำเนินการ install ต่อจนเสร็จสิ้น

    1.2 การติดตั้ง MySQL จากเว็บไซต์ https://dev.mysql.com/downloads/installer/ แนะนำเป็นเวอร์ชั่น 8.0.42

   - 1.2.1 ผู้ใช้เลือกกดดาวโหลด Windows (x86, 32-bit), MSI Installer
   - 1.2.2 ระบบจะขึ้นให้ login สามารถเข้าสู่ระบบหรือไม่ก็ได้ หากไม่ต้องการให้กด  No thanks, just start my download. ระบบจะเริ่มการดาวโหลดทันที โดยจะขออนุญาตเข้าถึงระบบคอมพิวเตอร์ ขอให้ผู้ใช้กดตกลง
   - 1.2.3 ระบบจะแสดงหน้า "Choosing a Setup Type" ให้ผู้ใช้เลือกประเภทการติดตั้งเป็น "Full" ซึ่งจะติดตั้งฟีเจอร์ของ MySQL ทั้งหมด จากนั้นคลิกปุ่ม "Next" เพื่อดำเนินการต่อ
   - 1.2.4 ระบบจะให้ผู้ใช้เลือก path ที่ต้องการ จากนั้นกด"Next"
   - 1.2.5 โปรแกรมติดตั้งจะตรวจสอบว่าคอมพิวเตอร์ของคุณมีสิ่งที่จำเป็นครบหรือไม่ หากมีรายการใดไม่ผ่าน ให้คลิกที่แต่ละรายการ แล้วคลิกปุ่ม "Execute" เพื่อให้โปรแกรมติดตั้งสิ่งที่ขาดโดยอัตโนมัติ จากนั้นคลิก "Next"
   - 1.2.6 ระบบจะแสดงหน้า "Product Configuration" ซึ่งจะแสดงรายการผลิตภัณฑ์ที่จะถูกกำหนดค่า คลิกที่ "MySQL Server 8.0.23" เพื่อกำหนดค่าเซิร์ฟเวอร์ จากนั้นคลิก "Next" เลือก "Standalone MySQL Server/Classic MySQL Replication" แล้วคลิก "Next"
   - 1.2.7 ในหน้าจอ "Type and Networking" ให้ตั้งค่า
      - Config Type เป็น "Development Computer"
      - Connectivity เป็น "TCP/IP"
      - Port เป็น "3006"
      - แล้วคลิก "Next"
   - 1.2.8 ระบบจะแสดงหน้า "Authentication Method" ให้ผู้ใช้เลือก "Use Strong Password Encryption for Authentication" แล้วคลิก "Next"
   - 1.2.9 ระบบจะแสดงหน้า “Accouts and Roles” เป็นการตั้งรหัสผ่านของ MySQL ทั้งระบบ 
   - 1.2.10 ระบบจะแสดงหน้า "Windows Service" สำหรับตั้งค่าการให้ Windows เริ่มเซิร์ฟเวอร์โดยอัตโนมัติ ให้คงค่าเริ่มต้นไว้ แล้วคลิก "Next
   - 1.2.11 ระบบจะแสดงหน้า "Apply Configuration" คลิกปุ่ม "Execute" เพื่อเริ่มการกำหนดค่าเซิร์ฟเวอร์ เมื่อเสร็จแล้วคลิก "Finish"
   - 1.2.12 ระบบจะแสดงหน้า "Product Configuration" แสดงว่าการกำหนดค่าเสร็จสมบูรณ์แล้ว ให้คงค่าดีฟอลต์ไว้ แล้วคลิก "Next" และ "Finish" เพื่อเสร็จสิ้นการติดตั้งแพ็กเกจ MySQL
   - 1.2.13 ระบบจะแสดงหน้า “Router Configuration” คือให้ผู้ใช้เลือกว่า MySQL Router จะเชื่อมต่อกับ MySQL Server อย่างไร ใช้พอร์ตอะไร จัดการกรณีที่เซิร์ฟเวอร์หลักล่มอย่างไร (Failover) เส้นทางหรือ URL ที่แอปพลิเคชันควรใช้เพื่อติดต่อกับฐานข้อมูล และเสนอให้ใช้  InnoDB Cluster ซึ่งจะใช้หรือไม่ใช่ก็ได้
   - 1.2.14 ระบบจะแสดงหน้า "Product Configuration" ซึ่งจะแสดงว่าการกำหนดค่าเสร็จสมบูรณ์แล้ว ให้คงค่าดีฟอลต์ไว้แล้วคลิก "Next" และ "Finish" เพื่อเสร็จสิ้นการติดตั้งแพ็กเกจ MySQL
   - 1.2.15 ระบบจะแสดงหน้า "Connect To Server" ใส่ Root Password (ในขั้นตอนที่ 1.2.9) แล้วคลิก "Check" เพื่อตรวจสอบการเชื่อมต่อ จากนั้นคลิก "Next"
   - 1.2.16 ระบบจะแสดงหน้า "Apply Configuration" คลิก "Execute" เพื่อใช้การกำหนดค่า เมื่อเสร็จแล้วคลิก "Finish"
   - 1.2.17 ระบบจะแสดงหน้า  "Product Configuration" ซึ่งแสดงว่าการกำหนดค่าเสร็จสมบูรณ์แล้ว ให้คงค่าดีฟอลต์ไว้ แล้วคลิก "Next" และ "Finish" เพื่อเสร็จสิ้นการติดตั้งแพ็กเกจ MySQL
   - 1.2.18 ระบบจะแสดงหน้า "Installation Complete" ซึ่งแสดงว่าการติดตั้งเสร็จสมบูรณ์ ให้คลิกปุ่ม "Finish"

     1.3 การติดตั้ง VScode จากเว็บไซต์ [https://code.visualstudio.com/](https://code.visualstudio.com/Download)
   - 1.3.1 ผู้ใช้เลือกกด "Download" และเลือกระบบปฏิบัติการ
   - 1.3.2 ทำการ install .exe file
   - 1.3.3 กดยอมรับ term of service
   - 1.3.4 เลือกโฟลเดอร์ที่จะติดตั้งและกดinstall

2. สร้าง folder สำหรับการใส่โปรเจค
 
   ผู้ใช้จำเป็นต้องใช้คำสั่ง cd เพื่อไปยังโฟลเดอร์ที่มีโค้ด (ในที่นี้คือ Project) และจึง ใช้คำสั่ง npm init -y เพื่อเรียกใช้ library ของ node.js
   
   ```
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

   4.4 ในไฟล์ server.js ผู้ใช้ต้องแก้ไข Password ให้ตรงกับ Root Password ที่ผู้ใช้ได้ตั้งเอาไว้ในขั้นตอนที่ติดตั้ง MySQL
   ```
         password: process.env.DB_PASSWORD || "(MySQL's Root Password)",
   ```

   4.5 package.json

   4.6 package-lock.json

   4.7 database.sql

5. นำเข้าไฟล์ database.sql ใน MySQL Workbench ที่เชื่อมต่อกับโปรเจค

    ขั้นตอนการนำเข้าไฟล์
   
      5.1 เปิด MySQL Workbench
   
      5.2 เลือก connection ของ MySQL ที่ต้องการใช้งาน
   
      5.3 ใส่ Root Password ที่ได้ตั้งเอาไว้ในขั้นตอนที่ติดตั้ง MySQL
   
      5.4 เลือก File -> Open SQL Script…
   
      5.5 เลือกไฟล์ database.sql จากนั้นจะมีสคริปต์ SQL ปรากฏ
   
      5.6 กดปุ่ม สายฟ้า (⚡️) หรือปุ่ม Ctrl + Shift + Enter เพื่อทำการรัน
   
6. ดำเนินการรันคำสั่งใน Terminal
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
1. คลิกปุ่ม Open บน Project Card เพื่อเข้าโปรเจค
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
