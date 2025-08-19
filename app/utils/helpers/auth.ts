// server/utils/auth.ts
import { H3Event } from 'h3';
import type { ITeam } from '~/utils/models';

export function requireAuth(event: H3Event) {
    const user = event.context.user;
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        });
    }
    return user;
}

export function isTeamMember(user: any, teamId: string): boolean {
  if (!user || !user.teams) {
    return false;
  }
  return user.teams.some((team: ITeam) => team.id === teamId);
}
