# Clean flashing

Note: For Flashing `A13[Dynamic Partiton ROMS]` check flashing instruction in [HERE](https://github.com/iamimmanuelraj/AOSP/blob/main/FLASHING/RETROFIT_DYNAMIC_PARTITION/Flashing_Instructions.md)

This flashing instruction is for `A/B partition`.

- You need an unlocked bootloader and a recovery (The steps and options below may change as per recovery, make sure to searc and find similar stuff)
- `Wipe` > `Advanced wipe` > select `dalvik`, `system`, `vendor`, `cache`, `data` > `swipe to wipe` (Note: incase you don't know - This process will wipe your data so make sure to take a backup)
- Change slot and repeat previous step
- Flash your desired ROM [And twrp if needed - Most ROM's and Dev's dont suggest doing it] then reboot recovery
- Flash gapps and magisk(optional)
- Reboot system

# Dirty flashing/Updating
- Reboot recovery
- Flash ROM
- Change slot (In some recovery it doest this automatically, you can skip to the next step in those recovery)
- Reboot system

# Flashing custom kernels
- Reboot recovery
- Take a backup of stock boot image (Incase something goes wrong you can revert back to stock kernel that was shipped with the ROM)
- Flash zip
- Reboot system

# Info
- People often face error 1, unlocking critical partiton fixes it.
- Some ROM's don't suppose custom kernel, make sure to check weather your ROM supports custom kernel or not before flashing it.