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
      throw new Error(
        'Usuario no autenticado - no hay contexto de usuario disponible',
      );
    }
    return this.user.sub;
  }

  getUserEmail(): string | null {
    return this.user?.email || null;
  }

  hasUser(): boolean {
    return this.user !== null;
  }
}
