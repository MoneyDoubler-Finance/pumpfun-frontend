use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Burn, burn};

#[derive(Accounts)]
pub struct BuyBackAndBurn<'info> {
    #[account(mut)]
    pub fee_treasury: Signer<'info>,
    #[account(mut)]
    pub buyer_token_account: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub mint: Box<Account<'info, anchor_spl::token::Mint>>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<BuyBackAndBurn>, lamports: u64) -> Result<()> {
    // Use lamports from fee_treasury to buy tokens by re-invoking buy ix
    // (simplified: assume tokens already in buyer_token_account)
    // Immediately burn them
    let signer_seeds: &[&[&[u8]]] = &[&[b"fee_treasury"]];
    burn(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.buyer_token_account.to_account_info(),
                authority: ctx.accounts.fee_treasury.to_account_info(),
            },
            signer_seeds,
        ),
        ctx.accounts.buyer_token_account.amount,
    )?;
    emit!(BuyBack { lamports_used: lamports });
    Ok(())
}

#[event]
pub struct BuyBack {
    pub lamports_used: u64,
} 