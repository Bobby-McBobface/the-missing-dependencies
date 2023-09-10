import operator
from collections import deque
from dataclasses import dataclass
from enum import Enum
from typing import NamedTuple

from PIL import Image


class PietException(Exception):
    ...


class StackUnderflow(PietException):
    ...


class PietStack(list[int]):
    def pop(self):
        if len(self) == 0:
            return 0
            # raise StackUnderflow()
        return super().pop()

    def _pop2(self):
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
        self.append(self[-1])

    def roll(self):
        times = self.pop()
        depth = self.pop()

        tmp = deque(self[-depth:])
        tmp.rotate(times)
        # print(tmp)
        del self[-depth:]

        while tmp:
            self.append(tmp.popleft())

    def input(self):
        inp = input()
        if inp.isnumeric():
            self.append(int(inp))
        else:
            self.append(ord(inp))

    def outint(self):
        print(self.pop(), end="")

    def outchar(self):
        # print(self)
        print(chr(self.pop()), end="")

    def inint(self):
        self.append(int(input("Enter number: ")))

    def inchar(self):
        self.append(ord(input("Enter character: ")))


class Coordinate(NamedTuple):
    x: int
    y: int


@dataclass
class CardinalDirection:
    RIGHT = Coordinate(1, 0)
    DOWN = Coordinate(0, 1)
    LEFT = Coordinate(-1, 0)
    UP = Coordinate(0, -1)

    CLOCKWISE = [RIGHT, DOWN, LEFT, UP]


class DirectionPointer:
    def __init__(self) -> None:
        self.direction = CardinalDirection.RIGHT
        self.index = 0

    def rotate(self, steps):
        self.index += steps
        self.index %= 4
        self.direction = CardinalDirection.CLOCKWISE[self.index]

        # print("pointing", self.direction)


@dataclass
class LeftRight(Enum):
    LEFT = "left"
    RIGHT = "right"


class CodelChooser:
    def __init__(self) -> None:
        self.direction = LeftRight.LEFT

    def switch(self, times):
        if times % 2 == 1:
            if self.direction == LeftRight.LEFT:
                self.direction = LeftRight.RIGHT
            else:
                self.direction = LeftRight.LEFT


@dataclass
class Block:
    value: int
    colour: tuple[int, int, int]
    rightup: Coordinate
    rightdown: Coordinate
    downleft: Coordinate
    downright: Coordinate
    leftup: Coordinate
    leftdown: Coordinate
    upleft: Coordinate
    upright: Coordinate


COLOURS = [
    (255, 192, 192),  # Light red
    (255, 0, 0),  # Red
    (192, 0, 0),  # Dark red
    (255, 255, 192),  # Light yellow
    (255, 255, 0),  # Yellow
    (192, 192, 0),  # Dark yellow
    (192, 255, 192),  # Light green
    (0, 255, 0),  # Green
    (0, 192, 0),  # Dark green
    (192, 255, 255),  # Light cyan
    (0, 255, 255),  # Cyan
    (0, 192, 192),  # Dark cyan
    (192, 192, 255),  # Light blue
    (0, 0, 255),  # Blue
    (0, 0, 192),  # Dark blue
    (255, 192, 255),  # Light magenta
    (255, 0, 255),  # Magenta
    (192, 0, 192),  # Dark magenta
]

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)


class HueLightChanges(NamedTuple):
    hue_change: int
    lightness_change: int


