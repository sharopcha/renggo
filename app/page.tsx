'use client';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function MainPage() {
  const supabase = createClient();
    const router = useRouter();
  
    useEffect(() => {
      const getUser = async () => {
        const { data } = await supabase.auth.getUser();

        if(!data.user) {
          router.push("/coming-soon");
        } else {
          router.push("/backoffice");
        }
      };
  
      getUser();
    }, [supabase, router]);

    return (<></>)
}
