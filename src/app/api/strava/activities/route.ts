/**
 * Get recent activities from Strava
 * Syncs athlete's latest activities with database
 */

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token provided' },
        { status: 401 }
      );
    }

    // Fetch activities from Strava API
    const response = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        per_page: 30,
        page: 1,
      },
    });

    const activities = response.data.map((activity: any) => ({
      id: activity.id,
      name: activity.name,
      type: activity.type,
      distance: activity.distance, // meters
      moving_time: activity.moving_time, // seconds
      elapsed_time: activity.elapsed_time,
      elevation_gain: activity.total_elevation_gain,
      start_date: activity.start_date,
      average_speed: activity.average_speed, // m/s
      max_speed: activity.max_speed,
      average_heartrate: activity.average_heartrate,
      max_heartrate: activity.max_heartrate,
      average_cadence: activity.average_cadence,
      kilojoules: activity.kilojoules,
      average_watts: activity.average_watts,
      map: activity.map?.summary_polyline,
      polyline: activity.polyline?.summary_polyline,
    }));

    return NextResponse.json({
      success: true,
      activities: activities,
      count: activities.length,
    });
  } catch (error: any) {
    console.error('Error fetching Strava activities:', error);

    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Access token expired or invalid' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'failed_to_fetch_activities' },
      { status: 500 }
    );
  }
}
