from fastapi import FastAPI

from routers.app_router import AppRouter


def setup_routes(app: FastAPI) -> None:
    """Setup API routes"""

    app.include_router(AppRouter)
