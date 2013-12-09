Ninja-pushover
=============

Ninja-pushover driver for ninjablock.
This driver make it possible to send pushover notifications to your phone.

inserting {{sound:soundName}}message allows you to set the sound for the alert.

For example, if you insert *{{sound:bike}}Hello World!* into the **send value** you will receive *Hello World* pushed into your smartphone and hear the "bike" sound. If {{sound:}} is ommitted or not one of the sounds available from the [pushover API](https://pushover.net/api#sounds), the default sound is used.	 
