import torch
from torch import nn


class NNModelValidator:
    """Class with static neural network model validation methods"""
    @staticmethod
    def validate_pytorch_model(str_model: str, first_in: int, first_in_channels: int) -> bool:
        """Validate pytorch model. Firstly try model with 2d tensor. Secondly check model with mock image tensor (4d)"""
        try:
            model = eval(str_model)
            input_tensor = torch.randn(8, first_in)
            model(input_tensor)

            return True
        except RuntimeError:
            try:
                model = eval(str_model)
                input_tensor = torch.randn(1, first_in_channels, 64, 64)
                model(input_tensor)

                return True
            except:
                return False
        except:
            return False
