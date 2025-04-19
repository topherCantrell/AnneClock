import aiohttp
import aiohttp.web
import json
import socket
import os
import time
import subprocess

CONFIG_INFO = {
    "ssid": None,
    "psk": None,
    "net_connected": None,    
}

async def cmd_set_network(cmd, message):
    print('>>>', cmd)
    print('>>>', message)
    ssid = message['ssid']
    psk = message['psk']
    _set_network(ssid, psk)
    os.system('reboot')
    print('>>> REBOOTING')

def _set_network(ssid, psk):

    file_contents = '''ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
        ssid="%SSID%"
        psk="%PSK%"
}
'''
    # TODO create/update our section in the file in case there are other nets
    file_contents = file_contents.replace('%SSID%',ssid)
    file_contents = file_contents.replace('%PSK%',psk)
    with open('/etc/wpa_supplicant/wpa_supplicant.conf','w') as f:
        f.write(file_contents)    

def _get_network():
    try:
        with open('/etc/wpa_supplicant/wpa_supplicant.conf') as f:
            file_contents = f.read()    
        file_contents = file_contents.split('\n')
        # TODO parse this correctly
        ssid = file_contents[4]
        psk = file_contents[5]
        i = ssid.find('"')
        j = ssid.find('"',i+1)
        ssid = ssid[i+1:j]
        i = psk.find('"')
        j = psk.find('"',i+1)
        psk = psk[i+1:j]
        return ssid, psk
    except:
        return '',''
    
def _is_network_connected():
    for i in range(10):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect(("github.com",80))
            s.close()
            return True
        except:
            # We retru here
            time.sleep(1)
    return False

async def websocket_handler(request):    
    ws = aiohttp.web.WebSocketResponse()
    await ws.prepare(request)

    # Testing change
    msg = dict(CONFIG_INFO)
    msg['cmd'] = 'CONFIG_INFO'
    await ws.send_str(json.dumps(msg))    

    async for msg in ws:            
        cmd_msg = json.loads(msg.data)        
        cmd = cmd_msg['cmd']        
        if cmd=='set_theme':
            CONFIG_INFO['user_config']['theme'] = cmd_msg['theme']
            save_user_config(CONFIG_INFO['user_config'])            
            msg = dict(CONFIG_INFO)
            msg['cmd'] = 'CONFIG_INFO'
            await ws.send_str(json.dumps(msg))        
        elif cmd=='set_network':
            await cmd_set_network(cmd, cmd_msg)
        else:
           print('UNKNOWN COMMAND',cmd_msg)
    return ws

def save_user_config(config):
    try:
        with open('/home/pi/userConfig.json', 'w') as f:
            json.dump(config, f, indent=4)
    except Exception as e:
        print('Error saving user config:', str(e))

"""
Requests are JSON with "cmd"
{
  "cmd": "update"
  ... command specifics here ...
}

Responses are JSON with "error" only if something is wrong
{
  "error": "Unknown command: blah"
  ... response specifics here ...
}

"""

try:    
    with open('/home/pi/userConfig.json') as f:
        USER_CONFIG = json.load(f)
except FileNotFoundError:
    # Probably first run
    USER_CONFIG = {
        'theme': 'themeTrump'
    }
    save_user_config(USER_CONFIG)

with open('version.txt') as f:
    lines = f.readlines()
    CONFIG_INFO['software_version'] = lines[0].strip()

wifi_info = _get_network()
CONFIG_INFO['ssid'] = wifi_info[0]
CONFIG_INFO['psk'] = wifi_info[1]
CONFIG_INFO['net_connected'] = _is_network_connected()
CONFIG_INFO['user_config'] = USER_CONFIG

print('>>> CONFIG_INFO')
print(CONFIG_INFO)

app = aiohttp.web.Application()
app.router.add_route('GET', '/ws', websocket_handler)
app.router.add_static('/', path='webroot/', name='static')

if __name__ == '__main__':
    aiohttp.web.run_app(app)
