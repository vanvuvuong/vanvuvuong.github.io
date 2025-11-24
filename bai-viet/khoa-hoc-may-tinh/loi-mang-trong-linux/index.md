# Điều Tra Những Vấn Đề Liên Quan Tới Mạng Trong Hệ Điều Hành (HĐH) Linux


Những công cụ & bước để điều tra khi gặp lỗi mạng trong hệ thống Linux

## Công cụ cần sử dụng: `nslookup`, `dig`, `echo`, `ip`, `ifconfig`, `nmcli`, `traceroute`

## Trình tự điều tra

- Kiểm tra tình trạng giao diện mạng
- Kiểm tra tình trạng kết nối của giao diện mạng (với switch / router)
- Kiểm tra tình trạng phân giải tên miền
- Kiểm tra đường đi của đường mạng
- Kiểm tra các quy tắc của tường lửa
- Kiểm tra các kết nối với một máy:cổng cụ thể

## Câu lệnh

```bash
# echo > /dev/tcp/ip-máy-cần-kiểm-tra/cổng-máy-cần-kiểm-tra && echo "Open" || echo "Closed"
echo > /dev/tcp/8.8.8.8/53 && echo "Open" || echo "Closed"
```


---

> Tác giả: [Kaizen Teams](https://vanvuvuong.github.io)  
> URL: https://vanvuvuong.github.io/bai-viet/khoa-hoc-may-tinh/loi-mang-trong-linux/  

