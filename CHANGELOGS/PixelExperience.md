# 28.07.2022

## IMPORTANT

- ENCRYPTED
- USER BUILD
- CLEAN FLASH RECOMENDED
- MUST USE PE RECOVERY ONLY (EXCEPT FOR INITIAL FLASH AND DONT FLASH ANY OTHER CUSTOM RECOVERY JUST BOOT RECOVERY IF U WANT)
- IF YOU WANT TO CHANGE KERNEL USE KERNEL THAT HAS OSS CAM SUPPORT AND QTI HAPTICS SUPPORT
- VOLTE/VOWIFI WORKS [DEPENDS ON CARRIER]
- DEVICE CERTIFIED
- CTS PASSES
- ENFORCING SELINUX BUILD

## REST FIXES

- Fixed media and media playback issues
- Fixed audio and call issues
- Fixed stutters
- And some mics stuff

# Credits

- A huge thanks to @odsazib @stylogey for their work on OSS CAM
- Thanks to @clarencelol for that awesome kernel
- Thanks to the people who tested this
- Thanks to supporters for supporting and waiting patiently for 5 months for this update

# MISC

- This build is using a custom kernel which can be found [HERE](https://github.com/iamimmanuelraj/android_kernel_xiaomi_jasmine_sprout)
- [Install Instructions](https://telegra.ph/FBE-and-its-FAQs-06-25#:~:text=How%20to%20Flash%20an%20FBE%20ROM%3F)
- [GCAM](https://t.me/harsh_gcam)
- This rom uses OSS CAM kernel
- [Recomended Twrp](https://sourceforge.net/projects/immanuelsbuilds/files/TWRP/)
- [Download](https://sourceforge.net/projects/immanuelsbuilds/files/Pixel-Experience/PixelExperience_jasmine_sprout-12.1-20220725-1616-UNOFFICIAL.zip/download)
- Report [HERE](https://t.me/yaa2g) By tagging me (@iamimmanuelraj) with proper logs and steps to reproduce

# My Stuff : -

> -XDA :- [Immanuel Raj](https://forum.xda-developers.com/m/immanuel-raj.9376270/)

> -UPI :- iamimmanuelraj@ok[icici][axis][hdfcbank][sbi]

> -Telegram - [iamimmanueraj](https://t.me/iamimmanuelraj)

# 25.07.2022

## IMPORTANT

- ENCRYPTED
- USER BUILD
- CLEAN FLASH RECOMENDED
- MUST USE PE RECOVERY ONLY (EXCEPT FOR INITIAL FLASH AND DONT FLASH ANY OTHER CUSTOM RECOVERY JUST BOOT RECOVERY IF U WANT)
- IF YOU WANT TO CHANGE KERNEL USE KERNEL THAT HAS OSS CAM SUPPORT AND QTI HAPTICS SUPPORT
- VOLTE/VOWIFI WORKS [DEPENDS ON CARRIER]
- DEVICE CERTIFIED
- CTS PASSES
- ENFORCING SELINUX BUILD

## REST FIXES

- Add write permission to GMS
- Added offline LED charging indicator
- Removed PPR
- Switch to AIDL Memtrack HAL
- Switched to AIDL Ligh HAL
- Updates the stock blobs to latest stock version [v11.28]
- Added media props for better media support from S62Pro device
- Added aux cam support
- Updates idc/keylayout from stock
- Update power profile to reflect actual battery capacity
- Fixed many audio issues
- Earpiece audio is louder than ever
- DAC and normal USB - C headphone now work properly
- OTG now works properly
- Updated some audio related configs and drivers
- Removed APEX
- Fixed power button position when unlock animation is being played
- Fixed many graphic driver problem and log spam as well
- Added zram and zram writeback
- Added and optimised LMK
- Added some CPU configs and tuned some for optimal performance
- Made sql to be in performance mode always
- Added API26 Task profile for better sched tune boost
- Compiled the whole systemui for better optimizaton and performance
- Removed GFX acceleration
- Fixed data when switching data from sim 1 to sim 2
- Removed useless blobs
- Compressed ramdisk for better unpacking and small size
- Added and implementd 1.1 of bootctrl hal
- Removed all RRO [Everthing mostly is only prebuilt overlay]
- And some mics stuff

# Credits

- A huge thanks to @odsazib @stylogey for their work on OSS CAM
- Thanks to @clarencelol for that awesome kernel
- Thanks to the people who tested this
- Thanks to supporters for supporting and waiting patiently for 5 months for this update

# MISC

- This build is using a custom kernel which can be found [HERE](https://github.com/iamimmanuelraj/android_kernel_xiaomi_jasmine_sprout)
- [Install Instructions](https://telegra.ph/FBE-and-its-FAQs-06-25#:~:text=How%20to%20Flash%20an%20FBE%20ROM%3F)
- [GCAM](https://t.me/harsh_gcam)
- This rom uses OSS CAM kernel
- [Recomended Twrp](https://sourceforge.net/projects/immanuelsbuilds/files/TWRP/)
- [Download](https://sourceforge.net/projects/immanuelsbuilds/files/Pixel-Experience/PixelExperience_jasmine_sprout-12.1-20220725-1616-UNOFFICIAL.zip/download)
- Report [HERE](https://t.me/yaa2g) By tagging me (@iamimmanuelraj) with proper logs and steps to reproduce

# My Stuff : -

> -XDA :- [Immanuel Raj](https://forum.xda-developers.com/m/immanuel-raj.9376270/)

> -UPI :- iamimmanuelraj@ok[icici][axis][hdfcbank][sbi]

> -Telegram - [iamimmanueraj](https://t.me/iamimmanuelraj)

# 22.02.2022

## IMPORTANT

- ENCRYPTED
- USER BUILD
- CLEAN FLASH RECOMENDED
- MUST USE PE RECOVERY ONLY (EXCEPT FOR INITIAL FLASH AND DONT CHANGE TO ANY OTHER CUSTOM RECOVERY)
- DO NOT CHANGE KERNEL (ELSE ROM WILL NOT WORK.IF YOU WANT TO CHANGE KERNEL USE KERNEL THAT HAS OSS CAM SUPPORT AND QTI HAPTICS SUPPORT)

## REST FIXES

- Enabled Default USB audio configs
- Updated DRM clearkey module to v1.4 [Latest]
- Follow CAF for media profiles and media codes - Better media performance
- Added some missing bluetooth props and removed some old ones as well
- Add new symlinks for newer (A12) RIL blobs [A12 RIL blobs are not fully implemented as i am testing this]
- Removed so many RIL related log spams
- Clean Up Network Selection [Now only shows 2/3/4G instead of EDGE/GLobal etc]
- Switched Back to Combined Signal icon
- Switched back to source built Perf Hal
- Updated Perf configs from S62Pro
- Removed a couple of old/un-necessary packages
- Fixed a small issue in Audio package
- Switched to newer BootCtrl 1.2 Hal
- Fixed some camera props
- FIxed CDSP Working [All CDSP related stuff should work better now]
- Imported CDSP stack from S62Pro
- Updated init scripts from latest SDM660 CAF tag
- Imported PowerManager Blobs from S62Pro
- Updated Perf Stack from S62Pro and added some dependencies as well
- Fixes for banking apps detecting magisk/root/customrom
- Updated Radio Hal to the latest and greates availabel as per [THIS](https://www.eff.org/deeplinks/2022/01/victory-google-releases-disable-2g-feature-new-android-smartphones#:~:text=If%20you%20have%20an%20older%20Android%20phone%2C%20these%20steps%20may%20or%20may%20not%20work.%20Unfortunately%20due%20to%20limitations%20of%20old%20hardware%2C%20Google%20was%20only%20able%20to%20implement%20this%20feature%20on%20phones%20running%20Android%2012%20and%20supporting%20version%201.6%20of%20the%20radio%20HAL%2C%20so%20far%20this%20is%20limited%20to%20the%20Pixel%206)
- Switched to OSS [Open Source Software] camera [THis is different from OLD cam and NEW cam . THis is the better and latest version of camera that is built from the AOSP source code itself]
- Switched to A11 Graphhic Blobs
- Switched to A12 Display HAL
- Switch to A12 Camera HAL
- Switched to A12 Audio HAL
- Switched to A12 Media HAL
- Fixed Speech service by google crashing in first boot
- Added back APEX
- Increased CPU boost duration
- Changed cpu set a bit
- Fixed "OK GOOGLE" "HEY GOOGLE" commands working
- Fixed Dual sim crashing error
- Added gcamgo inbuilt in the rom
- FIxed high batery drain
- Fixed device heating issues
- And some mics stuff

# Credits

- A huge thanks to @odsazib @stylogey for their work on OSS CAM
- Thanks to @odsazib for that awesome kernel
- Thansk to @clarencelol for fixes and suggestion and correction
- Thanks to the people who tested this
- Thanks to supporters for supporting and waiting patiently for 2 months for this update

# MISC

- This build is using a custom kernel which can be found [HERE](https://github.com/iamimmanuelraj/android_kernel_xiaomi_jasmine_sprout)
- [Install Instructions](https://blog.immanuelraj.me/2021/09/06/flashinginjasmine/)
- [GCAM](https://t.me/harsh_gcam)
- This rom uses OSS CAM kernel
- [Recomended Twrp](https://www.pling.com/p/1671453//)
- [Download](https://www.pling.com/p/1671391/)

# My Stuff : -

> -XDA :- [Immanuel Raj](https://forum.xda-developers.com/m/immanuel-raj.9376270/)

> -Paypal :- [Immanuel Raj](https://www.paypal.me/immanuelr44)

> -UPI :- immanuelr44@okicici

> -Telegram - [iamimmanueraj](https://t.me/iamimmanuelraj)

# 25.12.2021

## IMPORTANT

- ENCRYPTED
- USER BUILD
- CLEAN FLASH MUST
- MUST USE PE RECOVERY ONLY (EXCEPT FOR INITIAL FLASH. DONT CHANGE RECOVERY)
- DO NOT CHANGE KERNEL

## REST FIXES

- Removed backpressure and latching props (Smooth user experience and less jank)
- Enable vibration multiple intensities (Activates some options on Settings>accessibility>vibration)
- Default to gesture navigation
- Switch to AOSP bluetooth (From QTI bluetooth)
- Updated Bluetooth audio hal to 2.1
- Spoof security patch level as same as platform level (Always shows latest vendor and also fixes some apps warning/force stop due to old vendor)
- Reworked Ambient display (Doze) and adapted it to Andorid 12's Monet theme
- Changed Doze icons
- Disable ACS and 11AC support for wifi (Doesn't affect any user as our chip doesnt support it anyway . So i just disabled it)
- Added aux camera props (Fixed camera usage in chrome in some site like https://verify.cowin.org)
- Switched to QTI vibrator from AOSP vibrator
- Disabled advance network scan (Doesn't affect any user as our chip doesnt support it anyway . So i just disabled it)
- Fixed a case where bootanimation shows when connecting charger (Offline charging)
- Disabled blur completely (Hard disabled . Use magisk module if you wish to enable it so much is of em is availabe in internet . Or root your device and go to vendor/build.prop and change the value of "ro.surface_flinger.supports_background_blur=0
  " from 0 to 1
- Switched to google standards for status bar / qs / round conners and other padding
- Added more media/audio and other codecs for telephony and mics stuff from google
- Enabled ZRAM and explicitly made it to use half of the RAM
- Updated most of the vendor blobs from CAT S62 Pro device for better performance and compatibility
- Swithced to AOSP power and perf hal ( From QTI power and perf)
- Many misc fixes and changes for AOSP power and perf hal
- Removed APEX
- Completely switched to vulkan based renderer rather than using renderscript implementation as [recomemded by google](https://android-developers.googleblog.com/2021/04/android-gpu-compute-going-forward.html)
- Many more misc fixes (Not including here cause it maybee a bit techinical and confusing and hard to understand)

# MISC

- This build is using a custom WCSF (West Coast Super Fast) Kernel which can be found [HERE](https://github.com/iamimmanuelraj/kernel_xiaomi_jasmine_sprout)
- [Install Instructions](https://blog.immanuelraj.me/2021/09/06/flashinginjasmine/)
- [GCAM](https://t.me/harsh_gcam)
- This rom uses OLD CAM kernel
- If you face volt issues when using dual sim root your device then go to system/system_ext/app/datastatusnotification/ and delete datastatusnotification.apk and reboot phone
- [Recomended Twrp](https://www.pling.com/p/1671453//)

# My Stuff : -

> -XDA :- [Immanuel Raj](https://forum.xda-developers.com/m/immanuel-raj.9376270/)

> -Paypal :- [Immanuel Raj](https://www.paypal.me/immanuelr44)

> -UPI :- immanuelr44@okicici

> -Telegram - [iamimmanueraj](https://t.me/iamimmanuelraj)
