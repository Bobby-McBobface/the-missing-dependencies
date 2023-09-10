from flask import Flask, send_file

app = Flask(__name__)


@app.route("/download/<filename>", methods=["GET"])
def download_file(filename):
    try:
        # Replace 'path_to_files' with the directory containing the files
        return send_file(f"path_to_files/{filename}", as_attachment=True)
    except Exception as e:
        return str(e), 500


if __name__ == "__main__":
    app.run(debug=True)
