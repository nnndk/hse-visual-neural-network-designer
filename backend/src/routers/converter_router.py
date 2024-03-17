from fastapi import APIRouter, status
from fastapi.responses import PlainTextResponse

from models.nn_block_models import NNModel


ConverterRouter = APIRouter(
    prefix=''
)


@ConverterRouter.post('/', status_code=status.HTTP_200_OK, response_class=PlainTextResponse)
def generate_model(model: NNModel):
    python_model = model.to_python_code()
    print(python_model)

    if python_model != '':
        return python_model
    else:
        return status.HTTP_400_BAD_REQUEST
