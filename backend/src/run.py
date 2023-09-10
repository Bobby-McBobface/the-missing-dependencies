import os
import io
import sys
from random import randint
from pathlib import Path

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
import numpy as np

from language_processing.piet_runner import PietInterpreter
from encryption.image_aes import ImageAes128

app = Flask(__name__)
CORS(app)


USER_DIR = Path('../user_files')
USER_ENC_DIR = Path('../user_enc')
IMAGE_SIZE = 12
CODEC = ImageAes128()

MAPPING = [tuple([30,41,59]) for _ in range(256)]
for i in range(1, 256):
    MAPPING[i] = tuple(randint(128, 255) for _ in range(3)) 

REV_MAPPING = dict()
for i, color in enumerate(MAPPING):
    REV_MAPPING[color] = i

def new_image_arr():
    return np.array([[tuple([30,41,59])]*IMAGE_SIZE for _ in range(IMAGE_SIZE)], np.uint8)

@app.route('/mapping', methods=['GET'])
def get_mapping():
    return jsonify(MAPPING), 200

@app.route('/run', methods=['POST'])
def run_code():
    code_img = request.json # Assuming the code is sent as a JSON object
    im = Image.fromarray(np.array(code_img, np.uint8))

    try:
        stdout_backup = sys.stdout
        sys.stdout = io.StringIO()
        PietInterpreter(im).runner()
        captured_output = sys.stdout.getvalue()
        sys.stdout = stdout_backup
        return captured_output, 200
    except Exception as e:
        print('/run', e)
        return str(e), 500

@app.route('/files', methods=['GET'])
def list_files():
    try:
        files = os.listdir(USER_DIR)
        return jsonify(files), 200
    except Exception as e:
        print('/files', e)
        return str(e), 500

@app.route('/files/<filename>', methods=['DELETE'])
def delete_file(filename):
    try:
        os.remove(USER_DIR/filename)
        return '', 200
    except Exception as e:
        return str(e), 500

@app.route('/files/<filename>', methods=['POST'])
def create_file(filename):
    try:
        img_arr = new_image_arr()
        image = Image.fromarray(img_arr, 'RGB')
        image.save(USER_DIR / filename)
        return '', 200
    except Exception as e:
        return str(e), 500


@app.route('/files/<filename>', methods=['PUT'])
def save_file(filename):
    try:
        code_img_arr = np.array(request.json, np.uint8)
        code_img = Image.fromarray(code_img_arr, 'RGB')
        filepath = USER_DIR / Path(filename)
        code_img.save(filepath, 'PNG')
        return '', 200
    except Exception as e:
        print('/files:post', e)
        return str(e), 500
    
@app.route('/files/<filename>', methods=['GET'])
def get_file(filename):
    try:
        filepath = USER_DIR / filename
        with Image.open(filepath) as image: 
            image_arr = np.array(image, np.uint8).tolist()
        return jsonify(image_arr), 200
    except Exception as e:
        print('/files/filename', e)
        return str(e), 500


@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
        filepath = USER_DIR / filename
        with Image.open(filepath) as image:
            enc_image = CODEC.encrypt_image_as_image(image)
            enc_image.save(USER_ENC_DIR / ('encrypted_'+filename), format='PNG')
        
        return send_from_directory(USER_ENC_DIR, 'encrypted_'+filename, as_attachment=True)
    
    except Exception as e:
        print('/download', e)
        return str(e), 500

@app.route('/upload-encrypted', methods=['POST'])
def upload_encrypted():
    f = request.files['file']
    img = Image.open(f.stream)
    img = CODEC.decrypt_image_as_image(img)
    filename = f.filename[len('encrypted_'):] # type: ignore
    
    img.save(USER_DIR/Path((filename+'.png')).name)
    return '', 200


if __name__ == '__main__':
    app.run(debug=True)
