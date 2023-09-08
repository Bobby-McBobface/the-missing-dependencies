import operator
from enum import Enum


class PietException(Exception):
    ...


class StackUnderflow(PietException):
    ...


class PietStack(list[int]):
    def _pop2(self):
        if len(self) < 2:
            raise StackUnderflow()
        top = self.pop()
        bottom = self.pop()
        return bottom, top  # Make subtracting and dividing easier

    def add(self):
        self.append(operator.add(*self._pop2()))

    def sub(self):
        self.append(operator.sub(*self._pop2()))

    def mul(self):
        self.append(operator.mul(*self._pop2()))

    def div(self):
        self.append(operator.floordiv(*self._pop2()))

    def mod(self):
        self.append(operator.mod(*self._pop2()))

    def not_(self):
        val = self.pop()
        if val == 0:
            self.append(1)
        else:
            self.append(0)

    def gt(self):
        self.append(int(operator.gt(*self._pop2())))

    def dup(self):
        val = self.pop()
        self.append(val)
        self.append(val)

    def roll(self):
        ...  # TODO

    def input(self):
        inp = input()
        if inp.isnumeric():
            self.append(int(inp))
        else:
            self.append(ord(inp))

    def outint(self):
        print(self.pop())

    def outchar(self):
        print(chr(self.pop()))


class DirectionPointer:
    def __init__(self) -> None:
        class Direction(Enum):
            UP = (0, 1)
            DOWN = (0, -1)
            LEFT = (-1, 0)
            RIGHT = (0, 1)

        self.direction: Direction = Direction.RIGHT


class CodelChooser:
    def __init__(self) -> None:
        class Direction(Enum):
            LEFT = (-1, 0)
            RIGHT = (0, 1)

        self.direction: Direction = Direction.LEFT


def piet_runner():
    pass
