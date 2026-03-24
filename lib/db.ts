import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { Participant, Jugada, WinningPosition } from './types'

const PK = process.env.DYNAMODB_TABLE_PARTITION_KEY || 'pk'
const REGION = process.env.AWS_REGION || 'us-east-1'

function getTableName(): string {
  const tableName = process.env.DYNAMODB_TABLE_NAME
  if (!tableName) {
    throw new Error('Missing required environment variable: DYNAMODB_TABLE_NAME')
  }
  return tableName
}

const client = new DynamoDBClient({
  region: REGION,
  // AWS SDK toma credenciales automáticamente de:
  // - AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY
  // - ~/.aws/credentials
  // - IAM role del entorno si existe
})

const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
})

// ==================== PARTICIPANTS ====================

export async function createParticipant(participant: Participant): Promise<Participant> {
  await docClient.send(
    new PutCommand({
      TableName: getTableName(),
      Item: {
        [PK]: `PARTICIPANT#${participant.id}`,
        sk: `PARTICIPANT#${participant.id}`,
        type: 'PARTICIPANT',
        ...participant,
      },
    }),
  )
  return participant
}

export async function getParticipantById(id: string): Promise<Participant | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: getTableName(),
      Key: {
        [PK]: `PARTICIPANT#${id}`,
        sk: `PARTICIPANT#${id}`,
      },
    }),
  )
  return (result.Item as Participant) || null
}

export async function getParticipantByEmail(email: string): Promise<Participant | null> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: getTableName(),
      FilterExpression: '#type = :type AND email = :email',
      ExpressionAttributeNames: {
        '#type': 'type',
      },
      ExpressionAttributeValues: {
        ':type': 'PARTICIPANT',
        ':email': email,
      },
    }),
  )
  return (result.Items?.[0] as Participant) || null
}

// ==================== JUGADAS ====================

export async function createJugada(jugada: Jugada): Promise<Jugada> {
  await docClient.send(
    new PutCommand({
      TableName: getTableName(),
      Item: {
        [PK]: `PARTICIPANT#${jugada.participantId}`,
        sk: `JUGADA#${jugada.id}`,
        type: 'JUGADA',
        gsi1pk: `PRIZE#${jugada.prizeId}`,
        gsi1sk: `JUGADA#${jugada.id}`,
        ...jugada,
      },
    }),
  )
  return jugada
}

export async function getJugadasByParticipant(participantId: string): Promise<Jugada[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: getTableName(),
      KeyConditionExpression: `${PK} = :pk AND begins_with(sk, :sk)`,
      ExpressionAttributeValues: {
        ':pk': `PARTICIPANT#${participantId}`,
        ':sk': 'JUGADA#',
      },
    }),
  )
  return (result.Items || []) as Jugada[]
}

export async function getJugadasByPrize(prizeId: string): Promise<Jugada[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: getTableName(),
      IndexName: 'gsi1',
      KeyConditionExpression: 'gsi1pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `PRIZE#${prizeId}`,
      },
    }),
  )
  return (result.Items || []) as Jugada[]
}

export async function getAllJugadas(): Promise<Jugada[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: getTableName(),
      FilterExpression: '#type = :type',
      ExpressionAttributeNames: {
        '#type': 'type',
      },
      ExpressionAttributeValues: {
        ':type': 'JUGADA',
      },
    }),
  )
  return (result.Items || []) as Jugada[]
}

export async function updateJugadaWinner(
  participantId: string,
  jugadaId: string,
  isWinner: boolean,
  notifiedAt?: number
): Promise<void> {
  await docClient.send(
    new UpdateCommand({
      TableName: getTableName(),
      Key: {
        [PK]: `PARTICIPANT#${participantId}`,
        sk: `JUGADA#${jugadaId}`,
      },
      UpdateExpression: 'SET isWinner = :winner, notifiedAt = :notified',
      ExpressionAttributeValues: {
        ':winner': isWinner,
        ':notified': notifiedAt || Date.now(),
      },
    }),
  )
}

// ==================== WINNING POSITIONS ====================

export async function createWinningPosition(position: WinningPosition): Promise<WinningPosition> {
  await docClient.send(
    new PutCommand({
      TableName: getTableName(),
      Item: {
        [PK]: `WINNING#${position.prizeId}`,
        sk: `POSITION#${position.id}`,
        type: 'WINNING_POSITION',
        ...position,
      },
    }),
  )
  return position
}

export async function getWinningPositionByPrize(prizeId: string): Promise<WinningPosition | null> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: getTableName(),
      KeyConditionExpression: `${PK} = :pk AND begins_with(sk, :sk)`,
      ExpressionAttributeValues: {
        ':pk': `WINNING#${prizeId}`,
        ':sk': 'POSITION#',
      },
      Limit: 1,
    }),
  )
  return (result.Items?.[0] as WinningPosition) || null
}

export async function getAllWinningPositions(): Promise<WinningPosition[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: getTableName(),
      FilterExpression: '#type = :type',
      ExpressionAttributeNames: {
        '#type': 'type',
      },
      ExpressionAttributeValues: {
        ':type': 'WINNING_POSITION',
      },
    }),
  )
  return (result.Items || []) as WinningPosition[]
}

export async function updateWinningPositionProcessed(
  prizeId: string,
  positionId: string,
  winnersCount: number
): Promise<void> {
  await docClient.send(
    new UpdateCommand({
      TableName: getTableName(),
      Key: {
        [PK]: `WINNING#${prizeId}`,
        sk: `POSITION#${positionId}`,
      },
      UpdateExpression: 'SET processedAt = :processed, winnersCount = :count',
      ExpressionAttributeValues: {
        ':processed': Date.now(),
        ':count': winnersCount,
      },
    }),
  )
}

// ==================== UTILITY ====================

export function calculateDistance(
  pos1: { x: number; y: number },
  pos2: { x: number; y: number }
): number {
  const dx = pos1.x - pos2.x
  const dy = pos1.y - pos2.y
  return Math.sqrt(dx * dx + dy * dy)
}

export function isWithinTolerance(
  jugadaPos: { x: number; y: number },
  winningPos: { x: number; y: number },
  tolerance: number
): boolean {
  return calculateDistance(jugadaPos, winningPos) <= tolerance
}
