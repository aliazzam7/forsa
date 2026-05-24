// src/components/hooks/useCompanyProfile.js
import { useState, useEffect } from 'react';
import companyService from '../../services/companyService';

const API_BASE = 'http://localhost/forsa-platform-backend';

const useCompanyProfile = () => {
  const [companyProfile, setCompanyProfile] = useState({ name: '', logo: null });

  useEffect(() => {
    companyService
      .getProfile()
      .then((res) => {
        const profile = res?.data ?? res;

        const rawLogo = profile?.logo ?? null;

        const logoUrl = rawLogo
          ? rawLogo.startsWith('http')
            ? rawLogo
            : `${API_BASE}/${rawLogo}`
          : null;

        setCompanyProfile({
          name: profile?.company_name ?? '',
          logo: logoUrl,
        });
      })
      .catch(() => {
        // silently fail — header will show fallback initial
      });
  }, []);

  return companyProfile;
};

export default useCompanyProfile;