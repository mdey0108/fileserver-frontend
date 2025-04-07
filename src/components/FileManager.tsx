import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { uploadFile, getFiles, deleteFile, downloadFile } from '../services/fileService';
import { TrashIcon, ArrowDownTrayIcon, DocumentIcon } from '@heroicons/react/24/outline';

const FileManager = () => {
    const queryClient = useQueryClient();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { data: files, isLoading, error } = useQuery({
        queryKey: ['files'],
        queryFn: getFiles,
    });

    const uploadMutation = useMutation({
        mutationFn: uploadFile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files'] });
            setSelectedFile(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteFile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files'] });
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    // const handleUpload = () => {
    //     if (selectedFile) {
    //         uploadMutation.mutate(selectedFile);
    //     }
    // };

    const handleUpload = () => {
        if (!selectedFile) {
            alert("Please select a file first");
            return;
        }
        uploadMutation.mutate(selectedFile);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
                    />
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploadMutation.isPending}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
                {uploadMutation.isError && (
                    <p className="mt-2 text-sm text-red-600">Error uploading file</p>
                )}
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Your Files</h2>
                {isLoading ? (
                    <p>Loading files...</p>
                ) : error ? (
                    <p>Error loading files</p>
                ) : files && files.length > 0 ? (
                    <div className="border rounded-lg divide-y">
                        {files.map((file: any) => (
                            <div key={file.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <DocumentIcon className="h-6 w-6 text-gray-500" />
                                    <div>
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {formatFileSize(file.size)} • {file.file_type.toUpperCase()} •{' '}
                                            {new Date(file.uploaded_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => downloadFile(file.id, file.name)}
                                        className="p-2 text-gray-500 hover:text-blue-600"
                                        title="Download"
                                    >
                                        <ArrowDownTrayIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => deleteMutation.mutate(file.id)}
                                        disabled={deleteMutation.isPending}
                                        className="p-2 text-gray-500 hover:text-red-600"
                                        title="Delete"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No files uploaded yet</p>
                )}
            </div>
        </div>
    );
};

export default FileManager;