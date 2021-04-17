import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.constants';
import { Feedback } from '../sessions/sessions-list/session-details/feedback/feedback.model';
import { AuthorizationService } from './authorization.service';
import { Session } from './session.model';

@Injectable()
export class SessionsService {

    private sessionsFromDB: Session[];

    constructor(private http: HttpClient, private auth: AuthorizationService) {

    }

    ngOnInit(): void {
    }

    setSessions(sessions: Session[]) {
        this.sessionsFromDB = sessions;
    }
    getSessions() {
        return this.sessionsFromDB;
    }

    fetchAllSessionsDB() {
        return this.http
            .get<Session[]>(`${API_URL}/session`);
    }

    fetchSessionDetailsById(id: string) {
        if(this.sessionsFromDB != null && this.sessionsFromDB != undefined){
            for (var session of this.sessionsFromDB) {
                if (session.id == id) {
                    return session;
                }
            }
        }        
        return null;
    }

    fetchSessionDetailsByIdFromDB(sessionId: string) {
        return this.http
            .get<Session>(`${API_URL}/session/${sessionId}`);
    }

    createSession(session: Session){
        return this.http
            .post(`${API_URL}/session`,
            session);

    }

    updateFeedback(sessionId: string, feedback: Feedback, email: string){
         var requestBody = {
             email: email,
             feedback: feedback
         };

        return this.http
            .put(`${API_URL}/session/${sessionId}/feedback`,
            requestBody);
    }
}