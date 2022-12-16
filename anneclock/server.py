import aiohttp
import aiohttp.web

async def websocket_handler(request):    
    ws = aiohttp.web.WebSocketResponse()
    await ws.prepare(request)

    async for msg in ws:       
        print(msg.data)
        # TODO handle the message here.
        # TODO for now, just returning upper case
        print(msg.data.upper())
        await ws.send_str(msg.data.upper())

    return ws

app = aiohttp.web.Application()
app.router.add_route('GET', '/ws', websocket_handler)
app.router.add_static('/', path='webroot/', name='static')

if __name__ == '__main__':
    aiohttp.web.run_app(app)
