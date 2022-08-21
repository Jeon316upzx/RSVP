import { expect } from "chai";
import { ethers } from "hardhat";

describe("RSVP", async () => {
  let deposit = await ethers.utils.parseEther("1");
  let maxCapacity = 3;
  let timestamp = 1718926200;
  let eventDataCID =
    "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi";

  let contractFactory = await ethers.getContractFactory("RSVP");
  let deployedContract = await contractFactory.deploy();
  await deployedContract.deployed();

  console.log(`contract is deployed at ${deployedContract.address}`);

  const [deployedAccount, addr1, addr2] = await ethers.getSigners();

  let txn = await deployedContract.createNewEventI(
    timestamp,
    deposit,
    maxCapacity,
    eventDataCID
  );

  let wait = await txn.wait();
  console.log("NEW EVENT CREATED:", wait.events);

  let eventID = wait.events ? wait.events[0].args?.eventID : null;
  let eventTimeStamp = wait.events ? wait.events[0].args?.timestamp : null;
  console.log("EVENT ID:", eventID);

  it(`should have same timestamp`, async () => {
    expect(timestamp).to.equal(eventTimeStamp);
  });

  it("should create new RSVPs", async () => {
    let rsvp1 = await deployedContract
      .connect(addr1)
      .createRSVPS(eventID, { value: deposit });
    let rsvp2 = await deployedContract
      .connect(addr2)
      .createRSVPS(eventID, { value: deposit });

    let wait1 = await rsvp1.wait();
    let wait2 = await rsvp2.wait();
    if (wait1.events && wait2.events) {
      console.log("NEW RSVP:", wait1.events[0].event, wait1.events[0].args);
      console.log("NEW RSVP:", wait2.events[0].event, wait2.events[0].args);
    }
  });

  it("should confirm all attendees", async () => {
    let attendees = await deployedContract.confirmAllAttendees(eventID);

    let wait = await attendees.wait();
    if (wait.events) {
      wait.events.forEach((event: any) =>
        console.log("CONFIRMED:", event.args.attendeeAddress)
      );
    }
  });
});
