from typing import List
from pydantic import BaseModel
from abc import ABC, abstractmethod


class ModelToPythonCode(ABC):
    @abstractmethod
    def to_python_code(self) -> str:
        """Convert a model to python code"""
        pass


class NNBlockParam(BaseModel, ModelToPythonCode):
    name: str
    value: str | int | bool | float | None | tuple

    def to_python_code(self) -> str:
        return f'{self.name}={self.value}'


class NNBlock(BaseModel, ModelToPythonCode):
    name: str
    params: List[NNBlockParam]
    library_prefix: str = ''

    def set_library_prefix(self, lib_prefix: str) -> None:
        if lib_prefix == 'pytorch':
            self.library_prefix = 'nn'
        elif lib_prefix == 'tensorflow':
            self.library_prefix = 'tf.keras.layers'
        else:
            self.library_prefix = ''

    def _params_to_python_code(self) -> str:
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
    library: str
    blocks: List[NNBlock]

    def to_python_code(self) -> str:
        str_blocks = ''

        for block in self.blocks:
            block.set_library_prefix(self.library)
            str_blocks += f'\t{block.to_python_code()},\n'

        if self.library == 'pytorch':
            return f'nn.Sequential(\n{str_blocks})'
        elif self.library == 'tensorflow':
            return f'tf.keras.models.Sequential(\n{str_blocks})'
        else:
            return ''
