from typing import List, Literal
from pydantic import BaseModel
from abc import ABC, abstractmethod


class NNLibs:
    pytorch = 'pytorch'
    tensorflow = 'tensorflow'


class ModelToPythonCode(ABC):
    @abstractmethod
    def to_python_code(self) -> str:
        """Convert a model to python code"""
        pass


class NNBlockParam(BaseModel, ModelToPythonCode):
    name: str
    value: str | int | bool | float | tuple | None

    def to_python_code(self) -> str:
        if isinstance(self.value, str):
            self.value = f'"{self.value}"'

        return f'{self.name}={self.value}'


class NNBlock(BaseModel, ModelToPythonCode):
    name: str
    params: List[NNBlockParam]
    library_prefix: str = ''

    def set_library_prefix(self, lib_prefix: str) -> None:
        """Set library prefix that will be added before every block in python model"""
        if lib_prefix == NNLibs.pytorch:
            self.library_prefix = 'nn'
        elif lib_prefix == NNLibs.tensorflow:
            self.library_prefix = 'tf.keras.layers'
        else:
            self.library_prefix = ''

    def _params_to_python_code(self) -> str:
        """Convert all block params into python code (str)"""
        result = ''

        for par in self.params:
            result += f'{par.to_python_code()}, '

        if len(result) != 0:
            result = result[:-2]

        return result

    def to_python_code(self) -> str:
        str_params = self._params_to_python_code()

        return f'{self.library_prefix}.{self.name}({str_params})'


class NNModel(BaseModel, ModelToPythonCode):
    library: Literal['pytorch', 'tensorflow']
    blocks: List[NNBlock]

    def _all_blocks_to_python_code(self) -> str:
        """Convert all blocks into python code (str)"""
        str_blocks = ''

        for block in self.blocks:
            block.set_library_prefix(self.library)
            str_blocks += f'\t{block.to_python_code()},\n'

        return str_blocks

    def to_python_code(self) -> str:
        str_blocks = self._all_blocks_to_python_code()

        if self.library == NNLibs.pytorch:
            return f'nn.Sequential(\n{str_blocks})'
        elif self.library == NNLibs.tensorflow:
            return f'tf.keras.models.Sequential(\n{str_blocks})'
        else:
            return ''

    def _get_first_param(self, param: str) -> str:
        """Get first value of this param from the model"""
        str_blocks = self._all_blocks_to_python_code()
        in_start = str_blocks.find(param)

        if in_start == -1:
            return ''

        in_end = str_blocks.find(',', in_start)
        feature = str_blocks[in_start:in_end]
        val_start = feature.find('=')

        return feature[val_start + 1:]

    def get_first_in_feature(self) -> int:
        """Get first 'in_feature' (from Linear)"""
        val = self._get_first_param('in_features')

        if val == '':
            return 8

        return int(val)

    def get_first_in_channels(self) -> int:
        """Get first 'in_channels' (from Conv2d)"""
        val = self._get_first_param('in_channels')

        if val == '':
            return 3

        return int(val)
