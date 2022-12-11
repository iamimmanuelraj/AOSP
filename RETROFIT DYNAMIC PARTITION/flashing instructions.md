1) Download the recovery file from [HERE](https://t.me/yaa2g/164260)

2) Then go to fastboot and enter this command

fastboot flash boot boot.img

3)  Now "fastboot reboot recovery"

4) In recovery go to advanced options

5) then go to fastboot (NOT BOOTLOADER)

6) Download super_empty.img from [HERE](https://github.com/PixelExperience-Devices/device_xiaomi_jasmine_sprout/releases/download/v1.0.0/super_empty.img)

7) enter this command "fastboot wipe-super super_empty.img"

8)finally back to recovery, install rom with adb sideload
