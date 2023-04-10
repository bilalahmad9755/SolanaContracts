const { Wallet } = require("@coral-xyz/anchor");
const anchor = require("@project-serum/anchor");
const MyProgram = require("../target/idl/anchorcontracts.json");
const key = require("../wallets/w1.json");
const web3 = require('@solana/web3.js');


async function main() {
  // Create a new program client
 //  console.log("anchor: ", anchor);
  const programId = "7315G26yoNcSxQtmMT25k86ktZ319SecsPPzxeZRmN9J";
  const programkey = new web3.PublicKey(programId);
  console.log("program key: ", programkey);
  const url = "http://127.0.0.1:8899";
  const keypair = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(key));
  console.log("keypair: ", keypair.publicKey);
  const signer = new anchor.Wallet(keypair);
  console.log("signer :", signer);
  const provider = new anchor.AnchorProvider(new anchor.web3.Connection(url), signer, {commitment: "confirmed"} );
  anchor.setProvider(provider);
  console.log("provider: ", provider);

  const dataAccount = anchor.web3.Keypair.generate();
  console.log("keypair generated for Userdeposit accont: ", dataAccount.publicKey.toString());

  const program = new anchor.Program(MyProgram, programId, provider);
  console.log("smart contract: ", program);
  // Call a method on the program
  // await program.methods.initialize().rpc();
  // const txHash1 = await program.methods.createUserDeposit().accounts({data:dataAccount.publicKey, user: signer.publicKey, systemProgram: anchor.web3.SystemProgram.programId}).signers([dataAccount]).rpc();
  // const txHash2 = await program.methods.deposit({amount:new anchor.BN(100)}).accounts({account:dataAccount.publicKey, user: signer.publicKey, systemProgram: anchor.web3.SystemProgram.programId}).rpc();
  // console.log("deposit account initialized:", txHash1);
  // console.log("amount stored: ", txHash2);

  const record = await program.account.userDeposit.fetch("Eyt47ue6Q8gyKKHvzdYfYnzdZ5EkNZpxem5EieeQEeaA");
  console.log("amount stored in smart contract is: ", record.amount.toString());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


// to store data create keypair and create initialize 