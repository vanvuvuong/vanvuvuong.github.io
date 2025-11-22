# Quản Lý / Cấu Hình Mạng Trong Hệ Điều Hành (HĐH) Linux


Bài này bao gồm những nội dung:

- bật / tắt phần cứng của mạng (wifi card, ethernet card)
- cấu hình thiết bị mạng (network device), giao diện mạng (network interface), kết nối mạng (network connection)
- cấu hình DHCP (tự động / thủ công)
- cấu hình DNS
- cấu hình đường đi của mạng (routing)
- chặn/cho phép các kết nối mạng ra/vào hệ thống

Thư mục cần cấu hình:

- `NETWORK_HOME="/etc/NetworkManager/"`

## Quản lý phần cứng

- Câu lệnh sử dụng: `nmcli`, `nmtui`, `ip`
- Thư mục cấu hình: `/etc/NetworkManager/conf.d`

Với hầu hết máy tính hiện đại, bất kể đang là HĐH họ Gentoo, Debian (Ubuntu, Lubuntu, Mint), Arch (Manjero, ArchLinux), openSUSE, hay họ REHL (CentOS, Fedora, Amazon Linux,...) đều sẽ sử dụng dịch vụ `NetworkManger` để quản lý phần cứng & kết nối mạng.

- Trước khi cần quản lý bật/tắt phần cứng điều đầu tiên cần xem xét là Linux đã "nhận ra" phần cứng của máy bạn hay chưa. Để kiểm tra điều đó, bạn nhập câu lệnh:
  ```bash
  user@linux:~$ ip addr show
  1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
      link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
      inet 127.0.0.1/8 scope host lo
      valid_lft forever preferred_lft forever
      inet6 ::1/128 scope host noprefixroute
      valid_lft forever preferred_lft forever
  2: enp2s0f0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc fq_codel state DOWN group default qlen 1000
      link/ether 84:a9:38:d3:9a:95 brd ff:ff:ff:ff:ff:ff
      altname enx84a938d39a95
  3: wlp3s0: <BROADCAST,MULTICAST> mtu 1500 qdisc noqueue state DOWN group default qlen 1000
      link/ether fe:9e:bf:24:5e:4e brd ff:ff:ff:ff:ff:ff permaddr 10:6f:d9:a1:89:b3
      altname wlx106fd9a189b3
  ```

Trong số kết quả xuất hiện `lo` là giao diện lặp lại (loopback interface) để cho phép những câu lệnh quản lý mạng có thể chạy được trên 1 máy tính nội bộ.

Máy tính như ví vụ trên có 2 giao diện mạng (network interfaces) `enp2s0f0` (giao diện nối với dây mạng) và `wlp3s0` (giao diện mạng không dây) đều đang trong trạng thái `DOWN` nghĩa là đang không nói dây mạng và tắt mạng không giây.

Những máy tính có phiên bản nhân Linux cũ hơn thường sẽ có tên giao diện mạng khác (như `eth0` cho mạng dây, `wlan0` cho mạng không giây). Giờ đây, các tên giao diện mạng sẽ gắn liền cũng với vị trí của cổng PCI. Như máy tính ở ví dụ trên có giao diện nối với dây mạng ở cổng PCI `p2s0f0`.

- Bật / tắt phần cứng của những giao diện mạng:

  ```bash
  user@linux:~$ nmcli device status
  DEVICE    TYPE      STATE                   CONNECTION
  lo        loopback  connected (externally)  lo
  enp2s0f0  ethernet  unavailable             --
  wlp3s0    wifi      unavailable             --
  ```

`Unavailable` nghĩa là 2 giao diện mạng chưa được bật/nối với dây mạng.

