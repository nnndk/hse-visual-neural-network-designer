from fastapi import APIRouter, status
from fastapi.responses import PlainTextResponse

from models.nn_block_models import NNModel, NNLibs
from model_validators.validator import NNModelValidator

AppRouter = APIRouter(
    prefix=''
)


@AppRouter.get('/validate_model/', status_code=status.HTTP_200_OK)
def generate_model(model: NNModel):
    python_model = model.to_python_code()
    result = False

    if model.library == NNLibs.pytorch:
        result = NNModelValidator.validate_pytorch_model(python_model, model.get_first_in_feature(),
                                                         model.get_first_in_channels())
    elif model.library == NNLibs.tensorflow:
        result = NNModelValidator.validate_tensorflow_model(python_model)

    if result:
        return status.HTTP_200_OK
    else:
        return status.HTTP_400_BAD_REQUEST


@AppRouter.post('/get_model/', status_code=status.HTTP_200_OK, response_class=PlainTextResponse)
def generate_model(model: NNModel):
    python_model = model.to_python_code()

    if python_model != '':
        return python_model
    else:
        return status.HTTP_400_BAD_REQUEST
