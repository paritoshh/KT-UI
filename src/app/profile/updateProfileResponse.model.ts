import { Profile } from './profile.model';

export class UpdateProfileResponse {
  constructor(
    public email: string,
    public message: string,
    public profile: Profile
  ) {

  }

}