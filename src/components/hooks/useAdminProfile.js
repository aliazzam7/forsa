// src/hooks/useAdminProfile.js
import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const API_BASE = 'http://localhost/forsa-platform-backend';

const useAdminProfile = () => {
  const [adminProfile, setAdminProfile] = useState({ name: '', avatar: null });

  useEffect(() => {
    adminService
      .getProfile()
      .then((res) => {
        const profile = res?.data ?? res;

        const rawAvatar = profile?.avatar ?? null;

        const avatarUrl = rawAvatar
          ? rawAvatar.startsWith('http')
            ? rawAvatar                    
            : `${API_BASE}/${rawAvatar}`   
          : null;

        setAdminProfile({
          name:   profile?.name ?? '',
          avatar: avatarUrl,
        });
      })
      .catch(() => {
        // silently fail — header will show fallback initial
      });
  }, []);

  return adminProfile;
};

export default useAdminProfile;