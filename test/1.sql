USE master
DROP DATABASE IF EXISTS QLSV;
                GO
CREATE DATABASE QLSV
                GO
USE QLSV
                GO
CREATE TABLE NHANVIEN
(
    HoNV nvarchar(50),
    TenLot nvarchar(50),
    TenNV nvarchar(50),
    MaNV nvarchar(50),
    NgSinh nvarchar(50),
    Dchi nvarchar(50),
    Phai nvarchar(50),
    Luong nvarchar(50),
    Ma_NQL nvarchar(50),
    PHG nvarchar(50),
);
CREATE TABLE PHONGBAN
(
    TenPHG nvarchar(50),
    MaPHG nvarchar(50),
    TrPHG nvarchar(50),
    Ng_NhanChuc nvarchar(50),
);
CREATE TABLE THANNHAN
(
    Ma_Nvien nvarchar(50),
    TenTN nvarchar(50),
    Phai nvarchar(50),
    NgSinh nvarchar(50),
    QuanHe nvarchar(50),
);
CREATE TABLE DIADIEM_PHG
(
    MaPHG nvarchar(50),
    DiaDiem nvarchar(50),
);
CREATE TABLE DEAN
(
    TenDA nvarchar(50),
    MaDA nvarchar(50),
    DDiem_DA nvarchar(50),
    Phong nvarchar(50),
);
CREATE TABLE CONGVIEC
(
    MaDA nvarchar(50),
    STT nvarchar(50),
    Ten_Cong_Viec nvarchar(50),
);
CREATE TABLE PHANCONG
(
    Ma_Nvien nvarchar(50),
    MaDA nvarchar(50),
    STT nvarchar(50),
    ThoiGian nvarchar(50),
);
