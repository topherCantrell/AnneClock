import aiohttp
import aiohttp.web
import json

async def cmd_update(message):
    print('IN UPDATE')
    return {}

async def websocket_handler(request):    
    ws = aiohttp.web.WebSocketResponse()
    await ws.prepare(request)

    async for msg in ws:    
        print('>>>',type(msg.data), f'::{msg.data}::'  ) 
        cmd_msg = json.loads(msg.data)
        
        cmd = cmd_msg['cmd']        
        if cmd=='update':
            resp = await cmd_update(cmd_msg)        
        else:
            resp = {'error':f'Unknown command: {cmd}'}
        await ws.send_str(json.dumps(resp))
    return ws

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

print('>>> here')

app = aiohttp.web.Application()
app.router.add_route('GET', '/ws', websocket_handler)
app.router.add_static('/', path='webroot/', name='static')

if __name__ == '__main__':
    aiohttp.web.run_app(app)
