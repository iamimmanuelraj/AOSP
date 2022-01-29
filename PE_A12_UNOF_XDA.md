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
- Disabled blur completely (Hard disabled . Use magisk module if you wish to enable it so much is of em is availabe in internet . Or root your device and go to vendor/build.prop  and change the value of "ro.surface_flinger.supports_background_blur=0
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
- [Recomended Twrp](https://sourceforge.net/projects/immanuelsbuilds/files/TWRP/)

# My Stuff : - 
>-XDA :- [Immanuel Raj](https://forum.xda-developers.com/m/immanuel-raj.9376270/)

>-Paypal :- [Immanuel Raj](https://www.paypal.me/immanuelr44)

>-UPI :- immanuelr44@okicici

>-Telegram - [iamimmanueraj](https://t.me/iamimmanuelraj)
