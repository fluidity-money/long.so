use crate::types::{TickBitmap, U256Extension, U256};
use crate::{error::Error, maths::bit_math};

//Returns next and initialized
//current_word is the current word in the TickBitmap of the pool based on `tick`. TickBitmap[word_pos] = current_word
//Where word_pos is the 256 bit offset of the ticks word_pos.. word_pos := tick >> 8
pub fn next_initialized_tick_within_one_word(
    tick_bitmap: &TickBitmap,
    tick: i32,
    tick_spacing: i32,
    lte: bool,
) -> Result<(i32, bool), Error> {
    let compressed = tick / tick_spacing;

    let (word_pos, bit_pos) = position(compressed);

    if lte {
        let mask = (U256::one().wrapping_shl(bit_pos.into())) - U256::one()
            + (U256::one().wrapping_shl(bit_pos.into()));

        let masked = tick_bitmap.get(word_pos) & mask;

        let initialized = !masked.is_zero();

        let next = if initialized {
            (compressed
                - (bit_pos
                    .overflowing_sub(bit_math::most_significant_bit(masked)?)
                    .0) as i32)
                * tick_spacing
        } else {
            (compressed - bit_pos as i32) * tick_spacing
        };

        Ok((next, initialized))
    } else {
        let mask = !((U256::one().wrapping_shl(bit_pos.into())) - U256::one());

        let masked = tick_bitmap.get(word_pos) & mask;

        let initialized = !masked.is_zero();

        let next = if initialized {
            (compressed
                + 1
                + (bit_math::least_significant_bit(masked)?
                    .overflowing_sub(bit_pos)
                    .0) as i32)
                * tick_spacing
        } else {
            (compressed + 1 + ((0xFF - bit_pos) as i32)) * tick_spacing
        };

        Ok((next, initialized))
    }
}

// returns (int16 wordPos, uint8 bitPos)
pub fn position(tick: i32) -> (i16, u8) {
    ((tick >> 8) as i16, (tick % 256) as u8)
}
