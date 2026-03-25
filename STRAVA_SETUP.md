# Integración Strava OAuth

## Configuración

La integración con Strava OAuth permite a los usuarios sincronizar sus actividades de entrenamiento automáticamente.

### Variables de Entorno

Añade estas variables a tu `.env.local`:

```env
# Strava OAuth
STRAVA_CLIENT_ID=tu_client_id
STRAVA_CLIENT_SECRET=tu_client_secret
NEXT_PUBLIC_STRAVA_CLIENT_ID=tu_client_id
STRAVA_ACCESS_TOKEN=tu_access_token
STRAVA_REFRESH_TOKEN=tu_refresh_token

# Supabase
SUPABASE_SERVICE_KEY=tu_service_key
```

### Flujo de Autenticación

1. Usuario hace clic en "Conectar con Strava" en `/login`
2. Se redirige a Strava con `client_id` y `redirect_uri`
3. Usuario autoriza el acceso
4. Strava redirige a `/api/auth/strava/callback` con código de autorización
5. El código se intercambia por tokens de acceso y refresh
6. Los tokens se guardan en Supabase (tabla `profiles`)
7. Usuario es redirigido a `/authenticated` y luego a `/`

### Endpoints API

#### GET `/api/auth/strava/callback`
Maneja el callback de Strava OAuth. Automático, no llamar directamente.

#### GET `/api/strava/activities`
Obtiene actividades recientes de Strava.

**Headers requeridos:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "activities": [
    {
      "id": 1234567890,
      "name": "Paseo matutino",
      "type": "Ride",
      "distance": 25000,
      "moving_time": 1800,
      "elevation_gain": 200,
      "start_date": "2026-03-25T08:00:00Z",
      "average_watts": 250,
      "average_heartrate": 145,
      ...
    }
  ]
}
```

#### POST `/api/strava/refresh-token`
Actualiza el token de acceso cuando expira.

**Body:**
```json
{
  "refresh_token": "tu_refresh_token"
}
```

**Response:**
```json
{
  "access_token": "nuevo_token",
  "refresh_token": "nuevo_refresh_token",
  "expires_at": 1234567890
}
```

### Hooks Personalizados

#### `useStravaActivities(accessToken)`
Hook para obtener actividades de Strava.

**Parámetros:**
- `accessToken`: Token de acceso de Strava (string | null)

**Retorna:**
```typescript
{
  activities: StravaActivity[],
  loading: boolean,
  error: string | null,
  refetch: () => Promise<void>
}
```

**Uso:**
```typescript
const { activities, loading, error } = useStravaActivities(accessToken);
```

### Schema Supabase

Columnas requeridas en tabla `profiles`:

```sql
ALTER TABLE profiles ADD COLUMN strava_id BIGINT;
ALTER TABLE profiles ADD COLUMN strava_access_token TEXT;
ALTER TABLE profiles ADD COLUMN strava_refresh_token TEXT;
ALTER TABLE profiles ADD COLUMN strava_token_expires_at TIMESTAMPTZ;
```

### Prueba Local

1. Corre el servidor: `npm run dev`
2. Ve a `http://localhost:3000/login`
3. Haz clic en "Conectar con Strava"
4. Autoriza el acceso
5. Se sincronizarán tus actividades

### Troubleshooting

**Error: "redirect_uri_mismatch"**
- Verifica que el `NEXT_PUBLIC_APP_URL` coincida con el Redirect URI en Strava

**Error: "unauthorized"**
- El token de acceso ha expirado. Usa `/api/strava/refresh-token` para obtener uno nuevo

**Error: "database_error"**
- Verifica que la tabla `profiles` tenga todas las columnas requeridas
- Verifica que `SUPABASE_SERVICE_KEY` esté correctamente configurada
