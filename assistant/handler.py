from notebook.base.handlers import APIHandler
from tornado import web
import uuid, asyncio, json

class CommandHandler(APIHandler):
    @web.authenticated
    async def post(self):
        data = self.get_json_body()
        comm = self.settings.get("comm")

        if not comm:
            self.set_status(503)
            self.finish({"error": "comm not ready"})
            return

        request_id = str(uuid.uuid4())
        future = asyncio.Future()
        self.settings['pending'][request_id] = future

        # 加入 request_id，发给前端
        data['request_id'] = request_id
        comm.send(data)

        # 等待前端响应
        try:
            result = await asyncio.wait_for(future, timeout=10)
        except asyncio.TimeoutError:
            result = {"error": "timeout"}

        self.finish(json.dumps({"request_id": request_id, "result": result}))