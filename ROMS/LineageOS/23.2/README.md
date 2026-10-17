# LineageOS 23.2 (Android 16) - Xiaomi Mi A2 (jasmine_sprout)

![LineageOS 23.2 - Mi A2](banner.png)

**UNOFFICIAL - user build, release-keys signed - Encrypted build (file-based encryption, AES-256-XTS) - Build date 17.10.2026**

> Needs an unlocked bootloader. Changelog: [CHANGELOGS/LineageOS.md](../../../CHANGELOGS/LineageOS.md).
>
> Known issues: Widevine is Level 3 only; only the Goodix fingerprint sensor is supported; no "Hey Google" with the screen off; no thumbnails for 10-bit SDR HEVC videos; Vi (Vodafone Idea) India users may need to pick the "Vodafone IN (www)" APN.
>
> **Coming from the 09.10.2026 build or another ROM: clean install (format data).** This build is signed with different keys.

## Downloads

**[Release page (all files)](https://github.com/iamimmanuelraj/AOSP/releases/tag/lineageos-23.2-jasmine_sprout-20261017)**

| File | Use |
| --- | --- |
| [lineage-23.2-20261017-UNOFFICIAL-jasmine_sprout.zip](https://github.com/iamimmanuelraj/AOSP/releases/download/lineageos-23.2-jasmine_sprout-20261017/lineage-23.2-20261017-UNOFFICIAL-jasmine_sprout.zip) | The ROM (sideload from recovery) |
| [recovery-lineage-23.2-20261017-jasmine_sprout.img](https://github.com/iamimmanuelraj/AOSP/releases/download/lineageos-23.2-jasmine_sprout-20261017/recovery-lineage-23.2-20261017-jasmine_sprout.img) | Recovery image (this device uses recovery-as-boot, so it is flashed to `boot`) |
| [super_empty-lineage-23.2-jasmine_sprout.img](https://github.com/iamimmanuelraj/AOSP/releases/download/lineageos-23.2-jasmine_sprout-20261017/super_empty-lineage-23.2-jasmine_sprout.img) | Empty super image for the retrofit dynamic partitions (first install only) |
| [SHA256SUMS](https://github.com/iamimmanuelraj/AOSP/releases/download/lineageos-23.2-jasmine_sprout-20261017/SHA256SUMS) | Checksums for the three files above |
| [lineage-23.2-20261017-UNOFFICIAL-jasmine_sprout.zip.sha256](https://github.com/iamimmanuelraj/AOSP/releases/download/lineageos-23.2-jasmine_sprout-20261017/lineage-23.2-20261017-UNOFFICIAL-jasmine_sprout.zip.sha256) | Checksum of the ROM zip only |
| [copy-partitions-20210323_1922.zip](https://github.com/PixelExperience-Devices/blobs/raw/main/copy-partitions-20210323_1922.zip) | Makes the firmware partitions consistent (once per device, from PixelExperience-Devices/blobs) |

Verify your downloads (all files in one folder): `sha256sum -c SHA256SUMS`

## Flashing instructions

Mi A2 uses **retrofit dynamic partitions**, so the install follows the same procedure as the [PixelExperience Mi A2 install guide](https://wiki.pixelexperience.org/devices/jasmine_sprout/install/), with the files above.

**Before you start**

1. Read all the steps once. Stop if any step fails.
2. Install `adb` and `fastboot` (fastboot 31.0.2 or newer).
3. Enable USB debugging. Back up your data: the bootloader unlock and the data format below erase everything.
4. The device should be on the latest stock Android 10 firmware.
5. Unlock the bootloader if it is still locked (once per device): enable OEM unlock, `adb reboot bootloader`, then `fastboot oem unlock`.

**1. Flash the recovery**

1. `adb reboot bootloader` (or power off and hold Volume Down + Power).
2. `fastboot flash boot recovery-lineage-23.2-20261017-jasmine_sprout.img`
   - If fastboot reports a `boot__a`/`boot__b` slot name, update fastboot, or flash to the slot it names (e.g. `boot_a`).
3. Reboot into recovery: power off, hold Volume Up + Power until the logo appears, and keep Volume Up held after releasing Power.

**2. Make firmware partitions consistent (once per device)**

1. In recovery choose **Apply update > Apply from ADB**.
2. `adb sideload copy-partitions-20210323_1922.zip`
3. In recovery choose **Advanced > Reboot to recovery**.

**3. Flash super_empty.img (first installation only)**

1. In recovery choose **Advanced > Reboot to bootloader** (or run `fastboot reboot bootloader` / `adb reboot bootloader`).
   This must be the normal bootloader (`fastboot devices` shows `fastboot`), **not** recovery's "Enter fastboot" (fastbootd):
   in fastbootd, `wipe-super` fails with `Resizing 'vendor_b' FAILED (remote: 'Not enough space to resize partition')`.
2. `fastboot wipe-super super_empty-lineage-23.2-jasmine_sprout.img`
   - Don't add `--slot=all`: the Mi A2 bootloader stops with `Could not check if partition vendor has slot all`.
   - Expected output: `Writing 'system_b' OKAY`, `Writing 'vendor' OKAY` (vendor is 0 KB, that's normal), `Finished`.
3. Boot back into recovery: power off, hold Volume Up + Power.

**4. Install LineageOS**

1. In recovery choose **Factory reset > Format data / factory reset** and continue. This is required because the build is encrypted; it deletes internal storage.
2. Go back to the main menu, choose **Apply update > Apply from ADB**.
3. `adb sideload lineage-23.2-20261017-UNOFFICIAL-jasmine_sprout.zip`
4. When it finishes, go back and choose **Reboot system now**.

The first boot takes a few minutes. If it drops back to the bootloader or recovery, redo the steps above.

> These steps follow PixelExperience's retrofit-dynamic-partition procedure. The ROM was developed by sideloading to the second slot of a device that already ran another OS; the clean-install path above has not been run end to end on a fresh device yet.
