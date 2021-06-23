export class Profile {
    constructor(
        public email: string,
        public firstName: string,
        public lastName: string,
        public location: string,
        public country: string,
        public dob: string,
        public learningPoints: number,
        public skills: string[],
        public interestedSkills: string[],
        public registeredSessions: string[],
        public hostedSessions: string[],
        public requestedSessions: string[],
        public experience: number
    ) {

    }
}