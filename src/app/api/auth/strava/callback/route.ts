/**
 * Strava OAuth Callback
 * Handles the redirect from Strava after user authorization
 */

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const scope = searchParams.get('scope');
    const error = searchParams.get('error');

    // Handle authorization errors
    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/login?error=no_authorization_code', request.url)
      );
    }

    // Exchange authorization code for tokens
    const tokenResponse = await axios.post(
      'https://www.strava.com/api/v3/oauth/token',
      {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
      }
    );

    const {
      access_token,
      refresh_token,
      athlete,
      expires_at,
      expires_in,
    } = tokenResponse.data;

    // Store tokens and athlete info in Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Update user profile with Strava data
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: athlete.id.toString(),
          strava_id: athlete.id,
          name: `${athlete.firstname} ${athlete.lastname}`,
          avatar_url: athlete.profile,
          strava_access_token: access_token,
          strava_refresh_token: refresh_token,
          strava_token_expires_at: new Date(expires_at * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return NextResponse.redirect(
        new URL('/login?error=database_error', request.url)
      );
    }

    // Redirect to dashboard with success
    return NextResponse.redirect(new URL('/authenticated', request.url));
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent('authentication_failed')}`,
        request.url
      )
    );
  }
}
