# GPG Cơ Bản


Bài này bao gồm những nội dung:

- GPG là gì? Đạt được mục đích khi sử dụng?
- Những hướng dẫn sử dụng cơ bản
- Cấu hình tốt nhất (nên) áp dụng
- Một vài ví dụ cụ thể
  Thư mục cần cấu hình:

- `GNUPGHOME=~/.gnupg`

## Dẫn nhập

Trong thế giới bảo mật sẽ chia làm nhiều phần với những mục đích khác nhau, mỗi một danh mục nhỏ lại có thể chia ra hàng tá những danh mục nhỏ hơn và sẽ khiến ta rối đầu với những danh mục & khái niệm đó. Hôm nay chúng ta sẽ chỉ quan tâm đến 2 phân mục rất nhỏ, đó là mã băm (hash) và mã hóa (encryption).

### Mã băm (hashing)

Mỗi một máy tính sẽ bao gồm rất nhiều ty tỷ phần mềm, tệp, thư viện, ... sử dụng kết hợp với nhau để có thể "điều hành" phần cứng của chiếc máy tính. Mỗi khi chúng ta trao đổi những thứ nhạy cảm như vậy qua mạng Internet, chúng ta cần chắc chắn rằng, những gì người lập trình viên tạo ra sau đó họ gửi lên mạnh chính xác 100% với những gì chúng ta tìm kiếm & tải xuống.

Đó là khi mã băm được phát minh ra. Mỗi một chữ, tệp, gói, hay phần mềm đều có một mã băm đặc biệt và không hề giống nhau:

```bash
kris@fedora:~$ echo "ví dụ" | sha256sum
9737a22a063c9c8219a2b6c024cf20ecb33163be41f891885280d1d4350dca1f  -
kris@fedora:~$ echo "ví dụ " | sha256sum
250eefdd4605412b81e927612d83e49332d8a53c9286386f3bbdef796554c901  -
```

Như các bạn có thể thấy, sự khác biệt của 2 từ chỉ là dấu cách đã cho ra một chuỗi mã băm khác nhau. Điều này đảm bảo việc người lập trình tạo một thứ và chia sẻ cho người khác dùng sẽ được đảm bảo là không bị thay đổi trong qua trình gửi/nhận trên mạng.

### Mã hóa (encryption)

Khác với mục đích sử dụng của mã băm, mã hóa là một biện pháp sử dụng để chỉ người có đúng quyền hạn nhất định mới có thể đọc được nội dung của một mẩu tin, tệp,...

Mục đích của mã hóa là khiến cho một nội dung dễ hiểu trở nên khó hiểu cho máy tính và con người, chỉ người biết cách giải mới có thể "biến" nó thành một nội dung dễ hiểu trở lại.

Với những công cụ mã hóa, sẽ có 2 kiểu mã hóa được hình thành: đối xứng và bất đối xứng.

- Đối xứng có nghĩa là cùng một mẩu thông tin sẽ được mã hóa và giải mã theo cùng một cách, ví dụ như đặt mật khẩu khóa & nhập mật khẩu để mở khóa, sử dụng một thuật toán ngẫu nhiên để xáo trộn thông tin & dùng cách tương tự để giải
- Bất đối xứng nghĩa là mã hóa dùng một phương pháp A, nhưng giải mã lại dùng phương pháp B.

Mỗi một kiểu mã hóa sẽ có những lợi/bất lợi riêng, hãy xem bảng sau để hiểu rõ:

## GPG là gì?

Gnu Privacy Guard là một công cụ dùng để mã hóa (đối xứng hoặc bất đối xứng) một tệp, gói hoặc một tin nhắn,... bằng thuật toán đối xứng hay bất đối xứng. Ngoài công dụng này ra, GPG còn có thể sử dụng để xác nhận xem một tin nhắn, tệp hay gói,... có phải đã được tạo ra bởi một cá nhân/tổ chức nào đó hay không bằng cách kiểm tra `chữ ký số` (digital signature).

Không giống với mã băm (chỉ có tác dụng xác định xem một tệp,... có bị sửa đổi hay không), chữ ký số - cũng giống như chữ ký - mang đặc trưng định danh nhiều hơn, nghĩa là xác định cái gì đó có phải được tạo ra từ một cá nhân/tổ chức cụ thể hay không, đồng thời nó cũng có tác dụng xác định tính toàn vẹn của tin nhắn, tệp, gói,...

