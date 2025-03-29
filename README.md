# The Anne Clock

This project is a website designed for absolute positioning on the 10.1 inch display
panel. The Pi runs the webserver and launches a browser (kiosk mode) to the site.

```
http://localhost:8080/index.html

git clone https://github.com/topherCantrell/AnneClock.git
```

Upgrading the site is easy: update the git repo on the pi and restart.

# The Display

https://www.uperfectmonitor.com/products/raspberry-pi-case-with-screen

RPi fits inside. 10.1 inch HDMI with sound. 1280x800 pixels.

The touch screen works right out of the box. No configuration to do.

# Audio

I disabled the onboard headphone jack so that the HDMI output was the only option.

https://www.instructables.com/Disable-the-Built-in-Sound-Card-of-Raspberry-Pi/

```
cd /etc/modprobe.d
sudo vi alsa-blacklist.conf # This is creating the file
```

```
blacklist snd_bcm2835
```

And reboot.

# Auto-starting the Python Server

Drop the `anneclock` directory in the pi home directory.

Edit or create "/etc/rc.local". Here is the file if you have to create:

```
#!/bin/sh -e
#
# rc.local

exit 0
```

You must `sudo chmod +x /etc/rc.local`

Add this line to /etc/rc.local (before the exit 0):

```
/home/pi/ONBOOT.sh 2> /home/pi/ONBOOT.errors > /home/pi/ONBOOT.stdout &
```

Note the "sudo" here; the server runs as root:

```
# sudo python3 -m pip install aiohttp ; the old way no longer works
sudo apt install python3-aiohttp
```

Create `ONBOOT.sh` with the following:

```
#!/bin/bash
rm -rf /home/pi/.cache/chromium
cd /home/pi/anneclock
python3 server.py
```

Don't forget `chmod +x ONBOOT.sh`.

For Bookworm I had to disable the mouse pointer completely:

```
sudo mv /usr/share/icons/PiXflat/cursors/left_ptr /usr/share/icons/PiXflat/cursors/left_ptr.bak
```

Unclutter doesn't work in bookworm. There are other ways besides getting rid of the pointer, but meh.

# Chromium Kiosk

Install unclutter to hide the mouse pointer:

```
sudo apt install chromium
sudo apt install unclutter
```

Use `sudo raspi-config` to configure boot to GUI and auto log in, and configure the display to "non blanking".

In the pi home directory, create `kiosk.sh` and make it executable:

```
#!/bin/bash

xset s noblank
xset s off

unclutter -idle 0.5 -root &

sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/pi/.config/chromium/Default/Preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/pi/.config/chromium/Default/Preferences

chromium --no-sandbox --noerrdialogs --disable-infobars --kiosk --autoplay-policy=no-user-gesture-required http://localhost:8080/index.html
```

Don't forget: `chmod +x kiosk.sh`

Create the systemd service file:

```
sudo vi /lib/systemd/system/kiosk.service
```

With this content:

```
[Unit]
Description=Chromium Kiosk
Wants=graphical.target
After=graphical.target

[Service]
Environment=DISPLAY=:0.0
Environment=XAUTHORITY=/home/pi/.Xauthority
Type=simple
ExecStart=/bin/bash /home/pi/kiosk.sh
Restart=on-abort
User=pi
Group=pi
```

Enable the service:

```
sudo systemctl enable kiosk.service
```

I ignored a long spew message saying "The unit files have no ...".

Reboot or use `sudo systemctl start kiosk.service` to start (`stop` to stop).

# Configuration menu:
  - Theme
    - Trump
    - Christmas
  - Update
    - check for updates (https://github.com/topherCantrell/anne-clock/anneclock/update.py)
    - install
  - LAN connection
    - ssid
    - password
  - Sleep Mode
    - When system wakes
    - When system sleeps
    - Manual wake
    - Manual sleep
  - Backgrounds
    - Pick set (or one)
    - When backgrounds change (hourly, etc)
  - Videos
    - Pick set (or none)
    - When played (hourly, etc)
    - Videos and audio scheduled same time -- video wins
  - Audio
    - Pick set (or none)
    - When played (hourly, etc)

option to close kiosk and return to desktop (for development)