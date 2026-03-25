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

    console.log('[Strava Callback] Received:', { code: !!code, scope, error });

    // Handle authorization errors
    if (error) {
      console.error('[Strava Callback] Authorization error:', error);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code) {
      console.error('[Strava Callback] No authorization code received');
      return NextResponse.redirect(
        new URL('/login?error=no_authorization_code', request.url)
      );
    }

    // Exchange authorization code for tokens
    console.log('[Strava Callback] Exchanging code for tokens...');
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

    console.log('[Strava Callback] Tokens received for athlete:', athlete.id);

    // Store tokens and athlete info in Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !serviceKey) {
      console.error('[Strava Callback] Missing Supabase credentials');
      return NextResponse.redirect(
        new URL('/login?error=missing_supabase_config', request.url)
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    console.log('[Strava Callback] Updating profile in Supabase...');

    // Update user profile with Strava data
    const { data, error: updateError } = await supabase
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
      console.error('[Strava Callback] Error updating profile:', updateError);
      return NextResponse.redirect(
        new URL('/login?error=database_error', request.url)
      );
    }

    console.log('[Strava Callback] Profile updated successfully');

    // Create response with redirect
    const response = NextResponse.redirect(new URL('/authenticated', request.url));
    
    // Store user data in a secure cookie or response header for client to read
    const userData = {
      id: athlete.id.toString(),
      strava_id: athlete.id,
      name: `${athlete.firstname} ${athlete.lastname}`,
      avatar_url: athlete.profile,
      strava_access_token: access_token,
      strava_refresh_token: refresh_token,
      strava_token_expires_at: new Date(expires_at * 1000).toISOString(),
    };

    // Set cookie with user data (will be picked up by authenticated page)
    response.cookies.set('smartwatts_user', JSON.stringify(userData), {
      httpOnly: false, // Allow client-side access for demo
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('[Strava Callback] Unexpected error:', error);
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent('authentication_failed')}`,
        request.url
      )
    );
  }
}
