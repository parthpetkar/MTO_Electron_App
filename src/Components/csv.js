import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const XlsxToCsvConverter = () => {
    const [csvData, setCsvData] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
                setCsvData(csvData);

                // Send the file to the backend
                sendFileToBackend(file);
            };
            reader.readAsBinaryString(file);
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
                // You can add additional logic here if needed
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
            });
    };

    return (
        <div>
            <h2>XLSX to CSV Converter</h2>
            <input type="file" onChange={handleFileChange} />
        </div>
    );
};

export default XlsxToCsvConverter;
