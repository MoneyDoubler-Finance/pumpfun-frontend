use anchor_lang::prelude::*;
use crate::states::Global;

#[derive(Accounts)]
pub struct CreateGlobal<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = Global::LEN,
        seeds = [Global::SEED_PREFIX.as_bytes()],
        bump
    )]
    pub global: Account<'info, Global>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateGlobal>, _platform_fee_bps: u16) -> Result<()> {
    let global = &mut ctx.accounts.global;
    global.authority = ctx.accounts.authority.key();
    global.bump = ctx.bumps.global;
    // derive deterministic fee treasury PDA
    let (fee_treasury, _bump) =
        Pubkey::find_program_address(&[b"fee_treasury"], ctx.program_id);
    global.fee_treasury = fee_treasury;
    global.total_fees_collected = 0;
    Ok(())
} 