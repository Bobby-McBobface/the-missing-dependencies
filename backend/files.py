import os

from flask import Flask, jsonify, request

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"  # Directory to store uploaded files

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.route("/files", methods=["GET"])
def list_files():
    try:
        # List files in the UPLOAD_FOLDER directory
        files = os.listdir(UPLOAD_FOLDER)
        return jsonify({"files": files}), 200
    except Exception as e:
        return str(e), 500


@app.route("/files", methods=["POST"])
def upload_file():
    try:
        uploaded_file = request.files["file"]
        if uploaded_file:
            file_path = os.path.join(UPLOAD_FOLDER, uploaded_file.filename)
            uploaded_file.save(file_path)
            return jsonify({"message": "File uploaded successfully"}), 200
        else:
            return jsonify({"error": "No file provided"}), 400
    except Exception as e:
        return str(e), 500


if __name__ == "__main__":
    app.run(debug=True)
