# LineageOS changelog - Xiaomi Mi A2 (jasmine_sprout)

## LineageOS 23.2 (Android 16) - 17.10.2026

[Release](https://github.com/iamimmanuelraj/AOSP/releases/tag/lineageos-23.2-jasmine_sprout-20261017) - user build, release-keys signed, security patch 2026-09-01. Clean install (format data) when coming from 09.10.2026 or another ROM.

- Switched to the LineageOS SDM660 4.19 kernel
- Mobile network: calls, SMS, mobile data, VoLTE and Wi-Fi calling
- Fingerprint (Goodix) and double tap to wake
- Battery: correct battery profile, temperature, charging and design capacity; RRADC / fuel gauge fixes
- USB: file transfer (MTP), USB tethering and adb through the QTI USB gadget HAL
- Audio: real-time priority for the audio HAL; dual-mic noise suppression for recording, voice notes, VoIP and calls; corrected stereo mic routing
- Video: HEVC 10-bit / HDR10 playback fix
- Thermal HAL: temperatures and thermal status for apps
- Swipe (gesture) typing in the built-in keyboard
- Widevine DRM enabled (Level 3)
- Location: Wi-Fi assisted positioning and sensor-assisted GNSS
- IMS video calling (ViLTE) libraries fixed
- Removed features the phone does not have (barometer, unused HALs)
- SELinux and log cleanup (denials, log spam, CPU boost errors)

Known issues: Widevine L3 only; only the Goodix fingerprint sensor is supported; no "Hey Google" with the screen off; no thumbnails for 10-bit SDR HEVC videos; Vi (Vodafone Idea) India users may need to pick the "Vodafone IN (www)" APN.

## LineageOS 23.2 (Android 16) - 09.10.2026

[Release](https://github.com/iamimmanuelraj/AOSP/releases/tag/lineageos-23.2-jasmine_sprout-20261009) - first test build (test-keys).

- First boot of LineageOS 23.2 on the Mi A2 with the 4.19 kernel and retrofit dynamic partitions
- Display, USB, Wi-Fi hardware and adb working
