use anchor_lang::prelude::*;
use anchor_lang::system_program;
declare_id!("7315G26yoNcSxQtmMT25k86ktZ319SecsPPzxeZRmN9J");
#[program]
pub mod anchorcontracts {
    use super::*;

    const DEPOSIT_AMOUNT: u64 = 100000000; // 0.1 SOL

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
    pub fn initialize_user_deposit(_ctx: Context<CreateUserDeposit>) -> Result<()>
    {
        Ok(())
    }

    pub fn deposit(_ctx: Context<Deposit>, data:UserDeposit) -> Result<()>
    {
        _ctx.accounts.account.amount = data.amount;
        Ok(())
    }
    
    pub fn initialize_derived_account(_ctx: Context<CreateDerivedAccount>) ->  Result<()>{
        Ok(())
    }

    pub fn deposit_sol(_ctx: Context<DepositSOL>) -> Result<()>{
        let cpi_context = CpiContext::new
        (
            _ctx.accounts.system_program.to_account_info(),
            system_program::Transfer 
            {
                from: _ctx.accounts.user.to_account_info().clone(),
                to: _ctx.accounts.pda_account.to_account_info().clone(),
            },
        );
        system_program::transfer(cpi_context, DEPOSIT_AMOUNT)?;

        Ok(())   
    }

}

#[derive(Accounts)]
pub struct Initialize {}

    
#[derive(Accounts)]
pub struct CreateUserDeposit<'info>{
    #[account(init, payer=user, space=8+40)]
    pub account: Account<'info, UserDeposit>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info>{
    #[account(mut)]
    pub account: Account<'info, UserDeposit>,
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct UserDeposit
{
    pub amount: u64,
}

#[account]
#[derive(Default)]
pub struct DerivedAccount
{
    pub user: Pubkey,
    pub balance: u64,
    pub bump: u8
}

#[derive(Accounts)]
pub struct CreateDerivedAccount<'info>
{
    #[account(init, payer=user, space=8+32+64+8, seeds=[b"MY_SEED", user.key().as_ref()], bump)]
    pub pda_account : Account<'info, DerivedAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositSOL<'info>
{
    #[account(mut, seeds=[b"MY_SEED", user.key().as_ref()], bump)]
    pub pda_account : Account<'info, DerivedAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
