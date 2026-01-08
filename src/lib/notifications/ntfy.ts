import axios from 'axios';
import { db } from '@/core/config';
import {
  ntfyTopicTable,
  ntfyCredentialTable,
  ntfyActionTable,
  ntfyActionTagTable,
} from '@/db';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';

interface NtfyNotifyOptions {
  topicId: number;
  message: string;
  title?: string;
  priority?: number;
  tags?: string[];
}

/**
 * Low-level function to send a notification to ntfy.
 */
export async function sendNtfyNotification(options: NtfyNotifyOptions) {
  const { topicId, message, title, priority, tags } = options;

  try {
    const [topicData] = await db
      .select({
        topic: ntfyTopicTable.topic,
        baseUrl: ntfyCredentialTable.baseUrl,
        username: ntfyCredentialTable.username,
        password: ntfyCredentialTable.password,
        token: ntfyCredentialTable.token,
      })
      .from(ntfyTopicTable)
      .innerJoin(
        ntfyCredentialTable,
        eq(ntfyTopicTable.credentialId, ntfyCredentialTable.id),
      )
      .where(eq(ntfyTopicTable.id, topicId));

    if (!topicData) {
      logger.error(`[Ntfy] Topic with ID ${topicId} not found.`);
      return;
    }

    const url = `${topicData.baseUrl.replace(/\/$/, '')}/${topicData.topic}`;
    const headers: Record<string, string> = {
      'Content-Type': 'text/plain',
    };

    if (title) headers['Title'] = title;
    if (priority) headers['Priority'] = priority.toString();
    if (tags && tags.length > 0) headers['Tags'] = tags.join(',');

    if (topicData.token) {
      headers['Authorization'] = `Bearer ${topicData.token}`;
    } else if (topicData.username && topicData.password) {
      const auth = Buffer.from(
        `${topicData.username}:${topicData.password}`,
      ).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }

    await axios.post(url, message, { headers });
    logger.info(`[Ntfy] Notification sent to topic: ${topicData.topic}`);
  } catch (error: any) {
    logger.error(
      { error: error.message },
      `[Ntfy] Failed to send notification to topic ID ${topicId}`,
    );
  }
}

/**
 * Higher-level function to process an ntfy action by its ID.
 */
export async function processNtfyAction(ntfyActionId: number, message: string) {
  try {
    const [action] = await db
      .select()
      .from(ntfyActionTable)
      .where(eq(ntfyActionTable.id, ntfyActionId));

    if (!action || !action.ntfyTopicId) {
      logger.error(
        `[Ntfy] Action with ID ${ntfyActionId} not found or has no topic.`,
      );
      return;
    }

    const tags = await db
      .select({ tag: ntfyActionTagTable.tag })
      .from(ntfyActionTagTable)
      .where(eq(ntfyActionTagTable.ntfyActionId, ntfyActionId));

    await sendNtfyNotification({
      topicId: action.ntfyTopicId,
      message,
      title: action.title ?? undefined,
      priority: action.priority ?? undefined,
      tags: tags.map((t) => t.tag),
    });
  } catch (error: any) {
    logger.error(
      { error: error.message },
      `[Ntfy] Error processing action ${ntfyActionId}`,
    );
  }
}
