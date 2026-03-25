/**
 * Refresh Strava OAuth Token
 * Handles token refresh when access token expires
 */

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refresh_token } = body;

    if (!refresh_token) {
      return NextResponse.json(
        { error: 'refresh_token_required' },
        { status: 400 }
      );
    }

    // Request new token from Strava
    const response = await axios.post(
      'https://www.strava.com/api/v3/oauth/token',
      {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
      }
    );

    const {
      access_token,
      refresh_token: new_refresh_token,
      expires_at,
      expires_in,
    } = response.data;

    return NextResponse.json({
      access_token,
      refresh_token: new_refresh_token,
      expires_at,
      expires_in,
    });
  } catch (error: any) {
    console.error('Error refreshing Strava token:', error);

    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'invalid_refresh_token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'token_refresh_failed' },
      { status: 500 }
    );
  }
}
