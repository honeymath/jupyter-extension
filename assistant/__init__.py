import warnings

try:
    from ._version import __version__
except ImportError:
    warnings.warn("Importing 'assistant' outside a proper installation.")
    __version__ = "dev"

from .handler import CommandHandler

def _load_jupyter_server_extension(server_app):
    """
    Jupyter 启动时调用：注册 HTTP Handler 和初始化 Comm 状态
    """
    web_app = server_app.web_app
    web_app.settings['comm'] = None  # 后续在前端通告时赋值
    web_app.settings['pending'] = {}  # 保存 request_id -> Future

    web_app.add_handlers(".*", [(r"/command", CommandHandler)])

    server_app.log.info("✨ Assistant server extension 已加载 /command 接口")