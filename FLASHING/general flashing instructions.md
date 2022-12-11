##Clean flashing

Note: For Flashing A13 check flashing instruction in retrofit dynamic partition folder

This flashing instruction is for A/B partitioning

• Ofc you need an unlocked bootloader and a recovery 
• Wipe>Advanced wipe>select dalvik, system, vendor, cache, data>swipe to wipe (Note: incase you don't know this process will wipe your data so make sure to take a backup)
• Change slot and repeat previous step (optional)
• Flash your desired rom [and twrp if it's not included], reboot recovery
• Flash gapps and magisk(optional)
• Reboot system

##Dirty flashing/Updating
• Reboot recovery
• Flash rom
• Change slot
• Reboot system

##Flashing custom kernels
• Reboot recovery
• Take a backup of stock boot image (incase something goes wrong you can revert back to stock kernel shipped with the rom)
• Flash zip
• Reboot system


• People often face error 1, unlocking critical fixes it
• Custom kernels, some roms don't suppose custom kernel, so make sure to check weather your rom supports custom kernel or not before flashing
