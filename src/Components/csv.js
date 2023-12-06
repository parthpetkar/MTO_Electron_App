import React from 'react';

const XlsxFileUploader = () => {
    const [downloadLink, setDownloadLink] = React.useState('');

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
            .then((response) => response.text())
            .then((message) => {
                console.log(message);
                // Set the download link for the button
                setDownloadLink('http://localhost:5000/download');
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
            });
    };

    return (
        <div>
            <h2>XLSX File Uploader</h2>
            <input type="file" onChange={handleFileChange} />
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
