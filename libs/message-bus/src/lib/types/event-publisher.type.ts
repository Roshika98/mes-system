export type IEventPublish = {
  topic: string;
  key: string;
  data: Buffer | string;
};

export interface MesEvent<T = any> {
  eventId: string;
  eventType: string;
  timestamp: string;
  source: string;
  correlationId?: string;
  tenantId: string;
  userId: string;
  data: T;
}
