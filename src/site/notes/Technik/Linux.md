---
{"dg-publish":true,"dg-path":"Tech/Linux.md","permalink":"/tech/linux/","tags":["knowledge-base"],"created":"2025-05-18T12:02:24.706+02:00","updated":"2025-05-20T20:20:17.876+02:00"}
---

## Folder structure
```
/bin - essential binaries for all users (like cd, bash)
/sbin - admin system binaries
/boot - files for booting (like the kernel)
/dev - device files (file-like access to (virtual) hardware)
	/dev/sda - first SATA drive
	/dev/random - random number generator
	/dev/null - no output, discard all input
	/dev/zero - infinite 0s
/etc - configuration files for programs
/home - home folders for each user (alias ~)
	/home/username - also contains userspace config files
/lib - system library files (needed for programs in /bin)
/lost+found - corrupted files after a crash will end here
/media - removable media (USB-Drives, CDs, etc.)
/mnt - manual mounting points (created by admins)
/opt - optional software
/proc - contains info about running processes
/root - home folder for root user
/tmp - temporary files (no guaranteed persistance)
/usr - user binaries and program data
	/usr/bin - userspace /bin (contains most programs)
	/usr/sbin - admin programs
	/usr/lib - library files
	/usr/share - documentation
	/usr/include - include files for compiling
/var - runtime information stored by programs (logs, cache)
	/var/log/wtmp - login history
```
## chmod
| Number | Permission | Sum   |
| ------ | ---------- | ----- |
| 0      | – – –      | 0+0+0 |
| 1      | – – x      | 0+0+1 |
| 2      | – w –      | 0+2+0 |
| 3      | – w x      | 0+2+1 |
| 4      | r – –      | 4+0+0 |
| 5      | r – x      | 4+0+1 |
| 6      | r w –      | 4+2+0 |
| 7      | r w x      | 4+2+1 |

Three groups:
1. One permission for the _owner,_ the person who created the file or folder.
2. One permission for all of the people in the same primary _group_ of the owner.
3. One permission for everyone else, which includes _unauthenticated and anonymous users_.

To change all directories under the current path to 755 (`drwxr-xr-x`), excluding dotfiles (recursive):
```bash
find . ! -path . ! -path '*/.*' -type d -exec chmod 755 '{}' \;
```

To change all files in the current path to 644 (`-rw-r--r--`), excluding dotfiles (recursive):
```bash
find . ! -path '*/.*' -type f -exec chmod 644 '{}' \;
```
## chown
[Chown Command in Linux (File Ownership) | Linuxize](https://linuxize.com/post/linux-chown-command/)
```bash
chown -R USER:GROUP ./ 
```
## which
Find out where binary lives
```bash
which curl
```
## Find process
```bash
ps -aux | grep [keyword]
```
- `-a`: show all processes (including root, system, etc.), not just the ones belonging to current user
 - `u`: show in "user oriented format", i.e. table with more information
 - `x`: show background processes and daemons without controlling terminal (tty)
## Find text in files
```bash
grep -HiRn [text] [files/folders]
```
- `-H`: print out filename of result
- `-i`: ignore case
- `-R`: recursive search in passed folders, follow symlinks
- `-n`: print line-number of result
## Find previous command
```bash
history | grep [command]
```
## Find text or files starting with minus -
Passing arguments which starts with a minus to a tool will be usually interpreted as an option. This creates a problem when you want to delete a filename or grep text starting with a minus.
Solution: Pass `--` to signify the end of the options.
```bash
ps --help | grep -- -a
rm -- --somefile.txt
```
Source: https://unix.stackexchange.com/a/87357
## Compress / extract zip files
```bash
tar -czf [filename/folder]
tar -xzf [filename]
```
"Compres Ze File" / "Xtract Ze File
- `-c`: compress
- `-x`: extract
- `-z`: use gzip
- `-f`: use file archive
## Show active network connections
```bash
netstat -tulpen
```
- `-t`: show TCP connections.
- `-u`: show UDP connections.
- `-l`: list only listening sockets.
- `-p`: show the PID and name of the program to which each socket belongs.
- `-e`: display extended information, including user ID and inode.
- `-n`: show numerical addresses instead of resolving hostnames.
## Show filesystems
```bash
df -Thal
```
- `-T`: show the file system type.
- `-h`: display sizes in a human-readable format (e.g., KB, MB, GB).
- `-a`: include all file systems, even those that are not currently mounted.
- `-l`: limit the output to local file systems only.
## Show disk usage
```bash
du -hs *
```
- `-h`: display sizes in a human-readable format (e.g., KB, MB, GB).
- `-s`: provide a summary of the disk usage for each specified file or directory, rather than listing the usage for each individual file within directories.
## Show files in current folder (detailed)
```bash
ls -lisah
```
- `-l`: Uses a long listing format, providing detailed information about each file and directory, such as permissions, number of links, owner, group, size, and modification date.
- `-i`: Shows the inode number for each file and directory.
- `-s`: Displays the size of each file in blocks.
- `-a`: Includes all files, even those that are hidden (files starting with a dot `.`).
- `-h`: Displays sizes in a human-readable format (e.g., KB, MB, GB).
## Logrotate

> [!WARNING]
> Does not work properly on CentOS6, but seems to work as intended on Ubuntu 24.04

https://linux.die.net/man/8/logrotate
Put a file (usually named after the program/logfile you are rotating) in `/etc/logrotate.d/`. For example: `/etc/logrotate.d/mosquitto`
```
/var/log/mosquitto/mosquitto.log {
    rotate 12
    monthly
    compress
    delaycompress
    size 100k
    nocreate
    missingok
    postrotate
        if invoke-rc.d mosquitto status > /dev/null 2>&1; then \
            invoke-rc.d mosquitto reload > /dev/null 2>&1; \
        fi;
    endscript
}

```
- `rotate 12`: keeps at most 12 versions of the file specified at the very beginning
- `monthly`: rotate on first run of the month (i.e. keep one file per month), can also be daily, weekly or yearly
- `compress`, `delaycompress`: compress rotated files after 2 rotations (i.e. keep file for current and last month uncompressed)
- `size`: rotate only if size is bigger than specified limit (100k = 100KiB, 100M = 100MiB, 100G = 100Gib)
- `nocreate`: logrotate does not create the new log file after rotating (the original program has to do it)
- `missingok`: don't raise an error if file is missing
- `postrotate`: what to do after rotation - we just kept the script, which was generated by mosquitto on install