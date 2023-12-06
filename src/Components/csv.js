import React from 'react';

const XlsxFileUploader = () => {
    const [downloadLink, setDownloadLink] = React.useState('');
    const [uploadMessage, setUploadMessage] = React.useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            // Send the file to the backend
            sendFileToBackend(file);
        }
    };

    const sendFileToBackend = (file) => {
        const formData = new FormData();
        formData.append('file', file);

        fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`File upload failed: ${response.statusText}`);
                }
                return response.text();
            })
            .then((message) => {
                console.log(message);
                setDownloadLink('http://localhost:5000/download');
                setUploadMessage('File uploaded successfully!');
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
                setUploadMessage('Error uploading file. Please try again.');
            });
    };

    return (
        <div>
            <h2>CSV File Uploader</h2>
            <input type="file" onChange={handleFileChange} />
            {uploadMessage && <p>{uploadMessage}</p>}
            {downloadLink && (
                <div>
                    <a href={downloadLink} download="downloaded_file.xlsx">
                        <button>Download XLSX</button>
                    </a>
                </div>
            )}
        </div>
    );
};

export default XlsxFileUploader;
