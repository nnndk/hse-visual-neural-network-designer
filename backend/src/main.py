import uvicorn

import bootstrap
import settings


if __name__ == "__main__":
    app = bootstrap.build_app()
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
