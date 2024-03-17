from fastapi import FastAPI

from routes import setup_routes


def build_app() -> FastAPI:
    """Создание приложения FastAPI."""
    app = FastAPI()
    setup_routes(app)

    return app
