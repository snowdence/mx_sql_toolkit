/*
File nộp : MSSV-Script.sql

Viết script tạo cấu trúc CSDL sau. Sinh viên tự nhập liệu với dữ liệu hợp lý.

Lưu ý: script được thực hiện 1 lần duy nhất bằng F5. Error xảy ra ở đâu là ngừng chấm script chổ đó.

Tên CSDL: QLSinhVien_MSSV

Schema:

SinhVien (MSSV, Hoten, GioiTinh, ThuocNhom, DiemTB, SoThich)

x Hoten: trường dữ liệu bắt buộc
x GioiTinh: "Nam" hoặc "Nữ"
x DiemTB: là số thực trong khoảng [0..10]
x SoThich: trường dữ liệu tùy biến (optional)
x  ThuocNhom: là khóa ngoại, tham chiếu đến Bảng NhomHocTap
NhomHocTap (MaNhom, TenNhom, MaNhomTruong)

x TenNhom: trường dữ liệu có giá trị duy nhất, không trùng
x  MaNhomTruong: là khóa ngoại, tham chiếu đến Bảng SinhVien
*/
use master
DROP DATABASE IF EXISTS QLSinhVien_18127027;
go


create database QLSinhVien_18127027
go
use QLSinhVien_18127027
go



create table NhomHocTap(
	MaNhom int IDENTITY(1,1) NOT NULL,
	TenNhom nvarchar(50) NOT NULL UNIQUE,
	MaNhomTruong char(8),
	constraint PK_NhomHocTap primary key (MaNhom)
)
go

create table SinhVien
(
	MSSV char(8) NOT NULL primary key,
	Hoten nvarchar(50) NOT NULL,
	GioiTinh nvarchar(3) CONSTRAINT CK_SinhVien_Gioitinh check (GioiTinh in  (N'Nam', N'Nữ')),
	ThuocNhom int,
	DiemTB float CONSTRAINT CK_SinhVien_DiemTB check(DiemTB >=0 and DiemTB <=10),
	SoThich nvarchar(50)
)
go


ALTER TABLE NhomHocTap
ADD CONSTRAINT FR_MaNhomTruong
FOREIGN KEY (MaNhomTruong) REFERENCES SinhVien(MSSV);
go

ALTER TABLE SinhVien
ADD CONSTRAINT FR_ThuocNhom
FOREIGN KEY (ThuocNhom) REFERENCES NhomHocTap(MaNhom);
go



/* insert row*/
INSERT INTO SinhVien (MSSV, Hoten, GioiTinh, ThuocNhom, DiemTB, SoThich) VALUES ('18127001', N'Trần Minh A1', N'Nam', NULL , 0, N'Khong A1');
INSERT INTO SinhVien (MSSV, Hoten, GioiTinh, ThuocNhom, DiemTB, SoThich) VALUES ('18127002', N'Trần Minh A2', N'Nữ', NULL , 1, N'Khong A2');
INSERT INTO SinhVien (MSSV, Hoten, GioiTinh, ThuocNhom, DiemTB, SoThich) VALUES ('18127003', N'Trần Minh A3', N'Nữ', NULL , 2, N'Khong A3');
INSERT INTO SinhVien (MSSV, Hoten, GioiTinh, ThuocNhom, DiemTB, SoThich) VALUES ('18127004', N'Trần Minh A4', N'Nam', NULL , 3, N'Khong A4');
INSERT INTO SinhVien (MSSV, Hoten, GioiTinh, ThuocNhom, DiemTB, SoThich) VALUES ('18127005', N'Trần Minh A5', N'Nữ', NULL , 4, N'Khong A5');
INSERT INTO SinhVien (MSSV, Hoten, GioiTinh, ThuocNhom, DiemTB, SoThich) VALUES ('18127006', N'Trần Minh A6', N'Nam', NULL , 5, N'Khong A6');
INSERT INTO SinhVien (MSSV, Hoten, GioiTinh, ThuocNhom, DiemTB, SoThich) VALUES ('18127007', N'Trần Minh A7', N'Nam', NULL , 6, N'Khong A7');
go

INSERT INTO NhomHocTap (TenNhom, MaNhomTruong) VALUES ( N'Nhóm 1', '18127001');
INSERT INTO NhomHocTap (TenNhom, MaNhomTruong) VALUES ( N'Nhóm 2', '18127002');
INSERT INTO NhomHocTap (TenNhom, MaNhomTruong) VALUES ( N'Nhóm 3', '18127003');
go

/*update member row to group row*/

UPDATE SinhVien SET ThuocNhom = 1 WHERE MSSV = '18127001';
UPDATE SinhVien SET ThuocNhom = 2 WHERE MSSV = '18127002';
UPDATE SinhVien SET ThuocNhom = 3 WHERE MSSV = '18127003';
UPDATE SinhVien SET ThuocNhom = 3 WHERE MSSV = '18127004';
UPDATE SinhVien SET ThuocNhom = 2 WHERE MSSV = '18127005';
UPDATE SinhVien SET ThuocNhom = 2 WHERE MSSV = '18127006';
UPDATE SinhVien SET ThuocNhom = 1 WHERE MSSV = '18127007';
go