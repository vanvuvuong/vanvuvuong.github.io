# Những Điều Cơ Bản Về Bash & Fish Shell Trong Linux


## Bash/Shell

### Biến đặc biệt

| Symbol    | Meaning                                                  |
| --------- | -------------------------------------------------------- |
| $0        | Tên của script Bash.                                     |
| $1-$9     | 9 tham số đầu tiên truyền vào script Bash.               |
| $#        | Số lượng tham số được truyền vào script.                 |
| $@        | Toàn bộ tham số truyền vào script.                       |
| $?        | Mã thoát (exit status) của tiến trình vừa chạy gần nhất. |
| $$        | PID của script hiện tại.                                 |
| $USER     | Tên user đang chạy script.                               |
| $HOSTNAME | Hostname của máy đang chạy script.                       |
| $SECONDS  | Số giây tính từ khi script bắt đầu.                      |
| $RANDOM   | Trả về một số ngẫu nhiên khác nhau mỗi lần gọi.          |
| $LINENO   | Trả về số dòng hiện tại trong script Bash.               |

### Từ khóa trong bash shell

| -    | -    | -      | -      | -        | -    |
| ---- | ---- | ------ | ------ | -------- | ---- |
| if   | then | elif   | else   | fi       | time |
| for  | in   | until  | while  | do       | done |
| case | esac | coproc | select | function |
| {    | }    | [[     | ]]     | !        |

### Biểu thức

- Cách đánh giá biểu thức:

  - `test` expression
  - [[expression]]

- Toán tử:

  - `&&`: chạy lệnh tiếp theo nếu lệnh trước đó thành công

    Ví dụ:

    ```shell
    test -d "$directory" && cd "$directory"
    ```

  * `||`: run next command if the previous is failed

    Ví dụ:

    ```shell
    cd "$directory" && echo "Success" || echo "Failed"
    ```

### Ý nghĩa của mã thoát Bash (exit status code)

| Mã thoát Bash | Ý nghĩa                                                              |
| ------------- | -------------------------------------------------------------------- |
| 0             | (câu lệnh chạy) thành công                                           |
| 1             | (câu lệnh chạy) thất bại, theo định nghĩa của chương trình (program) |
| 2             | Câu lệnh sử dụng sai cách                                            |
| mã khác       | Mã tùy biến của chương trình                                         |

