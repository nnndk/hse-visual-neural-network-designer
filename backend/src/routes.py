from fastapi import FastAPI

from routers.converter_router import ConverterRouter


def setup_routes(app: FastAPI) -> None:
    """Настройка маршрутов для API"""

    app.include_router(ConverterRouter)
