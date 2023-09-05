import io
import sys


def runner(byte_str: bytes):
    decoded_text = byte_str.decode("ansi")

    stdout_backup = sys.stdout
    sys.stdout = io.StringIO()

    try:
        exec(decoded_text)
        captured_output = sys.stdout.getvalue()
    finally:
        sys.stdout = stdout_backup

    return captured_output