Source: [Exit & Error Codes in bash and Linux OS](https://www.adminschoice.com/exit-error-codes-in-bash-and-linux-os)

### Làm chủ kết quả (xuất hiện) trên màn hình Linux (stdout)

|             | hiển thị ở cửa sổ câu lệnh |                         | hiển thị trong tệp |                 | (nếu) tệp tồn tại |
| ----------- | -------------------------: | :---------------------- | -----------------: | :-------------- | ----------------: |
| **Cú pháp** | **Kết quả thường(stdout)** | **Kết quả lỗi(stderr)** | **Kết quả thường** | **Kết quả lỗi** |           **tệp** |
| >           |                      không | có                      |                 có | không           |            ghi đè |
| >>          |                      không | có                      |                 có | không           |     chèn vào cuối |
| 2>          |                         có | không                   |              không | có              |            ghi đè |
| 2>>         |                         có | không                   |              không | có              |     chèn vào cuối |
| &>          |                      không | không                   |                 có | có              |            ghi đè |
| &>>         |                      không | không                   |                 có | có              |     chèn vào cuối |
| tee         |                         có | có                      |                 có | không           |            ghi đè |
| tee -a      |                         có | có                      |                 có | không           |     chèn vào cuối |
| n.e. (\*)   |                         có | có                      |              không | có              |            ghi đè |
| n.e. (\*)   |                         có | có                      |              không | có              |     chèn vào cuối |
| & tee       |                         có | có                      |                 có | có              |            ghi đè |
| & tee -a    |                         có | có                      |                 có | có              |     chèn vào cuối |

Giải thích thêm:

- `command > output.txt`

  Kết quả tiêu chuẩn sẽ chỉ được chuyển hướng đến tệp, không hiển thị trong cửa sổ câu lệnh. Nếu tệp đã tồn tại thì nó sẽ bị ghi đè.

- `command >> output.txt`

  Kết quả tiêu chuẩn sẽ chỉ được chuyển hướng đến tệp, không hiển thị trong cửa sổ câu lệnh. Nếu tệp đã tồn tại thì nó sẽ được chèn vào cuối.

---

- `command 2> output.txt`

  Kết quả lỗi sẽ chỉ được chuyển hướng đến tệp, không hiển thị trong cửa sổ câu lệnh. Nếu tệp đã tồn tại thì nó sẽ bị ghi đè.

- `command 2>> output.txt`

  Kết quả lỗi sẽ chỉ được chuyển hướng đến tệp, không hiển thị trong cửa sổ câu lệnh. Nếu tệp đã tồn tại thì nó sẽ được chèn vào cuối.

---

- `command &> output.txt`

  Kết quả tiêu chuẩn và lỗi sẽ chỉ được chuyển hướng đến tệp, không hiển thị trong cửa sổ câu lệnh. Nếu tệp đã tồn tại thì nó sẽ bị ghi đè.

- `command &>> output.txt`

  Kết quả tiêu chuẩn và lỗi sẽ chỉ được chuyển hướng đến tệp, không hiển thị trong cửa sổ câu lệnh. Nếu tệp đã tồn tại thì nó sẽ được chèn vào cuối.

---

- `command | tee output.txt`

  Kết quả tiêu chuẩn sẽ chỉ được sao chép đến tệp, và vẫn hiển thị trong cửa sổ câu lệnh. Nếu tệp đã tồn tại thì nó sẽ bị ghi đè.

- `command | tee -a output.txt`

  Kết quả tiêu chuẩn sẽ chỉ được sao chép đến tệp, và vẫn hiển thị trong cửa sổ câu lệnh. Nếu tệp đã tồn tại thì nó sẽ được chèn vào cuối.

---

- `command |& tee output.txt`

  Kết quả tiêu chuẩn và lỗi sẽ chỉ được sao chép đến tệp, và vẫn hiển thị trong cửa sổ câu lệnh. Nếu tệp đã tồn tại thì nó sẽ bị ghi đè.

- `command |& tee -a output.txt`

  Kết quả tiêu chuẩn và lỗi sẽ chỉ được sao chép đến tệp, và vẫn hiển thị trong cửa sổ câu lệnh. Nếu tệp đã tồn tại thì nó sẽ được chèn vào cuối.

[**Original Post**](https://askubuntu.com/questions/420981/how-do-i-save-terminal-output-to-a-file)

### Điều khỉển kết quả (xuất hiện trên cửa sổ câu lệnh)

- `> /dev/null` bỏ đi kết quả tiêu chuẩn
- `1> /dev/null` bỏ đi kết quả tiêu chuẩn
- `2> /dev/null` bỏ đi kết quả lỗi
- `&> /dev/null` bỏ đi kết quả tiêu chuẩn và kết quả lỗi

### Bash error code meaning

| Exit Code Number | Meaning                               | Examples         | Comments                                                     |
| ---------------- | ------------------------------------- | ---------------- | ------------------------------------------------------------ |
| 1                | Lỗi chung                             | let "var1 = 1/0" | Lỗi ngẫu nhiên như chia 0, thao tác không hợp lệ             |
| 2                | Dùng sai shell builtin                |                  | Thiếu keyword/command, quyền chưa đủ, so sánh file lỗi, v.v. |
| _124_            | Cần quyền root                        |                  | Script hệ thống bị chạy bởi user không phải root             |
| _125_            | Chưa cấu hình                         |                  | Thiếu file cấu hình hoặc giá trị                             |
| 126              | Command gọi nhưng không thực thi được |                  | Không đủ quyền hoặc file không phải executable               |
| 127              | "command not found"                   |                  | PATH lỗi hoặc gõ sai                                         |
| 128              | Tham số exit không hợp lệ             | exit 3.14159     | exit chỉ nhận số nguyên 0–255                                |
| 128+n            | Lỗi do tín hiệu “n”                   | kill -9 $PPID    | 128+9=137                                                    |
| 130              | Script bị dừng bằng Ctrl-C            |                  | Ctrl-C là tín hiệu số 2 → 128+2=130                          |
| 255              | Exit status ngoài phạm vi             | exit -1          | exit chỉ nhận 0–255                                          |

Github source: [debian-server-tools](https://github.com/szepeviktor/debian-server-tools/blob/master/Bash-exit-codes.md)

Source: [Advanced Bash-Scripting Guide Appendix E.](https://www.tldp.org/LDP/abs/html/exitcodes.html) & [Appendix C. Exit Codes With Special Meanings](https://www.linuxdoc.org/LDP/abs/html/exitcodes.html)

Custom Exit Code Numbers are marked in _italic_.

### Condition

- IF#condition

  ```shell
  if [ -d "$directory" ] && cd "$directory"; then
      echo "Run command"
  fi
  ```

- IF-ELIF

  ```shell
  if [ -z $0 ]; then
      echo "Run command 1"
  elif [ -n $0 ]; then
      echo "Run command 2"
  fi
  ```

- IF-ELIF-ELSE

  ```shell
  if [ -z $0 ]; then
      echo "Run command 1"
  elif [ -n $0 ]; then
      echo "Run command 2"
  else
      echo "Run command 3"
  fi
  ```

- CASE

  ```shell
  case $# in
  3) ;; ## We need 3 args, so do nothing
  *)
      printf "%s\n" "Please provide three names" >&2
      exit 1
      ;;
  esac
  ```

- IF statement

  | Operator                   | Description                                                           |
  | -------------------------- | --------------------------------------------------------------------- |
  | ! EXPRESSION               | The EXPRESSION is false.                                              |
  | condition 1 -a condition 2 | CONDITION 1 and CONDITION 2.                                          |
  | condition 1 -o condition 2 | CONDITION 1 or CONDITION 2.                                           |
  | -n STRING                  | The length of STRING is greater than zero.                            |
  | -z STRING                  | lengh of STRING is zero (ie it is empty).                             |
  | STRING1 =/!= STRING2       | STRING1 is equal/not-equal to STRING2                                 |
  | INTEGER1 -eq/ne INTEGER2   | INTEGER1 is numerically equal/not-equal to INTEGER2                   |
  | INTEGER1 -gt/lt INTEGER2   | INTEGER1 is numerically greater than or less than INTEGER2            |
  | INTEGER1 -ge/le INTEGER2   | INTEGER1 is numerically greater-than/less-than or equal to INTEGER2   |
  | -b/c FILE                  | FILE is a block/character device.                                     |
  | -d/f/p/S FILE              | FILE exists and is a directory/regular-file/pipe/socket.              |
  | -e FILE                    | FILE exists.                                                          |
  | -h/L FILE                  | FILE is a symbolic link.                                              |
  | -s FILE                    | FILE exists and it's SIZE is greater than ZERO (ie. it is not empty). |
  | -r/w/x FILE                | FILE exists and read/write/execute permission is granted.             |
  | f1 -nt/ot/ef f2            | FILE 1 is newer-than/older-than/has-hard-link-to-same-file            |

Source: [Bash Script Tutorial - 5. If Statements](https://ryanstutorials.net/bash-scripting-tutorial/bash-if-statements.php) & [File test operators](https://tldp.org/LDP/abs/html/fto.html)

### Loop

- Read a file line by line assigning the value to a variable:

  ```shell
  while read -r line; do
      echo "Text read from file: $line"
  done < my_filename.txt
  ```

- Loop string in array:

  ```shell
  array=("string1" "string2")
  for string in ${array[@]}; do
      echo $string
  done
  ```

- Loop string in array with array index

  ```shell
  allThreads=("string1" "string2")
  for i in ${!allThreads[@]}; do
  echo ${allThreads[$i]}
  done
  ```

### Handy snippets

- Read a file line by line assigning the value to a variable

  ```shell
  while read -r line; do
      echo "Text read from file: $line"
  done < my_filename.txt
  ```

- Simple multiple files/folders maker

  ```shell
  mkdir -p project/{app,frontend,backend}
  touch {main,variables,provider}.tf
  ```

- Loop in a string array

  ```shell
  b=("aa" "ab"); for t in ${b[@]} ; do echo $t ; done
  echo ${#b[@]} # get array length
  ```

- Run multiple replicated command with multiple files

  ```shell
  for a in *.yml; ansible-playbook "$a" --syntax-check ; done
  ```

- Do multiple silent task

  ```shell
  for file in $(find /home/ec2-user/ -type f); do cmd1 $file | cmd2 &disown ; done
  ```

  ```shell
  command > file.log 2>&1 &
  ```

- Backgroud process to file (stdout + stderr)

  ```shell
  command > file.log 2>&1 &
  ```

  Explanation:

  - `>` stdout to file
  - `2>&1`: redirect stderr to stdout
  - `&`: run process in backgroud

- Update multiple files' name in 1 command

  ```shell
  find . -name "*_f"| sed "s/.\///g" | while read f ; do mv "$f" "${f%?????}_f"; done
  ```

- Manage IP tables

  ```shell
  iptables -P INPUT ACCEPT
  iptables -I INPUT 1 -p tcp -s 159.89.202.45 -j ACCEPT
  iptables -P FORWARD ACCEPT
  iptables -P OUTPUT ACCEPT
  iptables -P INPUT DROP
  ```

- `telnet`

  - Without interaction

  ```shell
  echo -e '\x1dclose\x0d' | telnet {$IP_ADDRESS} {$PORT}
  ```

  - Multiple IPs with SSH port

  ```shell
  PORT=22 list=("172.29.211.1" "172.29.211.2") ; for ip in "${list[@]}" ; do echo -e '\x1dclose\x0d' | timeout 2 telnet $ip {$PORT} && echo "connect $ip success" || echo "connect $ip failed" ; done
  ```

- `sed` common use cases

  - Replace string directly on file

  ```shell
  sed -i 's/pattern1/pattern2/g' filename
  ```

- Concatenate file common use cases

  - Insert multiple-lines text in to new file

  ```shell
  cat <<EOF > filename
  Multiple
  Lines
  Text
  Data
  EOF
  ```

  - Appending multiple-lines text in to existed file

  ```shell
  cat <<EOF >> filename
  Multiple
  Lines
  Text
  Data
  EOF
  ```

- Append text with sudoers (persistent mount point)

  ```shell
  echo -e "\nnfs-uuid:/  /mnt/efs nfs4 nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport,_netdev 0 0" | sudo tee -a /etc/fstab
  ```

- Append content to file with sudo privileges

  - Create multiple-lines text file as sudoer

  ```shell
  sudo tee /etc/systemd/system/custom-service.service > /dev/null <<-EOF
  # *****************************************************************
  # *********************** Custom Service **************************
  # *****************************************************************

  [Unit]
  Description=Custom Service
  After=network.target

  [Service]
  ExecStart=/start/script/for/custom-service
  ExecStop=/stop/script/for/custom-service
  User=root

  [Install]
  WantedBy=multi-user.target
  EOF
  ```

  - Create json file with variable in bash

  ```shell
  SAMPLE='
  {
      "Comment": "Update DNSName.",
      "Changes": [
          {
              "Action": "UPSERT",
              "ResourceRecordSet": {
                  "Name": "alex.",
                  "Type": "A",
                  "AliasTarget": {
                      "HostedZoneId": "-##",
                      "DNSName": "$bar",
                      "EvaluateTargetHealth": false
                  }
              }
          }
      ]
  }
  '
  echo "${SAMPLE}" | tee output-file-path.json > /dev/null
  ```

- Trim 2 last string

  ```shell
  new_string=${string%??}
  ```

- Convert string to array

  ```shell
  IFS=" " read -a array <<< "1 2 3 4"
  ```

  ```shell
  array=($(echo "one,two,three" | tr ',' '\n'))
  ```

## Fish/Shell

### Từ khóa trong fish shell

| -       | -        | -      | -       | -     |
| ------- | -------- | ------ | ------- | ----- |
| and     | begin    | break  | builtin | case  |
| command | continue | else   | end     | exec  |
| for     | function | if     | in      | not   |
| or      | return   | switch | time    | while |

### Fish builtins

| -           | -         | -      | -      | -           |
| ----------- | --------- | ------ | ------ | ----------- |
| abbr        | argparse  | bind   | cd     | commandline |
| complete    | contains  | count  | echo   | eval        |
| fish_config | math      | printf | random | read        |
| set         | set_color | source | status | string      |
| test        | type      |        |        |             |

## Những câu lệnh cơ bản trong Linux

### Người dùng & Nhóm

```shell
chage
chgrp
chown
chfn
id
passwd
su
useradd
userdel
usermod
who
whoami
```

### Tệp & Thư mục

```shell
chattr
chmod
file
find
ln
locate
ls
lsof
mkdir
mv
pwd
rm
rmdir
rename
tar
touch
tree
zip/unzip/gzip
```

### (kiểm soát) Đầu vào/kết quả tiêu chuẩn

```shell
awk
cat
cut
diff
grep
head
jq
less
more
nano
sed
sort
tail
tee
uniq
vi
vim
watch
wc
```

### Đĩa & phân vùng

```shell
blkid
dd
df
du
duc
fdisk
mkisofs
mkswap
mount
```

### (quản lý) Mạng

```shell
arp
curl
dig
dnf
ftp
hostname
hostnamectl
ifconfig
iostat
ip
iptables
lftp
lpadmin
lpstat
nc
netstat
nmap
nmtui
nslookup
ping
rsync
scp
sftp
ss
ssh
telnet
traceroute
wget
```

### (quản lý) Tiến trình & Dịch vụ

```shell
at
crontab
dmesg
free
htop
kill
lsof
nice
pgrep
pkill
ps
pstree
renice
sar
service
systemctl
top
vmstat
w
```

### Câu lệnh hỗ trợ

```shell
apropos
cheat
history
info
man
tldr
```

### Quản lý gói/phần mềm

```shell
apk
apt
apt-get
dnf
pacman
rpm
yum
zypper
```

### Liên quan tới phần cứng

```shell
arch
dmidecode
lsblk
lscpu
lsmem
lspci
lsusb
```

### Mã băm

```shell
cksum
md5sum
sha1sum
sha224sum
sha256sum
sha384sum
sha512sum
shasum
```

### Mã hóa

```shell
gpg
gpgv
ssh-keygen
```

### Khác

```shell
alias
date
figlet
last
lastb
make
poweroff
reboot
screen
shutdown
timedatectl
unalias
uptime
```


---

> Tác giả: [Kaizen Teams](https://vanvuvuong.github.io)  
> URL: https://vanvuvuong.github.io/bai-viet/khoa-hoc-may-tinh/linux-shell/  