class PietInterpreter:
    def __init__(self, img: Image.Image) -> None:
        self.direction_pointer = DirectionPointer()
        self.codel_chooser = CodelChooser()
        self.img = img.convert("RGB")
        self.stack = PietStack()

    def runner(self):
        x = y = 0

        while True:
            block = self.get_block(x, y)

            for tries in range(8):
                if self.direction_pointer.direction == CardinalDirection.RIGHT:
                    if self.codel_chooser.direction == LeftRight.LEFT:
                        next_pixel = block.rightup
                    else:
                        next_pixel = block.rightdown
                    next_pixel = next_pixel.x + 1, next_pixel.y
                elif self.direction_pointer.direction == CardinalDirection.DOWN:
                    if self.codel_chooser.direction == LeftRight.LEFT:
                        next_pixel = block.downleft
                    else:
                        next_pixel = block.downright
                    next_pixel = next_pixel.x, next_pixel.y + 1
                elif self.direction_pointer.direction == CardinalDirection.LEFT:
                    if self.codel_chooser.direction == LeftRight.LEFT:
                        next_pixel = block.leftdown
                    else:
                        next_pixel = block.leftup
                    next_pixel = next_pixel.x - 1, next_pixel.y
                else:
                    if self.codel_chooser.direction == LeftRight.LEFT:
                        next_pixel = block.upleft
                    else:
                        next_pixel = block.upright
                    next_pixel = next_pixel.x, next_pixel.y - 1

                nx, ny = next_pixel

                # print(f"{next_pixel=}")

                if (
                    nx < 0
                    or nx >= self.img.width
                    or ny < 0
                    or ny >= self.img.height
                    or (next_colour := self.img.getpixel(next_pixel)) == BLACK
                ):
                    # Obstructed, turn it around
                    # print(f'obstructed, {block} {next_pixel=}')
                    if tries > 0 and tries % 2 == 0:
                        self.direction_pointer.rotate(1)
                    if tries % 2 == 1:
                        self.codel_chooser.switch(1)
                else:
                    break
            else:
                print("Terminated")
                return

            if next_colour == WHITE:
                x, y = self.get_furthest_edge(x, y)
                continue

            hue_change, light_change = self.colour_change(block.colour, next_colour)

            if light_change == 0:
                if hue_change == 0:
                    ...
                elif hue_change == 1:
                    self.stack.add()
                    # print('add', self.stack)
                elif hue_change == 2:
                    self.stack.div()
                    # print('div', self.stack)
                elif hue_change == 3:
                    self.stack.gt()
                    # print('grt', self.stack)
                elif hue_change == 4:
                    self.stack.dup()
                    # print('dup', self.stack)
                elif hue_change == 5:
                    self.stack.inchar()
                    # print("in char")
            elif light_change == 1:
                if hue_change == 0:
                    self.stack.append(block.value)
                    # print('push', block.value, self.stack)
                elif hue_change == 1:
                    self.stack.sub()
                    # print('sub', self.stack)
                elif hue_change == 2:
                    self.stack.mod()
                    # print('mod', self.stack)
                elif hue_change == 3:
                    self.direction_pointer.rotate(self.stack.pop())
                    # print('point', self.stack)
                elif hue_change == 4:
                    self.stack.roll()
                    # print('roll', self.stack)
                elif hue_change == 5:
                    self.stack.outint()
                    # print('print', self.stack)
            elif light_change == 2:
                if hue_change == 0:
                    self.stack.pop()
                    # print('pop', self.stack)
                elif hue_change == 1:
                    self.stack.mul()
                    # print('mul', self.stack)
                elif hue_change == 2:
                    self.stack.not_()
                    # print('not', self.stack)
                elif hue_change == 3:
                    self.codel_chooser.switch(self.stack.pop())
                    # print('swi', self.stack)
                elif hue_change == 4:
                    self.stack.inint()
                elif hue_change == 5:
                    self.stack.outchar()

            x, y = nx, ny

    def colour_change(self, colour_from, colour_to):
        if colour_from == WHITE or colour_to == BLACK:
            return HueLightChanges(0, 0)

        indexStart = COLOURS.index(colour_from)
        indexEnd = COLOURS.index(colour_to)

        hue_change = (int(indexEnd / 3) - int(indexStart / 3)) % 6
        lightChange = (indexEnd - indexStart) % 3

        return HueLightChanges(hue_change, lightChange)

    def get_furthest_edge(self, x, y):
        previous_color = self.img.getpixel((x, y))

        while True:
            x += self.direction_pointer.direction.x
            y += self.direction_pointer.direction.y

            if x < 0 or x > self.img.width or y < 0 or y > self.img.height:
                return x, y

            if self.img.getpixel((x, y)) != previous_color:
                return x, y

    def get_block(self, x, y) -> Block:
        q = deque([(x, y)])
        current_colour = self.img.getpixel((x, y))
        visited = set()
        in_block = []

        minX = self.img.width
        minY = self.img.height
        maxX = 0
        maxY = 0

        while q:
            x, y = q.pop()

            if (x, y) in visited:
                continue

            visited.add((x, y))

            if x < 0 or x >= self.img.width or y < 0 or y >= self.img.height:
                continue
            if self.img.getpixel((x, y)) != current_colour:
                continue

            in_block.append((x, y))

            minX, maxX, minY, maxY = (
                min(minX, x),
                max(maxX, x),
                min(minY, y),
                max(maxY, y),
            )

            q.append((x + 1, y))
            q.append((x - 1, y))
            q.append((x, y + 1))
            q.append((x, y - 1))

        leftup = Coordinate(-1, self.img.height + 1)
        rightup = Coordinate(-1, self.img.height + 1)

        rightdown = Coordinate(-1, -1)
        leftdown = Coordinate(-1, -1)

        upleft = Coordinate(self.img.width + 1, -1)
        upright = Coordinate(-1, -1)

        downright = Coordinate(-1, -1)
        downleft = Coordinate(self.img.width + 1, -1)

        for blockX, blockY in in_block:
            # DP Right
            if blockX == maxX:
                # CC left
                if blockY < rightup.y:
                    rightup = Coordinate(blockX, blockY)

                # CC right
                if blockY > rightdown.y:
                    rightdown = Coordinate(blockX, blockY)

            # DP Down
            if blockY == maxY:
                # CC left
                if blockX > downright.x:
                    downright = Coordinate(blockX, blockY)

                # CC right
                if blockX < downleft.x:
                    downleft = Coordinate(blockX, blockY)

            # DP left
            if blockX == minX:
                # CC left
                if blockY > leftdown.y:
                    leftdown = Coordinate(blockX, blockY)

                if blockY < leftup.y:
                    leftup = Coordinate(blockX, blockY)

            # DP up
            if blockY == minY:
                # CC left
                if blockX > upright.x:
                    upright = Coordinate(blockX, blockY)
                if blockX < upleft.x:
                    upleft = Coordinate(blockX, blockY)

        return Block(
            len(in_block),
            current_colour,
            rightup,
            rightdown,
            downleft,
            downright,
            leftup,
            leftdown,
            upleft,
            upright,
        )


if __name__ == "__main__":
    test = Image.open("./tests/piet_hello4.png")
    inter = PietInterpreter(test)

    inter.runner()
