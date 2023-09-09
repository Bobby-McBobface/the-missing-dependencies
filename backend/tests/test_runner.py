from language_processing import runner


def test_processing():
    byte_str = b'print("Hello, world!")'
    captured_output = runner(byte_str)
    assert captured_output.strip() == "Hello, world!"
