import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const getFiles = async () => {
  const response = await axios.get(`${API_URL}/files/`);
  return response.data;
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_URL}/files/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteFile = async (id: number) => {
  await axios.delete(`${API_URL}/files/${id}/`);
};

export const downloadFile = async (id: number, filename: string) => {
  const response = await axios.get(`${API_URL}/files/${id}/`, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};