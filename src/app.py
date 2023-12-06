from flask import Flask, request, send_file
import pandas as pd
import os

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        file = request.files['file']

        # Save the XLSX file temporarily
        temp_xlsx_path = 'temp.xlsx'
        file.save(temp_xlsx_path)

        # Convert XLSX to CSV
        temp_csv_path = 'temp.csv'
        data = pd.read_excel(temp_xlsx_path)
        data = pd.read_excel(temp_xlsx_path, converters={'SIZE 1': int, 'SIZE 2': int, 'QTY': int})
        data.to_csv(temp_csv_path, index=False)

        # Clean up temporary XLSX file
        os.remove(temp_xlsx_path)

        return 'File uploaded successfully!'
    except Exception as e:
        return f'Error: {str(e)}'

@app.route('/download', methods=['GET'])
def download_file():
    try:
        # Convert CSV to XLSX
        temp_csv_path = 'temp.csv'
        temp_xlsx_path = 'downloaded_file.xlsx'
        data = pd.read_csv(temp_csv_path)
        data.to_excel(temp_xlsx_path, index=False)

        # Send the XLSX file for download
        return send_file(temp_xlsx_path, as_attachment=True, download_name='downloaded_file.xlsx')
    except Exception as e:
        return f'Error: {str(e)}'
    finally:
        # Clean up temporary CSV file
        os.remove(temp_csv_path)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
