import io
import os
import sys

from PIL import Image

from src.language_processing import PietInterpreter, python_runner


def test_python():
    byte_str = b'print("Hello, world!")'
    captured_output = python_runner(byte_str)
    assert captured_output.strip() == "Hello, world!"


def test_piet():
    for file in os.listdir("./tests/imgs"):
        filename = os.fsdecode(file)
        im = Image.open(f"./tests/imgs/{filename}")

        stdout_backup = sys.stdout
        sys.stdout = io.StringIO()
        PietInterpreter(im).runner()
        captured_output = sys.stdout.getvalue()
        sys.stdout = stdout_backup

        assert captured_output.strip() == "Hello, world!"
