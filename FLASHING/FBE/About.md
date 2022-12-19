# FBE and it's FAQ's!

Introduction 
-- Since I (Immanuel) made FBE ROM's in `jasmine_sprout` AKA `MI A2` (in ROM's i release - ArrowOS, PE and PEX), people have been wondering about FBE and details regarding What is FBE, Why was FBE added in the first place, Do I need to format data everytime etc etc! People have so many Questions, FAQ's and un-answered questions about FBE so I'll try to address some of your doubts and questions regarding FBE!

What is FBE? 
- FBE Stands for "File Based Encryption" and File-based encryption allows different files to be encrypted with different keys that can be unlocked independently. In Lay-man's language, FBE is a type of encryption which encrypts all files individually with different passwords you can say and you can unlock one file individually at a time. Android Supports FBE since Android 7.0! 

What is the difference Between FBE and FDE? 
- Full disk encryption (FDE) is encryption at the disk level where is FBE is an Encryption at File Level where individual files are encrypted! To know more about what is the difference between FBE and FDE, Kaiti Norton from E-Security Planet has written a great article on it, I've added it's link at the end in sources, you can check it out! 

VIDEO TUTORIAL - [HERE](https://m.youtube.com/playlist?list=PLQcIdsw6jRy3LQQiZggNOzu4gWpI8UFt1) [Credits to the respective author]

How to Flash an FBE ROM?
USING A PC
 1. Download and install adb drivers on your PC. [link](https://forum.xda-developers.com/t/official-tool-windows-adb-fastboot-and-drivers-15-seconds-adb-installer-v1-4-3.2588979/)
2. If already you have adb drivers then no need.
3. Download recovery image and zip.
4. Copy the recovery image into C:\adb folder in PC.
5. In the same folder, hold the SHIFT key and right-click on an empty space.
6. Select “Open PowerShell window here”.
7. Press Power + volume down button to boot into fastboot mode.
8. Type inside the Powershell window
fastboot devices
9.The command should return a device ID along with “fastboot” message.
10. Inside adb folder change the recovery name to recovery and let the .img remain as it is.
11. Then enter the following command, fastboot boot recovery.img
12. Then your phone will boot into recovery.
13. Copy the recovery.zip file into your phone and flash it.
14. Your phone will automatically reboot if you are installing orangefox recovery.
15. Done recovery installed!
16. Go to Wipe -> Format Data -> Type Yes
17. Clean flash the ROM and enjoy.

NOTE: Change to active slot before rebooting if you are using orangefox recovery 

USING A PHONE
1. Copy your Data to SD Card/PC 
2. Reboot to Recovery
3. Go to Wipe -> Format Data -> Type Yes
4. Flash OrangeFox or TWRP Recovery
5. Go to Wipe -> Format Data -> Type Yes
6. Clean Flash FBE Enabled ROM

`NOTE: Change to active slot before rebooting if you are using orangefox recovery`

# Some FAQ's
I tried to Flash a FBE Enabled ROM, but I got stuck on Recovery, What do I do? 

```
Reboot to Fastboot Mode
Flash Recovery using Fastboot Method (fastboot flash recovery recovery.img)
Format Data 
Clean Flash the ROM Again
```
Your issue should be resolved now!

Well I want to flash a FBE ROM but I don't want to format my Data, What do I do?
```
Flash the ROM (and gapps too if not included)
Flash DFE - get it from here 
Reboot
```
```
Note:
IMPORTANT - You need to format data the very first time when you flash the ROM and then flash DFE
 After this you can't encrypt your device, If you try to encrypt it, you'll get into bootloop, if you want to encrypt, you need to format data! Also, if you update any ROM, make sure you flash DFE everytime you dirty flash/update through OTA Updater! 
```

How to Revert to NON-FBE ROM?
```
Take a backup of your data again
Format Data 
Flash any Non-FBE ROM again! 
```

Can I flash Non FBE ROMs too through FBE Recovery? 
```
Absolutely, you can flash Non FBE ROMs through that too! 
```

Check this out!
https://github.com/iamimmanuelraj/AOSP/tree/main/ROMS

# Sources, References and Thanks!  
- [AOSP's Documentation Regarding FBE](https://source.android.com/security/encryption/file-based)
- [Kaiti Norton's Article Explaining Difference between FBE And FDE](https://www.esecurityplanet.com/threats/disk-vs-file-encryption-which-is-best-for-you/)

Thanks for Reading this! Hope you liked it
Inspired from Arnav,VikramAdithya
