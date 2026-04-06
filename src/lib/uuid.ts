// UUID Utility Functions
// Use these instead of custom string IDs

export function generateUUID(): string {
  return crypto.randomUUID();
}

export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export function safeUserId(userId: string | undefined): string {
  if (!userId) {
    throw new Error('User ID is required');
  }
  if (!isValidUUID(userId)) {
    console.warn('Invalid UUID format detected:', userId);
  }
  return userId;
}

export function isValidCompanyId(id: string): boolean {
  return isValidUUID(id) || id === '00000000-0000-0000-0000-000000000001';
}
