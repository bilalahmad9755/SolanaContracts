use anchor_lang::prelude::*;

declare_id!("7315G26yoNcSxQtmMT25k86ktZ319SecsPPzxeZRmN9J");

#[program]
pub mod anchorcontracts {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
    pub fn create_user_deposit(_ctx: Context<CreateUserDeposit>) -> Result<()>
    {
        Ok(())
    }

    pub fn deposit(_ctx: Context<Deposit>, data:UserDeposit) -> Result<()>
    {
        _ctx.accounts.account.amount = data.amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

    
#[derive(Accounts)]
pub struct CreateUserDeposit<'info>{
    #[account(init, payer=user, space=8+40)]
    pub data: Box<Account<'info, UserDeposit>>,
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
