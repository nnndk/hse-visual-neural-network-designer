import axios from 'axios';
import { localBaseUrl } from './environment';
import { getFileName } from './utils';
import { toast } from 'react-toastify';

export const exportBlocks = async (payload, library) => {
  try {
    const promise = axios.post(`${localBaseUrl}/get_model/`, payload);
    await toast.promise(
      promise,
      {
        pending: 'Экспорт модели...',
        success: 'Экспорт выполнен успешно',
        error: {
          render(response){
            const statusCode = response.data.response.status;
            if(statusCode == 400)
              return "Не удалось экспортировать модель!";
            else
              return "Ошибка экспорта модели!"
          }
        }
      }
    );
    getPyFile((await promise).data, getFileName(library));
  } catch (error) { }
};

export const validateModel = async (payload) => {
  try {
    const promise = axios.post(`${localBaseUrl}/validate_model/`, payload);
    await toast.promise(
      promise,
      {
        pending: 'Валидация модели...',
        success: "Модель корректна",
        error: {
          render(response){
            const statusCode = response.data.response.status;
            if(statusCode == 400)
              return "Модель не корректна!";
            else
              return "Ошибка валидации модели!"
          }
        }
      }
    );
  } catch (error) { } 
};

const getPyFile = (data, fileName) => {
    const file = new Blob([data], { type: 'application/octet-stream' });

    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(file);
    downloadLink.download = `${fileName}.py`;
    downloadLink.click();
    URL.revokeObjectURL(downloadLink);
}