from fastapi import APIRouter, Response, status
from fastapi.responses import PlainTextResponse

from models.nn_block_models import NNModel, NNLibs
from model_validators.validator import NNModelValidator

AppRouter = APIRouter(
    prefix=''
)


@AppRouter.post('/validate_model/', status_code=status.HTTP_200_OK)
def generate_model(model: NNModel, response: Response):
    python_model = model.to_python_code()
    result = False

    if model.library == NNLibs.pytorch:
        result = NNModelValidator.validate_pytorch_model(python_model, model.get_first_in_feature(),
                                                         model.get_first_in_channels())
    elif model.library == NNLibs.tensorflow:
        result = NNModelValidator.validate_tensorflow_model(python_model)

    if not result:
        response.status_code = status.HTTP_400_BAD_REQUEST


@AppRouter.post('/get_model/', status_code=status.HTTP_201_CREATED, response_class=PlainTextResponse)
def generate_model(model: NNModel, response: Response):
    python_model = model.to_python_code()

    if python_model != '':
        return python_model
    else:
        response.status_code = status.HTTP_400_BAD_REQUEST
