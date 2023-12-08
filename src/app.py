from flask import Flask, request, send_file
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def calculate_total_quantity(file_path):
    # Read the CSV file
    data = pd.read_csv(file_path)

    # Label encoding for categorical columns
    label_encoder_service = LabelEncoder()
    data['SERVICE'] = label_encoder_service.fit_transform(data['SERVICE'])

    label_encoder_size1 = LabelEncoder()
    data['SIZE 1'] = label_encoder_size1.fit_transform(data['SIZE 1'])

    label_encoder_size2 = LabelEncoder()
    data['SIZE 2'] = label_encoder_size2.fit_transform(data['SIZE 2'])

    label_encoder_item = LabelEncoder()
    data['ITEM'] = label_encoder_item.fit_transform(data['ITEM'])

    # Group by the specified columns and sum the quantities
    grouped_data = data.groupby(['SERVICE', 'SIZE 1', 'SIZE 2', 'ITEM'])['QTY'].sum().reset_index()

    # Save the grouped data to a temporary CSV file
    temp_grouped_csv_path = 'temp_grouped.csv'
    grouped_data.to_csv(temp_grouped_csv_path, index=False)

    return temp_grouped_csv_path, label_encoder_service, label_encoder_size1, label_encoder_size2, label_encoder_item

def reverse_encode(data, label_encoder_service, label_encoder_size1, label_encoder_size2, label_encoder_item):
    # Reverse label encoding for categorical columns
    data['SERVICE'] = label_encoder_service.inverse_transform(data['SERVICE'])
    data['SIZE 1'] = label_encoder_size1.inverse_transform(data['SIZE 1'])
    data['SIZE 2'] = label_encoder_size2.inverse_transform(data['SIZE 2'])
    data['ITEM'] = label_encoder_item.inverse_transform(data['ITEM'])

    return data

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        file = request.files['file']

        # Assuming the uploaded file is a CSV, you may want to validate this
        data = pd.read_csv(file)

        # Save the data to a temporary CSV file
        temp_csv_path = 'temp.csv'
        data.to_csv(temp_csv_path, index=False)

        # Calculate total quantity and save the grouped data to a temporary CSV file
        temp_grouped_csv_path, label_encoder_service, label_encoder_size1, label_encoder_size2, label_encoder_item = calculate_total_quantity(temp_csv_path)

        return f'File uploaded successfully! Grouped data saved to: {temp_grouped_csv_path}'
    except Exception as e:
        return f'Error: {str(e)}'

@app.route('/download', methods=['GET'])
def download_file():
    try:
        # Convert CSV to XLSX
        temp_grouped_csv_path, label_encoder_service, label_encoder_size1, label_encoder_size2, label_encoder_item = calculate_total_quantity('temp.csv')
        temp_xlsx_path = 'downloaded_file.xlsx'
        grouped_data = pd.read_csv(temp_grouped_csv_path)

        # Reverse label encoding before saving to XLSX
        grouped_data_reverse = reverse_encode(grouped_data.copy(), label_encoder_service, label_encoder_size1, label_encoder_size2, label_encoder_item)

        grouped_data_reverse.to_excel(temp_xlsx_path, index=False)

        # Send the XLSX file for download
        return send_file(temp_xlsx_path, as_attachment=True, download_name='downloaded_file.xlsx')
    except Exception as e:
        return f'Error: {str(e)}'

if __name__ == '__main__':
    app.run(debug=True, port=5000)
