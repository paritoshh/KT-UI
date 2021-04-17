export class RegisterSessionProfile {
    constructor(
        public email: string,
        public session: string,
        public isRegister: boolean,
        public indexOfSessionWhichNeedsToBeRemoved: number

    ) {

    }
}