import consts
import numpy as np
from numpy.typing import NDArray
from PIL import Image


class ImageAes128:
    def __init__(self, key: NDArray[np.uint8]):
        self._expkeys = self._expand_key(key)

    def encrypt_image_as_image(self, image: Image.Image) -> Image.Image:
        return Image.fromarray(self.encrypt_image_as_array(image), image.mode)

    def decrypt_image_as_image(self, image: Image.Image) -> Image.Image:
        return Image.fromarray(self.decrypt_image_as_array(image), image.mode)

    def encrypt_image_as_array(self, image: Image.Image) -> NDArray[np.uint8]:
        w, h = image.size
        img = np.array(image, np.uint8)
        enc_image = np.zeros((h, w, 3), np.uint8)
        for row in range(0, h, 4):
            for col in range(0, w, 4):
                for d in range(3):
                    enc_image[row : row + 4, col : col + 4, d] = self._encrypt_block(
                        img[row : row + 4, col : col + 4, d]
                    )
        return enc_image

    def decrypt_image_as_array(self, image: Image.Image) -> NDArray[np.uint8]:
        w, h = image.size
        img = np.array(image, np.uint8)
        dec_image = np.zeros((h, w, 3), np.uint8)
        for row in range(0, h, 4):
            for col in range(0, w, 4):
                for d in range(3):
                    dec_image[row : row + 4, col : col + 4, d] = self._decrypt_block(
                        img[row : row + 4, col : col + 4, d]
                    )
        return dec_image

    def _encrypt_block(self, state: NDArray[np.uint8]) -> NDArray[np.uint8]:
        keyi = 0
        self._add_round_key(state, self._expkeys[keyi : keyi + 4])
        keyi += 4
        rounds = len(self._expkeys) // 4 - 2

        for _ in range(rounds):
            self._sub_bytes(state)
            self._shift_rows(state)
            self._mix_columns(state)
            self._add_round_key(state, self._expkeys[keyi : keyi + 4])
            keyi += 4

        self._sub_bytes(state)
        self._shift_rows(state)
        self._add_round_key(state, self._expkeys[keyi : keyi + 4])

        return state

    def _decrypt_block(self, state: NDArray[np.uint8]) -> NDArray[np.uint8]:
        keyi = len(self._expkeys) - 4
        self._add_round_key(state, self._expkeys[keyi : keyi + 4])
        keyi -= 4
        rounds = len(self._expkeys) // 4 - 2

        for _ in range(rounds):
            self._inv_shift_rows(state)
            self._inv_sub_bytes(state)
            self._add_round_key(state, self._expkeys[keyi : keyi + 4])
            keyi -= 4
            self._inv_mix_columns(state)

        self._inv_shift_rows(state)
        self._inv_sub_bytes(state)
        self._add_round_key(state, self._expkeys[keyi : keyi + 4])

        return state

    def _inv_sub_bytes(self, state: NDArray[np.uint8]):
        for i in range(len(state)):
            state[i] = self._inv_sub_word(state[i])

    def _sub_bytes(self, state: NDArray[np.uint8]):
        for i in range(len(state)):
            state[i] = self._sub_word(state[i])

    def _inv_shift_rows(self, state: NDArray[np.uint8]):
        for i in range(1, 4):
            state[i] = np.roll(state[i], i)

    def _shift_rows(self, state: NDArray[np.uint8]):
        for i in range(1, 4):
            state[i] = np.roll(state[i], -i)

    def _inv_mix_columns(self, state: NDArray[np.uint8]):
        def calc_inv_mix_cols(
            a0: np.uint8, a1: np.uint8, a2: np.uint8, a3: np.uint8
        ) -> NDArray[np.uint8]:
            # 14*a0 + 11*a1 + 13*a2 +  9*a3
            r0 = (
                consts.Gmul14[a0]
                ^ consts.Gmul11[a1]
                ^ consts.Gmul13[a2]
                ^ consts.Gmul9[a3]
            )
            #  9*a0 + 14*a1 + 11*a2 + 13*a3
            r1 = (
                consts.Gmul9[a0]
                ^ consts.Gmul14[a1]
                ^ consts.Gmul11[a2]
                ^ consts.Gmul13[a3]
            )
            # 13*a0 +  9*a1 + 14*a2 + 11*a3
            r2 = (
                consts.Gmul13[a0]
                ^ consts.Gmul9[a1]
                ^ consts.Gmul14[a2]
                ^ consts.Gmul11[a3]
            )
            # 11*a0 + 13*a1 +  9*a2 + 14*a3
            r3 = (
                consts.Gmul11[a0]
                ^ consts.Gmul13[a1]
                ^ consts.Gmul9[a2]
                ^ consts.Gmul14[a3]
            )
            return np.array([r0, r1, r2, r3], np.uint8)

        for i in range(4):
            state[:, i] = calc_inv_mix_cols(*state[:, i])

    def _mix_columns(self, state: NDArray[np.uint8]):
        def calc_mix_cols(
            a0: np.uint8, a1: np.uint8, a2: np.uint8, a3: np.uint8
        ) -> NDArray[np.uint8]:
            r0 = (
                consts.Gmul2[a0] ^ consts.Gmul3[a1] ^ a2 ^ a3
            )  # 2*a0 + 3*a1 + a2   + a3
            r1 = (
                a0 ^ consts.Gmul2[a1] ^ consts.Gmul3[a2] ^ a3
            )  # a0   + 2*a1 + 3*a2 + a3
            r2 = (
                a0 ^ a1 ^ consts.Gmul2[a2] ^ consts.Gmul3[a3]
            )  # a0   + a1   + 2*a2 + 3*a3
            r3 = (
                consts.Gmul3[a0] ^ a1 ^ a2 ^ consts.Gmul2[a3]
            )  # 3*a0 + a1   + a2   + 2*a3
            return np.array([r0, r1, r2, r3], np.uint8)

        for i in range(4):
            state[:, i] = calc_mix_cols(*state[:, i])

    def _add_round_key(self, state: NDArray[np.uint8], key: NDArray[np.uint8]):
        state ^= key

    def _expand_key(self, key: NDArray[np.uint8]) -> NDArray[np.uint8]:
        nwords, rounds = 4, 10
        _expkeys = np.zeros((nwords * (rounds + 1), 4), np.uint8)

        # first slot in the key expansion is occupied by the key itself
        i = 0
        while i < nwords:
            _expkeys[i] = key[i]
            i += 1

        while i < 4 * (rounds + 1):
            _expkeys[i] = _expkeys[i - 1]
            _expkeys[i] = np.roll(_expkeys[i], -1)
            _expkeys[i] = self._sub_word(_expkeys[i])
            _expkeys[i] ^= self._round_constant(i // nwords - 1)
            _expkeys[i] ^= _expkeys[i - nwords]

            for j in range(1, 4):
                _expkeys[i + j] = _expkeys[i + j - 1] ^ _expkeys[i + j - nwords]

            i += nwords

        for j in range(0, len(_expkeys), 4):
            _expkeys[j : j + 4] = np.transpose(_expkeys[j : j + 4])

        return _expkeys

    def _inv_sub_word(self, word: NDArray[np.uint8]) -> NDArray[np.uint8]:
        return np.array([consts.Invsbox[x] for x in word], np.uint8)

    def _sub_word(self, word: NDArray[np.uint8]) -> NDArray[np.uint8]:
        return np.array([consts.Sbox[x] for x in word], np.uint8)

    def _round_constant(self, i: int) -> NDArray[np.uint8]:
        return np.array([consts.POWX[i], 0, 0, 0], np.uint8)
