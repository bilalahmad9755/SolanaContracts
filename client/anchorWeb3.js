const { Wallet, parseIdlErrors } = require("@coral-xyz/anchor");
const anchor = require("@project-serum/anchor");
const MyProgram = require("../target/idl/anchorcontracts.json");
const key = require("../wallets/w1.json");
const web3 = require('@solana/web3.js');
const { bytes } = require("@coral-xyz/anchor/dist/cjs/utils");


async function main() {
  
  // ***generating PDA from user Keypair...
  const userKeypair = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(key));
  const programId = "7315G26yoNcSxQtmMT25k86ktZ319SecsPPzxeZRmN9J";
  const seed = "MY_SEED";
  const [pda, bump] = web3.PublicKey.findProgramAddressSync([anchor.utils.bytes.utf8.encode("MY_SEED"), userKeypair.publicKey.toBuffer()], new web3.PublicKey(programId));
  // const bytes32 = new Uint8Array(32);
  // bytes32[0] = pda;
  // const derivedKeypair = web3.Keypair.fromSeed(Buffer.from(bytes32));
  console.log("PDA derived account: ",pda);
  //console.log("derived Keypair: ", pda.publicKey.toBase58());

  // ***network providers, signers and program Id 
  const programkey = new web3.PublicKey(programId);
  console.log("program key: ", programkey);
  const url = "http://127.0.0.1:8899";
  console.log("keypair: ", userKeypair.publicKey);
  const signer = new anchor.Wallet(userKeypair);
  console.log("signer :", signer);
  const provider = new anchor.AnchorProvider(new anchor.web3.Connection(url), signer, {commitment: "confirmed"} );
  anchor.setProvider(provider);

  // ***generating random/new keys for dataAccount to store the global data...
  const dataAccount = anchor.web3.Keypair.generate();
  console.log("dataAccount: ", dataAccount);
  console.log("keypair generated for Userdeposit account: ", dataAccount.publicKey.toString());

  // ***using derviedAccount for storing data for specific user...
  const derivedAccount = pda;

  const program = new anchor.Program(MyProgram, programId, provider);
  console.log("smart contract: ", program);

  // ***Call a method on the program
  //  const initialized  = await program.methods.initialize().rpc();
  // console.log("smart Contract initialized: ", initialized);
  // const txHash1 = await program.methods.initializeUserDeposit().accounts({account:dataAccount.publicKey, user: signer.publicKey, systemProgram: anchor.web3.SystemProgram.programId}).signers([dataAccount]).rpc();
  // const txHash2 = await program.methods.deposit({amount:new anchor.BN(100)}).accounts({account:dataAccount.publicKey, user: signer.publicKey, systemProgram: anchor.web3.SystemProgram.programId}).rpc();
  // console.log("deposit account initialized:", txHash1);
  // console.log("amount stored: ", txHash2);
  // const record = await program.account.userDeposit.fetch("Eyt47ue6Q8gyKKHvzdYfYnzdZ5EkNZpxem5EieeQEeaA");
  // console.log("amount stored in smart contract is: ", record.amount.toString());


  // ***Initializing derivedAccount of User...
  // const pda_initialized = await program.methods.initializeDerivedAccount().accounts({user: signer.publicKey, pdaAccount: derivedAccount}).rpc();
  // console.log("PDA initialized: ", pda_initialized);
  // const userRecord = await program.account.derivedAccount.fetch(pda.publicKey);
  // console.log("user Record: ", userRecord);
  // const depositedSOL = await program.methods.depositSol().accounts({pdaAccount: derivedAccount, user: signer.publicKey, systemProgram: anchor.web3.SystemProgram.programId}).signers([userKeypair]).rpc();
  // console.log("SOL deposited: ", depositedSOL);
  const accountInfo = await provider.connection.getAccountInfo(pda);
  console.log("pda account balance: ", accountInfo.lamports);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


// to store data create keypair and create initialize 
