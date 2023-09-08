from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/run', methods=['POST'])
def run_code():
    code = request.json.get('code')  # Assuming the code is sent as a JSON object

    try:
        # Run the code
        def execute():
            output = code  # Replace this with the code execution logic
            return output

        return jsonify({'message': 'Code ran successfully!', 'output': execute()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
