export type PeticionHttp = {
  pathParameters?: { eventId?: string; userId?: string };
};

export type ClaveInscripcion = {
  eventId: bigint;
  userId: string;
};

type Operacion = (clave: ClaveInscripcion) => Promise<ReturnType<typeof json>>;

export function json(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body, (_name, value) =>
      typeof value === 'bigint' ? value.toString() : value)
  };
}

export async function handleRequest(event: PeticionHttp | undefined, operation: Operacion) {
  const { eventId: routeId, userId } = event?.pathParameters ?? {};
  if (!routeId || !/^[1-9]\d{0,18}$/.test(routeId) || !userId?.trim()) {
    return json(400, { message: 'Indica un ID numérico positivo y un código de usuario' });
  }
  try {
    const eventId = BigInt(routeId);
    return await operation({ eventId, userId });
  } catch (error) {
    if (error instanceof Error && error.name === 'ConditionalCheckFailedException') {
      return json(409, { message: 'La operación no se puede aplicar a este estado' });
    }
    console.error(error);
    return json(500, { message: 'Revisa los logs de la función' });
  }
}
