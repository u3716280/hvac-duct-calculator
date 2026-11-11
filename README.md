# HVAC Duct Calculator 1.0

โปรแกรมคำนวณปริมาณลม ความเร็ว และขนาดท่อเหลี่ยม/ท่อกลม ใช้งาน Offline ด้วย Tauri v2 + HTML/CSS/Vanilla JS ไม่ใช้บริการ Cloud ในการคำนวณ

## วิธีรับ Windows EXE โดยใช้ GitHub Actions

1. สร้าง Repository ที่ https://github.com/new แนะนำ Private
2. แตก ZIP นี้ เปิดโฟลเดอร์ `hvac-duct-calculator`
3. ที่ Repository เลือก Add file → Upload files แล้วอัปโหลด **ไฟล์และโฟลเดอร์ข้างในทั้งหมด** ไปที่ราก Repository (อย่าอัปโหลด ZIP หรือโฟลเดอร์ครอบอีกชั้น)
4. ตรวจว่าราก Repository มี `package.json`, `package-lock.json`, `src/`, `src-tauri/`, `scripts/` และ `.github/workflows/build-windows.yml`
5. หาก `.github` ไม่ถูกอัปโหลด ให้เลือก Add file → Create new file ใส่ชื่อ `.github/workflows/build-windows.yml` แล้วคัดลอกเนื้อหาจากไฟล์ชื่อนี้ใน ZIP มาวางและ Commit
6. Commit ลง default branch เช่น main
7. ไป Actions → Build Windows Portable → Run workflow → เลือก main → Run workflow
8. รอผลสีเขียว เปิดรายการรันนั้น เลื่อนลง Artifacts แล้วดาวน์โหลด HVAC-Duct-Calculator-Windows-x64 (ต้อง Login GitHub)
9. แตก ZIP ผล Build แล้วเปิด HVAC-Duct-Calculator.exe ไม่ใช่ ZIP source นี้

Workflow ไม่เผยแพร่ Release และไม่ต้องเพิ่ม Secret ใช้ contents:read เท่านั้น Artifact เก็บ 14 วัน กด Build ใหม่ได้เมื่อหมดอายุ การใช้ runner ของ Private Repository อยู่ภายใต้โควตา/การคิดค่าบริการของบัญชี GitHub ตรวจหน้า Settings → Billing ก่อนใช้เกินโควตา

หาก Actions ไม่แสดง ตรวจว่า workflow อยู่ default branch และ Repository อนุญาต GitHub Actions หาก Build ล้มเหลว เปิดขั้นตอนสีแดงแล้วส่ง Log มาวิเคราะห์ได้

## Build บน Windows เอง

ต้องมี Node.js 22 LTS + npm, Rust stable MSVC, Visual Studio 2022 Build Tools พร้อม Desktop development with C++ / Windows SDK และ WebView2

```powershell
npm ci
npm test
npm run tauri dev
# หรือสร้าง EXE พร้อม checksum (สคริปต์จะติดตั้ง npm deps และทดสอบให้)
pwsh -File scripts/build-portable.ps1
```

ผลลัพธ์ `dist/portable/HVAC-Duct-Calculator.exe` และ `SHA256SUMS.txt`
คำสั่ง Build โดยตรง: `npm run tauri build -- --no-bundle`
Raw executable: `src-tauri/target/release/hvac-duct-calculator.exe`

## Runtime และ Portable

Windows 10/11 x64 พร้อม Microsoft Edge WebView2 Runtime ไม่ต้องมี Node.js, Rust หรือ MSVC toolchain บนเครื่องใช้งาน ไม่มี Installer และไม่ติดตั้ง Runtime ให้เงียบ ๆ
Portable หมายถึงเปิดโปรแกรมโดยไม่ติดตั้งตัวแอป ไม่ได้หมายความว่ารวม WebView2 อยู่ใน EXE ตัวเลือกแจกพร้อม WebView2 fixed runtime folder ยังไม่ได้ทำในรุ่นนี้
แอปไม่บันทึกค่าที่ป้อน ไม่เขียน Registry สำหรับ settings ไม่เขียนไฟล์ข้าง EXE แต่ WebView2 อาจสร้างข้อมูล cache/profile ของตัวเองใน user application data
EXE ยังไม่ได้เซ็น Code Signing จึงอาจมีคำเตือนชื่อผู้เผยแพร่/SmartScreen จาก Windows

