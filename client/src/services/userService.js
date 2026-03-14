import * as authService from './authService.js';

// Thin convenience wrappers around existing auth-related endpoints.

export const fetchCurrentUser = async () => {
  const data = await authService.getMe();
  return data.user;
};

export const updateCurrentUserProfile = async ({ name }) => {
  const data = await authService.updateProfile({ name });
  return data.user;
};

export const deleteCurrentUserProfile = async () => {
  const data = await authService.deleteProfile();
  return data;
};

