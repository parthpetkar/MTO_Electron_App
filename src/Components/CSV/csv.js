import React from 'react';
import styled from 'styled-components';

// Create styled components
const Container = styled.div`
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    color: #333;
`;

const FileInput = styled.input`
    margin-bottom: 10px;
`;

const UploadButton = styled.button`
    background-color: ${props => (props.disabled ? '#aaaaaa' : '#4caf50')};
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
    font-size: 16px;
`;

const Message = styled.p`
    margin-top: 10px;
    color: #333;
`;

const DownloadButton = styled.button`
    background-color: #3498db;
`;

// Component
const XlsxFileUploader = () => {
    const [downloadLink, setDownloadLink] = React.useState('');
    const [uploadMessage, setUploadMessage] = React.useState('');
    const [isUploading, setIsUploading] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUploadClick = () => {
        if (selectedFile) {
            setIsUploading(true);
            sendFileToBackend(selectedFile);
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
            })
            .finally(() => {
                setIsUploading(false);
            });
    };

    return (
        <Container>
            <Title>CSV File Uploader</Title>
            <FileInput type="file" onChange={handleFileChange} />
            <UploadButton onClick={handleUploadClick} disabled={isUploading || !selectedFile}>
                Upload
            </UploadButton>
            {isUploading && <Message>Uploading...</Message>}
            {uploadMessage && <Message>{uploadMessage}</Message>}
            {downloadLink && (
                <div>
                    <a href={downloadLink} download="downloaded_file.xlsx">
                        <DownloadButton>Download XLSX</DownloadButton>
                    </a>
                </div>
            )}
        </Container>
    );
};

export default XlsxFileUploader;
