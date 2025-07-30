use anchor_lang::prelude::*;

#[account]
pub struct Global {
    pub authority: Pubkey,
    pub bump: u8,
    /// PDA that accumulates creator/dev fees in lamports
    pub fee_treasury: Pubkey,
    /// Total lamports ever diverted into fee_treasury (for stats)
    pub total_fees_collected: u64,
}

impl Global {
    pub const SEED_PREFIX: &'static str = "global";
    pub const LEN: usize = 32 + 1 + 32 + 8;
} 