## การใช้งาน

- ปริมาณลม: กำหนดขนาดท่อและความเร็ว
- ความเร็ว: กำหนดขนาดและปริมาณลม เลือกหน่วยผลความเร็วได้
- ขนาดท่อ: กำหนดปริมาณลมและความเร็ว อัตราส่วน 1–3 ปัดขึ้นทีละ 25/50 mm
- สลับหน่วยโดยรักษาค่า SI ภายใน แต่ละโหมดเก็บข้อมูลชั่วคราวแยกกัน
- คัดลอกผลพร้อมสูตร หรือ Reset เฉพาะโหมดปัจจุบัน
- ขนาดท่อใช้ขนาดภายในสุทธิ ไม่ใช่ขนาดภายนอก
- ขนาดแนะนำหลังปัดไม่ใช่การรับรองขนาดมาตรฐานการค้า
- เลือกความเร็วให้เหมาะกับเสียง ความดันตก และชนิดมลพิษ โปรแกรมนี้ไม่ได้เลือกความเร็วออกแบบให้

## สูตรและหน่วย

Q = A × V; V = Q/A; A = Q/V
ท่อเหลี่ยม A = W × H; ท่อกลม A = πD²/4
ขนาดเหลี่ยม W = √(A × ratio), H = A/W; ขนาดกลม D = √(4A/π)
ปัดขนาดขึ้นแต่ละด้าน แล้วคำนวณความเร็วจริงจาก Q/A ใหม่

1 inch = 0.0254 m; 1 ft = 0.3048 m
1 CFM = 0.3048³/60 = 0.0004719474432 m³/s
1 m/s = 60/0.3048 FPM; 1 m³/s = 3600 m³/h = 1000 L/s
ใช้ full Number precision ไม่แปลงย้อนจากตัวเลขที่ปัดเพื่อแสดงผล

**แก้ค่าตัวอย่างในข้อกำหนดเดิม:** 10 × 10 inch ที่ 10 m/s = 1367.0166229 CFM (ไม่ใช่ 1366.66), 2322.576 m³/h, 0.064516 m²

Calculated airflow assumes uniform mean velocity across the unobstructed duct cross-sectional area. Fan performance, duct friction, fitting losses, and air density effects are not included.

## ตรวจสอบและข้อจำกัด

`npm test` ใช้ Node built-in test runner โดยไม่เพิ่ม testing dependency
ดู TEST-REPORT.md สำหรับผลตรวจจริง การ Build frontend ผ่านไม่ได้ยืนยันว่า Windows EXE Build หรือเปิดได้ ต้องรัน workflow และทดสอบ Windows ต่อ
ไฟล์ Cargo.lock จะถูกสร้างเมื่อ Rust Build ครั้งแรก ยังไม่ได้แนบ เพราะไม่มี Rust ในสภาพแวดล้อมสร้าง Source นี้ npm dependency versions ล็อกใน package-lock.json

หลังได้ EXE ให้ตรวจ:
- เปิดโดยไม่มี Vite และปิด Internet แล้วคำนวณ
- ทดสอบ Copy, Reset, สลับรูปทรง/หน่วย และข้อมูลว่าง/ศูนย์/ค่าลบ
- ทดสอบ scaling 125/150/200%, หน้าต่างเล็กสุด และ keyboard navigation
- คัดลอก EXE ไปโฟลเดอร์อื่นหรือ USB แล้วเปิด
- ทดสอบ clean Windows VM พร้อม WebView2 และสังเกตพฤติกรรมเมื่อไม่มี Runtime
- ตรวจ startup/shutdown และไฟล์ cache/profile ที่ WebView2 สร้าง
