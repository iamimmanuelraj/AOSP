# Android Updates Changelog

## Android 13 - 03.10.2023

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
- Updated HALS to match the latest Blobs version
- Disabled APEX
- Disabled and removed configstore
- Dexopted All Apps
- Removed OEM Unlock in settings>developer options
- Updated media configs
- Disabled logging for unnecessary items
- Fixed audio issues (echo | loud background)

## Android 13 - 20.05.2023

- Fixed USB Issues
- Enabled QR Code scanner lock screen shortcut
- Minor Fixes

## Android 13 - 28.04.2023

- Fixed Call Echo Issues
- Enabled more (and advanced) options in Google Camera GO that are prebuilt in the ROM
- Tweaked background app run limit and background cache
- Disabled Ripple animation on unlock (Because it was Buggy and Laggy)
- Made the OS as F2FS as default
- Removed SDCardFS
- Enabled Android's new emulated storage option
- Updated to the latest Qualcomm USB Drivers
- Updated Audio HAL
- Updated Display HAL
- Added Offline Google Assistant
- Added Google Keyboard-Google Assistant Voice Typing
- Added Option to enable blurs
- New Aptx and Aptx(HD) audio implementation
- Better Garbage collection and file system stability
- Updated Kernel to latest Scarlet Kernel

## Android 12 - 28.07.2022

- Fixed media and media playback issues
- Fixed audio and call issues
- Fixed stutters and other miscellaneous fixes

## Android 12 - 25.07.2022

- Added write permission to GMS
- Added offline LED charging indicator
- Removed PPR
- Switched to AIDL Memtrack HAL
- Switched to AIDL Light HAL
- Updated the stock blobs to the latest stock version
- Added media props for better media support from S62Pro device
- Added aux cam support
- Updated idc/keylayout from stock
- Update power profile to reflect actual battery capacity
- Fixed many audio issues
- Earpiece audio is louder than ever
- DAC and normal USB-C headphone now work properly
- OTG now works properly
- Updated some audio-related configs and drivers
- Removed APEX
- Compressed ramdisk for better unpacking and small size
- Added and optimized LMK
- Added some CPU configs and tuned some for optimal performance
- Made SQL in performance mode always
- Added API26 Task profile for better sched tune boost
- Compiled the whole system UI for better optimization and performance
- Removed GFX acceleration
- Fixed data when switching data from sim 1 to sim 2
- Removed useless blobs
- Removed all RRO
- Switched to OSS camera
- Switched to A11 Graphic Blobs
- Switched to A12 Display HAL
- Switched to A12 Camera HAL
- Switched to A12 Audio HAL
- Switched to A12 Media HAL
- Fixed Speech service by Google crashing on first boot
- Added back APEX
- Increased CPU boost duration
- Changed CPU set a bit
- Fixed "OK GOOGLE" and "HEY GOOGLE" commands working
- Fixed Dual SIM crashing error
- Added GCamGo inbuilt in the ROM
- Fixed high battery drain
- Fixed device heating issues

## Android 12 - 25.12.2021

- Removed backpressure and latching props
- Enabled vibration multiple intensities
- Defaulted to gesture navigation
- Switched to AOSP Bluetooth
- Updated Bluetooth audio HAL to 2.1
- Spoofed security patch level to match the platform level
- Reworked Ambient display (Doze) and adapted it to Android 12's Monet theme
- Changed Doze icons
- Disabled ACS and 11AC support for Wi-Fi
- Added aux camera props
- Switched to QTI vibrator
- Disabled advanced network scan
- Disabled blur completely
- Switched to Google standards for status bar, quick settings, and round corners
- Added more media, audio, and other codecs for telephony
- Enabled ZRAM and made it use half of the RAM
- Updated most of the vendor blobs from CAT S62 Pro device
- Switched to AOSP power and perf HAL
- Removed APEX
- Switched to Vulkan-based renderer