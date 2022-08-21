import { ethers } from "hardhat";

async function main() {

  const RSVP = await ethers.getContractFactory("RSVP");
  const rsvp = await RSVP.deploy();

  await rsvp.deployed();

  console.log(`deployed to ${rsvp.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
