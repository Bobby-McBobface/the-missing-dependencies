import io
import sys

from PIL import Image


def python_runner(byte_str: bytes):
    decoded_text = byte_str.decode("utf-8")

    stdout_backup = sys.stdout
    sys.stdout = io.StringIO()

    try:
        exec(decoded_text)
        captured_output = sys.stdout.getvalue()
    finally:
        sys.stdout = stdout_backup

    return captured_output
