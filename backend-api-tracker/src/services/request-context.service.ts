import { Injectable, Scope } from '@nestjs/common';

export interface UserContext {
  sub: number;
  email: string;
}

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private user: UserContext | null = null;

  setUser(user: UserContext): void {
    this.user = user;
  }

  getUser(): UserContext | null {
    return this.user;
  }

  getUserId(): number {
    if (!this.user?.sub) {
      throw new Error('Usuario no autenticado');
    }
    return this.user.sub;
  }

  getUserEmail(): string | null {
    return this.user?.email || null;
  }
}