- Vậy giờ thử bật mạng không dây lên xem nào:

  ```bash
  user@linux:~$ nmcli device up wlp3s0
  Error: Failed to add/activate new connection: A 'wireless' setting is required if no AP path was given.
  ```

  Hừm, có vẻ như chúng ta không thể bật mạng không dây bằng câu lệnh này. Thực ra lỗi này là do khi chúng ta chạy câu lệnh này, `NetworkManager` không thể tìm thấy một cấu hình liên quan đến mạng không dây có sẵn, nên nó báo lỗi _`A 'wireless' setting is required if no AP path was given.`_
  Chúng ta sẽ sử dụng một câu lệnh khác để bật mạng không dây lên:

  ```bash
  user@linux:~$ nmcli radio wifi on
  user@linux:~$ echo $?
  0
  user@linux:~$ nmcli device status
  DEVICE          TYPE      STATE                   CONNECTION
  wlp3s0          wifi      connected               Mạng Không Giây Miễn Phí
  lo              loopback  connected (externally)  lo
  p2p-dev-wlp3s0  wifi-p2p  disconnected            --
  enp2s0f0        ethernet  unavailable             --
  ```

  Câu lệnh này sẽ không có kết quả trả ra màn hình, nên chúng ta kiểm tra bằng các kiểm tra mã `exit` sau khi chạy câu lệnh. `0` nghĩa là chạy câu lệnh thành công. Kết quả là giao diện `wlp3s0` đã kết nối với mạng ``Mạng Không Giây Miễn Phí` thành công.

> cân nhắc bỏ đoạn này
> Chắc hẳn bạn sẽ đặt câu hỏi là, chỉ bật/tắt một giao diện mạng, có cần phải học không, sao không dùng chuột click vào biểu tượng & bật tắt cho nhanh?

Câu hỏi này rất thực tế, tuy nhiên câu hỏi hay hơn là, sử dụng câu lệnh sẽ có lợi ích gì so với dùng chuột chọn trên giao diện?

Giả sử bạn muốn tạo một phím tắt (shortcut) để bật tắt mạng không dây theo ý mình muốn, bạn sẽ cài đặt chúng như thế nào? Tất nhiên, mở giao diện cài đặt lên bằng phím tắt -> tìm phần cấu hình mạng -> tắt HOẶC tắt bằng click chuột cũng ko sao, tuy nhiên, bạn đang chưa thực sự tối ưu & bỏ lỡ rất nhiều thứ tuyệt diệu của Linux. Việc tạo một phím tắt mới -> chạy 1 câu lệnh lại dễ dàng & nhanh hơn rất nhiều. Và tiếp theo là một ví dụ khác:

- Giả sử bạn không muốn máy tính của mình tự động kết nối mạng mỗi khi cắm dây mạng, hoặc mỗi khi bật mạng không giây lên, bạn sẽ làm thế nào? Tất nhiên mở `Cài đặt` -> `Mạng không giây và Internet` để tìm & cấu hình mỗi kết nối (connection) là rất mất thời gian. Tuy nhiên chúng ta có thể dễ dàng cài đặt chúng chỉ bằng 2 câu lệnh:

  ```bash
  user@linux:~$ nmcli device set enp2s0f0 autoconnect off
  user@linux:~$ nmcli device set wlp3s0 autoconnect off
  ```

  Vậy là từ giờ trở đi, bạn sẽ chủ động kiểm soát hoàn toàn việc lựa chọn một mạng đáng tin để kết nối thay vì kết nối tự động tiện dụng một cách đáng sợ.

- **Cấu hình địa chỉ MAC ngẫu nhiên:**

  Như bạn có thể đã biết, mỗi thiết bị mạng được sản xuất ra sẽ có một mã số định danh xác định. Mã số này rất quan trọng trong việc kết nối mạng. Nếu so sánh địa chỉ IP như số nhà của bạn, thì địa chỉ MAC giống như là tên của bạn vậy. Mặc dù vậy so sánh với tên bạn là hơi bất cập, bởi tên của bạn có thể trùng với người khác. Tuy nhiên với địa chỉ MAC, nó là duy nhất trên toàn thế giới cho từng thiết bị mạng. Mỗi một nhà sản xuất sẽ có một dải đầu số địa chỉ MAC đầu tiên cố định, cụ thể bạn có thể xem danh sách đó bằng câu lệnh:

  ```bash
  user@linux:~$ macchanger --list
  Misc MACs:
  Num    MAC        Vendor
  ---    ---        ------
  0000 - 00:00:00 - XEROX CORPORATION
  0001 - 00:00:01 - XEROX CORPORATION
  0002 - 00:00:02 - XEROX CORPORATION
  0003 - 00:00:03 - XEROX CORPORATION
  ....
  ```

  Vậy tại sao bạn cần cấu hình địa chỉ MAC ngầu nhiên? Bởi vì nó là một dạng siêu dữ liệu, để đảm bảo quyền riêng tư của bạn trên mạng Internet, tốt nhất là bạn không nên để bất cứ thứ gì có thể theo dõi hay tổng hợp thông tin của bạn chỉ từ một mã-định-danh duy nhất.

  Để cấu hình phần này, bạn cần tạo một tệp cấu hình mới trong thư mục `$NETWORK_HOME/conf.d/random-mac.conf` với nội dung như sau, với cấu hình này, mỗi một kết nối (connection) đến một mạng mới (như mạng không dây ở quán cà phê, ở nhà, ở công ty) sẽ có một địa chỉ MAC riêng biệt khác nhau. Và khi bạn tái kết nối, địa chỉ MAC vẫn như cũ.

  ```conf
  [device]
  wifi.scan-rand-mac-address=yes

  [connection-random-mac]
  wifi.cloned-mac-address=stable
  ethernet.cloned-mac-address=stable
  connection.stable-id=${CONNECTION}/${BOOT}
  ```

  Sau đó khởi động lại dịch vụ `NetworkManager` bằng câu lệnh `systemctl restart NetworkManager`

Đối với câu lệnh `nmui` khá giống với giao diện bình thường nên mình sẽ không hướng dẫn gì thêm

> cân nhắc bỏ

## Quản lý kết nối

- Câu lệnh sử dụng: `nmcli`, `nmtui`, `ping`, `nc`, `telnet`
- Thư mục cấu hình: `/etc/NetworkManager/system-connections`

Phần này sẽ đề cập đến cấu hình của từng kết nối riêng biệt nhau, cùng với những sự liên quan của

- gateway
- address, mask

## Quản lý dịch vụ phân giải tên miền (DNS)

> là dịch vụ tìm kiếm địa chỉ IP của máy chú dựa vào tên miền, ví dụ tìm kiếm `google.com` ra địa chỉ IP là `14.121.123.11`

- Câu lệnh sử dụng: `resolvectl`, `dig`, `nslookup`, `authselect`, `host`
- Thư mục cấu hình: `/etc/NetworkManager/`
- /etc/host{name,s}
- /etc/resolv.conf
- /etc/nsswitch.conf

Kiểm tra thứ tự phân giải tên miền trong hệ thống Linux:

```bash
kris@fedora:~$ cat /etc/nsswitch.conf | grep hosts
hosts:      files myhostname mdns4_minimal [NOTFOUND=return] resolve [!UNAVAIL=return] dns
```

Như kết của của câu lệnh trên có nghĩa là tên miền trong hệ thống sẽ được phân giải theo thứ tự sau:

- tệp `/etc/hosts`
- cái gì đó liên quan tới `myhostname`
- dịch vụ ghi nhớ tạm tên miền
- dịch vụ chuyển tiếp phân giải tên miền
- dịch vụ phân giải tên miền từ `router`, `switcher`

Dịch vụ này là tối quan trọng đối với hệ thống Linux dùng cho cá nhân hay là tổ chức. Bởi những hoạt động kết nối với mạng Internet hàng ngày của chúng ta (và của các máy tính với nhau) gần như chỉ sử dụng tên miền 99.9999%. Một máy tính gặp trục trặc trong việc cấu hình dịch vụ xử lý tên miền có thể gây ra rất nhiều lỗi nghiêm trọng cho hệ thống.

Hơn hết, dịch vụ quản lý phân giải tên miền có thể giúp các tổ chức hay cá nhân chặn truy cập vào dịch vụ hay trang mạng nguy hiểm nào đó một cách đơn giản, nếu như bạn hay tổ chức của bạn có một hệ thống quản lý tên miền riêng, điều đó lại dễ dàng hơn nữa.

- Kiểm tra xem cấu hình phân giải tên miền đã chuẩn hay chưa:
  ```bash
  nslookup google.com
  host google.com
  dig google.com
  ```
  `dnsmasq` là dịch vụ cache DNS sử dụng tệp cấu hình ở `/etc/dnsmasq.conf`

## Quản lý đường đi của dải mạng

- Câu lệnh sử dụng: `ip`
- Thư mục cấu hình: `/etc/NetworkManager/`

Để kiểm tra các đường đi của giải mạng, bạn cần chạy câu lệnh:

```bash
$ route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         192.168.0.1     0.0.0.0         UG    600    0        0 wlp3s0
192.168.0.0     0.0.0.0         255.255.255.0   U     600    0        0 wlp3s0

# hoặc câu lệnh này
$  ip route show
default via 192.168.0.1 dev wlp3s0 proto dhcp src 192.168.0.40 metric 600
192.168.0.0/24 dev wlp3s0 proto kernel scope link src 192.168.0.40 metric 600
```

- channel bonding

## Ngặn chặn / Cho phép kết nối dải mạng

- Câu lệnh sử dụng: `iptables`, `nft`

## Đọc thêm:

- Tài liệu hướng dẫn của các câu lệnh, dịch vụ
  ```bash
  man nmcli
  man nmcli-examples
  man NetworkManager.conf
  ```


---

> Tác giả: [Đồng](https://vanvuvuong.github.io)  
> URL: https://vanvuvuong.github.io/bai-viet/mang-trong-linux/  

