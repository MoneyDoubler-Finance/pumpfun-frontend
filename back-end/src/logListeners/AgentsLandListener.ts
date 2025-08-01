import { Connection } from "@solana/web3.js";

export class AgentsLandListener {
  constructor(private connection: Connection) {}

  listenProgramEvents(programId: string) {
    // TODO: Implement program event listening
    console.log(`Listening for events on program: ${programId}`);
  }
}