- Sử dụng GPG với thuật toán đối xứng có thể sử dụng như ví dụ sau:

  ```bash
  kris@fedora:/tmp/gpg$ echo "ví dụ " > test
  kris@fedora:/tmp/gpg$ cat test
  ví dụ
  kris@fedora:/tmp/gpg$ gpg --symmetric test
  # Một cửa sổ sẽ hiện lên để điền cụm từ bảo mật(passphrase)
  kris@fedora:/tmp/gpg$ ll
  total 8
  -rw-r--r--. 1 kris kris 10 Nov 18 14:33 test
  -rw-r--r--. 1 kris kris 84 Nov 18 14:34 test.gpg
  kris@fedora:/tmp/gpg$ gpg --decrypt test.gpg
  # Một cửa sổ sẽ hiện lên để điền cụm từ bảo mật
  gpg: AES256.CFB encrypted data
  gpg: encrypted with 1 passphrase
  ví dụ
  ```

## GPG với thuật toán bất đối xứng

- Những khái niệm cần nắm:
  - Khóa công khai (public key): là khóa dùng để mã hóa tệp tin, lý tưởng nhất là người bạn muốn trò chuyện, trao đổi có thể xem/tải khóa này về được.
  - Khóa riêng tư (private key): là khóa dùng để giải mã, cần lưu trữ cẩn thận không được chia sẻ cho ai, cài cụm từ bảo mật mạnh (strong passphrase)
  - Khóa chủ (master key): là khóa mẹ dùng để tạo ra một cặp khóa riêng tư/công khai con
  - Khóa con (subkey): là khóa con, sẽ có thuộc về một khóa chủ nào đó sử dụng để mã hóa/giải mã (có thể là khóa chủ riêng tư/công khai)

Khi tạo cặp khóa riêng tư/công khai bằng câu lệnh, GPG sẽ tạo ra một chiếc khóa chủ (master key) cùng với một cặp khóa riêng tư/công khai con (private/public subkey).

### Ví dụ minh họa:

Mục đích đằng sau thiết kế phức tạp này là để giảm thiểu rủi ro cho khóa chủ, tối ưu việc sử dụng nhiều cặp khóa riêng tư/công khai con. Mỗi một khóa chủ có thể tạo ra một định danh cho nhiều cặp khóa riêng tư/công khai con dùng cho mục đích mã hóa/giải mã trên nhiều thiết bị khác nhau.

Ví dụ như bạn có 3 thiết bị, 1 cái là máy tính cá nhân, 1 là máy tính công ty và 1 là máy tính cho việc viết báo, vậy bạn sẽ quản lý chúng như thế nào:

