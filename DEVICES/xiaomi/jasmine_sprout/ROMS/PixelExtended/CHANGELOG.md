# Android Updates Changelog

## Android 13 - 05.10.2023

- Added option for separate notification and ringtone volumes
- Enabled QR scanner shortcut in lock screen
- Enabled APK fs-verity fully
- Increased call volume steps (30 times press for full volume from 7 times)
- Checked proximity before using double tap to wake (Fixes unexpected wakeup when in pocket)
- Moved to speed-profile Wi-Fi-service dexopt to reduce RAM
- Used QUALCOMM common latest init scripts
- Disabled AVB
- Used AIDL DRM Clearkey HAL
- Added more color modes in settings>display>color modes
- Added CDSP symlinks for better CDSP support
- Updated Perf blobs
- Updated Alarm packages
- Switched to USB v1.3 (from 1.0-basic)
- Implemented new Wi-Fi and GPS drivers
- Updated HALs to match the latest Blobs version
- Disabled APEX
- Disabled and removed configstore
- Dexopted All Apps
- Removed OEM Unlock in settings>developer options
- Updated media configs
- Disabled logging for unnecessary items
- Fixed audio issues (echo | loud background)

## Android 13 - 09.04.2023

- Scarlet Kernel V8
- March Security Patch
- Fixed Pocket Mode
- Many underhood fixes and changes

## Android 13 - 23.02.2023

- Updated kernel to Scarlet v8
- Feb Update

## Android 13 - 28.11.2022

- Initial Official Release

## Android 12 - 14.09.2022

- Initial Official Release

## Android 11 - 30.11.2021

- CLEAN FLASH MUST
- Switched to kernel 4.4 (Nekokernel)
- Final Update for PEX Android 11 (Only Android 12 updates hereafter)
- OLD CAM
- DON'T CHANGE KERNEL (IF YOU WANT TO CHANGE, GO WITH OLD CAM KERNEL)
- ENCRYPTED

## Android 11 - 11.10.2021

- Disable sim 1/2 is HD capable notification
- Some aggressive optimization from Android Go for better battery and RAM management
- Some read/write optimization
- Cleaned/Added/Removed some system props for smoothness and optimization
- Don't Change kernel (Or else camera will not work)
- Kernel bumped to 4.19.206 WCS
- Merged latest CAF tag in kernel for sdm660 4.19

## Android 11 - 16.09.2021

- Clean flash recommended, Dirty flash is okay (If you face issues, do a clean flash)
- Removed Xiaomi parts
- Fixed WFD (Wi-Fi Display)(Screen Cast)
- Moved to QTI Perf (From Pixel perf)
- Don't change kernel (Or else camera will not work)
- Kernel bumped to 4.19.206 WCS
- Merged latest CAF tag in kernel for sdm660 4.19

## Android 11 - 27.08.2021

- Fixed Google assistant voice match issues
- Fixed Vilte (Works only on Jio)
- Increased Earpiece and all mic volumes
- Fixed echo in voip calls
- Updated Media and Drm blobs from phoenix_sprout
- Added back Xiaomi parts
- Art optimization
- Kernel bumped to 4.19.204
- Other optimizations (check git)
- Clean flash recommended, Dirty flash is okay

## Android 11 - 26.07.2021

- Fixed Battery drain issues
- Fixed battery usage/battery stats
- Updated wifi configs from latest sdm660 4.19 CAF tag
- Updated carrier configs from sdm660 4.19 latest CAF tag
- Reverted back to Curtana RIL blobs
- Merged latest sdm660 4.19 CAF tag in kernel
- Merged latest sub version from google
- Now device always has an updated vendor security patch (hax)
- Added some misc stuff to make the rom whole smoother

## Android 11 - 24.06.2021

- Fixed Video Calling Over LTE (Vilte : Tested on Airtel, Jio)
- Fix bad geekbench scores
- Turn on VoLTE and VoWifi for many regions
- Address SELinux Denials
- Add Thermal Profiles In battery
- Improve Audio & Vibration
- Improve Stability and Performance