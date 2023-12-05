from flask import Flask, request

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        file = request.files['file']
        file.save('uploaded_file.csv')  # Save the file to a local directory
        
        return 'File uploaded successfully!'
    except Exception as e:
        return f'Error: {str(e)}'

if __name__ == '__main__':
    app.run(debug=True, port=5000)