- việc tạo 3 cặp khóa khác nhau trên 3 máy không thể đảm bảo đồng bộ dữ liệu giữa các máy được, vì mỗi cặp khóa lại có khóa công khai khác nhau nên cần cặp khóa riêng tư khác nhau để giải mã.
- việc tạo 1 cặp khóa rồi chia sẻ giữa các máy lại mang lại rủi ro nếu một trong những thiết bị bị mất/trộm thì bắt buộc phải tạo một cặp khóa mới để sử dụng.
- giải pháp tốt nhất là sử dụng mô hình sau:

  - tạo một khóa chủ trên một máy (trong quá trình này sẽ tự động tạo ra cặp khóa riêng tư/công khai con), liệt kê những khóa riêng tư, công khai ngay khi mới tạo khóa

    ```bash
    kris@fedora:/tmp/gpg$ export GNUPGHOME=/tmp/gpg # để tách biệt thư mục mặc định với khóa hiện tại mình đang dùng
    kris@fedora:/tmp/gpg$ gpg --full-generate-key
    gpg: WARNING: unsafe permissions on homedir '/tmp/gpg'
    gpg (GnuPG) 2.4.7; Copyright (C) 2024 g10 Code GmbH
    This is free software: you are free to change and redistribute it.
    There is NO WARRANTY, to the extent permitted by law.

    Please select what kind of key you want:
      (1) RSA and RSA
      (2) DSA and Elgamal
      (3) DSA (sign only)
      (4) RSA (sign only)
      (9) ECC (sign and encrypt) *default*
      (10) ECC (sign only)
      (14) Existing key from card
    Your selection? 9
    Please select which elliptic curve you want:
      (1) Curve 25519 *default*
      (4) NIST P-384
      (6) Brainpool P-256
    Your selection? 1
    Please specify how long the key should be valid.
            0 = key does not expire
          <n>  = key expires in n days
          <n>w = key expires in n weeks
          <n>m = key expires in n months
          <n>y = key expires in n years
    Key is valid for? (0) 1y
    Key expires at Wed 18 Nov 2026 02:50:02 PM +07
    Is this correct? (y/N) y

    GnuPG needs to construct a user ID to identify your key.

    Real name: khoa-vi-du
    Email address: vi-du@gnupg.org
    Comment: Khoa vi du minh hoa
    You selected this USER-ID:
        "khoa-vi-du (Khoa vi du minh hoa) <vi-du@gnupg.org>"

    Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? o
    # Một cửa sổ sẽ hiện lên để điền cụm từ bảo mật
    We need to generate a lot of random bytes. It is a good idea to perform
    some other action (type on the keyboard, move the mouse, utilize the
    disks) during the prime generation; this gives the random number
    generator a better chance to gain enough entropy.
    We need to generate a lot of random bytes. It is a good idea to perform
    some other action (type on the keyboard, move the mouse, utilize the
    disks) during the prime generation; this gives the random number
    generator a better chance to gain enough entropy.
    gpg: /tmp/gpg/trustdb.gpg: trustdb created
    gpg: directory '/tmp/gpg/openpgp-revocs.d' created
    gpg: revocation certificate stored as '/tmp/gpg/openpgp-revocs.d/B94F9101C1665938968DAF797B314495163FC656.rev'
    public and secret key created and signed.

    pub   ed25519 2025-11-18 [SC] [expires: 2026-11-18]
          B94F9101C1665938968DAF797B314495163FC656
    uid                      khoa-vi-du (Khoa vi du minh hoa) <vi-du@gnupg.org>
    sub   cv25519 2025-11-18 [E] [expires: 2026-11-18]

    kris@fedora:/tmp/gpg$ gpg --list-secret-keys --with-subkey-fingerprint
    gpg: WARNING: unsafe permissions on homedir '/tmp/gpg'
    /tmp/gpg/pubring.kbx
    --------------------
    sec   ed25519 2025-11-18 [SC] [expires: 2026-11-18]
          B94F9101C1665938968DAF797B314495163FC656
    uid           [ultimate] khoa-vi-du (Khoa vi du minh hoa) <vi-du@gnupg.org>
    ssb   cv25519 2025-11-18 [E] [expires: 2026-11-18]
          0101992D9DC2FC203CAA254D4A9D2D0DB3A5612B

    kris@fedora:/tmp/gpg$ gpg --list-keys --with-subkey-fingerprint
    gpg: WARNING: unsafe permissions on homedir '/tmp/gpg'
    /tmp/gpg/pubring.kbx
    --------------------
    pub   ed25519 2025-11-18 [SC] [expires: 2026-11-18]
          B94F9101C1665938968DAF797B314495163FC656
    uid           [ultimate] khoa-vi-du (Khoa vi du minh hoa) <vi-du@gnupg.org>
    sub   cv25519 2025-11-18 [E] [expires: 2026-11-18]
          0101992D9DC2FC203CAA254D4A9D2D0DB3A5612B

    kris@fedora:/tmp/gpg$
    ```

    > Một khóa chủ + cặp mã khóa riêng tư/công khai vừa được tạo với "mã vân tay"(fingerprint) lần lượt là khóa chủ `B94F9101C1665938968DAF797B314495163FC656`, khóa riêng tư/công khai `0101992D9DC2FC203CAA254D4A9D2D0DB3A5612B`

  - tạo thêm 2 khóa con riêng tư cho 2 máy khác để mã hóa bằng cách chỉnh sửa khóa chủ có mã vân tay `B94F9101C1665938968DAF797B314495163FC656` (trong quá trình này sẽ tự động tạo ra 2 cặp khóa công khai con tương ứng)

    ```bash
    kris@fedora:/tmp/gpg$ gpg --edit-key B94F9101C1665938968DAF797B314495163FC656
    gpg: WARNING: unsafe permissions on homedir '/tmp/gpg'
    gpg (GnuPG) 2.4.7; Copyright (C) 2024 g10 Code GmbH
    This is free software: you are free to change and redistribute it.
    There is NO WARRANTY, to the extent permitted by law.

    Secret key is available.

    sec  ed25519/7B314495163FC656
        created: 2025-11-18  expires: 2026-11-18  usage: SC
        trust: ultimate      validity: ultimate
    ssb  cv25519/4A9D2D0DB3A5612B
        created: 2025-11-18  expires: 2026-11-18  usage: E
    [ultimate] (1). khoa-vi-du (Khoa vi du minh hoa) <vi-du@gnupg.org>

    gpg> addkey
    Please select what kind of key you want:
      (3) DSA (sign only)
      (4) RSA (sign only)
      (5) Elgamal (encrypt only)
      (6) RSA (encrypt only)
      (10) ECC (sign only)
      (12) ECC (encrypt only)
      (14) Existing key from card
    Your selection? 12
    Please select which elliptic curve you want:
      (1) Curve 25519 *default*
      (4) NIST P-384
      (6) Brainpool P-256
    Your selection? 1
    Please specify how long the key should be valid.
            0 = key does not expire
          <n>  = key expires in n days
          <n>w = key expires in n weeks
          <n>m = key expires in n months
          <n>y = key expires in n years
    Key is valid for? (0) 1y
    Key expires at Wed 18 Nov 2026 03:02:44 PM +07
    Is this correct? (y/N) y
    Really create? (y/N) y
    # Một cửa sổ sẽ hiện lên để điền cụm từ bảo mật
    We need to generate a lot of random bytes. It is a good idea to perform
    some other action (type on the keyboard, move the mouse, utilize the
    disks) during the prime generation; this gives the random number
    generator a better chance to gain enough entropy.

    sec  ed25519/7B314495163FC656
        created: 2025-11-18  expires: 2026-11-18  usage: SC
        trust: ultimate      validity: ultimate
    ssb  cv25519/4A9D2D0DB3A5612B
        created: 2025-11-18  expires: 2026-11-18  usage: E
    ssb  cv25519/35D0125B7F62907E
        created: 2025-11-18  expires: 2026-11-18  usage: E
    [ultimate] (1). khoa-vi-du (Khoa vi du minh hoa) <vi-du@gnupg.org>

    gpg> addkey
    Please select what kind of key you want:
      (3) DSA (sign only)
      (4) RSA (sign only)
      (5) Elgamal (encrypt only)
      (6) RSA (encrypt only)
      (10) ECC (sign only)
      (12) ECC (encrypt only)
      (14) Existing key from card
    Your selection? 12
    Please select which elliptic curve you want:
      (1) Curve 25519 *default*
      (4) NIST P-384
      (6) Brainpool P-256
    Your selection? 1
    Please specify how long the key should be valid.
            0 = key does not expire
          <n>  = key expires in n days
          <n>w = key expires in n weeks
          <n>m = key expires in n months
          <n>y = key expires in n years
    Key is valid for? (0) 1y
    Key expires at Wed 18 Nov 2026 03:03:01 PM +07
    Is this correct? (y/N) y
    Really create? (y/N) y
    # Một cửa sổ sẽ hiện lên để điền cụm từ bảo mật
    We need to generate a lot of random bytes. It is a good idea to perform
    some other action (type on the keyboard, move the mouse, utilize the
    disks) during the prime generation; this gives the random number
    generator a better chance to gain enough entropy.

    sec  ed25519/7B314495163FC656
        created: 2025-11-18  expires: 2026-11-18  usage: SC
        trust: ultimate      validity: ultimate
    ssb  cv25519/4A9D2D0DB3A5612B
        created: 2025-11-18  expires: 2026-11-18  usage: E
    ssb  cv25519/35D0125B7F62907E
        created: 2025-11-18  expires: 2026-11-18  usage: E
    ssb  cv25519/2669A0060F0D7ACA
        created: 2025-11-18  expires: 2026-11-18  usage: E
    [ultimate] (1). khoa-vi-du (Khoa vi du minh hoa) <vi-du@gnupg.org>
    gpg> save
    ```

  - liệt kê các khóa 1 lần nữa, xuất 1 khóa chủ, 3 khóa riêng tư con và khóa công khai ra thành những tệp

    ```bash
    kris@fedora:/tmp/gpg$ gpg --list-secret-keys --with-subkey-fingerprint
    gpg: WARNING: unsafe permissions on homedir '/tmp/gpg'
    /tmp/gpg/pubring.kbx
    --------------------
    sec   ed25519 2025-11-18 [SC] [expires: 2026-11-18]
          B94F9101C1665938968DAF797B314495163FC656
    uid           [ultimate] khoa-vi-du (Khoa vi du minh hoa) <vi-du@gnupg.org>
    ssb   cv25519 2025-11-18 [E] [expires: 2026-11-18]
          0101992D9DC2FC203CAA254D4A9D2D0DB3A5612B
    ssb   cv25519 2025-11-18 [E] [expires: 2026-11-18]
          7D42F1C441FBD540E631259F35D0125B7F62907E
    ssb   cv25519 2025-11-18 [E] [expires: 2026-11-18]
          2C05E3354FEC3496C3B14B522669A0060F0D7ACA

    kris@fedora:/tmp/gpg$ gpg --armor --output vidu-khoa-chu.gpg --export-secret-keys B94F9101C1665938968DAF797B314495163FC656 # hoặc sử dụng `vi-du@gnupg.org` thay cho mã vân tay
    gpg: WARNING: unsafe permissions on homedir '/tmp/gpg'
    # Một cửa sổ sẽ hiện lên để điền cụm từ bảo mật
    kris@fedora:/tmp/gpg$ gpg --armor --output vidu-khoa-rieng-tu-may-1.gpg --export-secret-subkeys 0101992D9DC2FC203CAA254D4A9D2D0DB3A5612B
    gpg: WARNING: unsafe permissions on homedir '/tmp/gpg'
    # Một cửa sổ sẽ hiện lên để điền cụm từ bảo mật
    kris@fedora:/tmp/gpg$ gpg --armor --output vidu-khoa-rieng-tu-may-2.gpg --export-secret-subkeys 7D42F1C441FBD540E631259F35D0125B7F62907E
    gpg: WARNING: unsafe permissions on homedir '/tmp/gpg'
    # Một cửa sổ sẽ hiện lên để điền cụm từ bảo mật
    kris@fedora:/tmp/gpg$ gpg --armor --output vidu-khoa-rieng-tu-may-3.gpg --export-secret-subkeys 2C05E3354FEC3496C3B14B522669A0060F0D7ACA
    gpg: WARNING: unsafe permissions on homedir '/tmp/gpg'
    # Một cửa sổ sẽ hiện lên để điền cụm từ bảo mật
    kris@fedora:/tmp/gpg$ gpg --armor --output vidu-khoa-cong-khai.gpg --export vi-du@gnupg.org
    gpg: WARNING: unsafe permissions on homedir '/tmp/gpg'
    kris@fedora:/tmp/gpg$ ll | grep gpg
    -rw-r--r--. 1 kris kris    84 Nov 18 14:34 test.gpg
    -rw-------. 1 kris kris  1280 Nov 18 14:52 trustdb.gpg
    -rw-------. 1 kris kris  1641 Nov 18 15:08 vidu-khoa-chu.gpg
    -rw-r--r--. 1 kris kris  1189 Nov 18 15:11 vidu-khoa-cong-khai.gpg
    -rw-------. 1 kris kris  1540 Nov 18 15:09 vidu-khoa-rieng-tu-may-1.gpg
    -rw-------. 1 kris kris  1540 Nov 18 15:10 vidu-khoa-rieng-tu-may-2.gpg
    -rw-------. 1 kris kris  1540 Nov 18 15:10 vidu-khoa-rieng-tu-may-3.gpg
    ```

  - xóa khóa chủ, và các khóa riêng tư con trên máy vừa tạo
  - nhập lại từng khóa riêng tư con và khóa công khai lên từng máy
  - nhập khóa chủ và khóa công khai vào thiết bị khóa bảo mật (security key) (nếu có)


---

> Tác giả: [Đồng](https://vanvuvuong.github.io)  
> URL: https://vanvuvuong.github.io/bai-viet/gpg-co-ban/  

