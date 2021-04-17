import { Feedback } from '../sessions/sessions-list/session-details/feedback/feedback.model';

export class Session {
    constructor(
        public createdBy: string,
        public description: string,
        public id: string,
        public presenters: string[],
        public scheduledDate: string,
        public status: string,
        public submittedAt: string,
        public tags: string[],
        public topic: string,
        public updatedAt: string,
        public email: string,
        public feedbacks: Feedback[]
    ) {

    }
}