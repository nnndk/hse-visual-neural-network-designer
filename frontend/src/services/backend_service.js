import axios from 'axios';
import { localBaseUrl } from './environment';
import { getFileName } from './utils';
import { toast, Bounce } from 'react-toastify';

const exportBlocks = async (payload, library) => {
  try {
    console.log(payload);

    const response = await axios.post(`${localBaseUrl}/get_model/`, payload);

    if(response.status == 200){
        getPyFile(response.data, getFileName(library));
        return;
    }


  } catch (error) {
    toast.error('🦄 Ошибка экспорта!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });
  }
};

const getPyFile = (data, fileName) => {
    const file = new Blob([data], { type: 'application/octet-stream' });

    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(file);
    downloadLink.download = `${fileName}.py`;
    downloadLink.click();
    URL.revokeObjectURL(downloadLink);
}

export default exportBlocks;