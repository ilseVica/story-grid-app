import { type Chapter, type InsertChapter, type Character, type InsertCharacter, type Card, type InsertCard, chapters, characters, cards } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Chapters
  getChapters(): Promise<Chapter[]>;
  createChapter(chapter: InsertChapter): Promise<Chapter>;
  updateChapter(id: string, chapter: Partial<InsertChapter>): Promise<Chapter>;
  deleteChapter(id: string): Promise<void>;

  // Characters
  getCharacters(): Promise<Character[]>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: string, character: Partial<InsertCharacter>): Promise<Character>;
  deleteCharacter(id: string): Promise<void>;

  // Cards
  getCards(): Promise<Card[]>;
  getCard(characterId: string, chapterId: string): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: string, card: Partial<InsertCard>): Promise<Card>;
  deleteCard(id: string): Promise<void>;
  deleteCardsByCharacter(characterId: string): Promise<void>;
  deleteCardsByChapter(chapterId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Chapters
  async getChapters(): Promise<Chapter[]> {
    const result = await db.select().from(chapters).orderBy(chapters.order);
    return result;
  }

  async createChapter(insertChapter: InsertChapter): Promise<Chapter> {
    const [chapter] = await db
      .insert(chapters)
      .values(insertChapter)
      .returning();
    return chapter;
  }

  async updateChapter(id: string, updateData: Partial<InsertChapter>): Promise<Chapter> {
    const [chapter] = await db
      .update(chapters)
      .set(updateData)
      .where(eq(chapters.id, id))
      .returning();
    if (!chapter) {
      throw new Error("Chapter not found");
    }
    return chapter;
  }

  async deleteChapter(id: string): Promise<void> {
    await this.deleteCardsByChapter(id);
    await db.delete(chapters).where(eq(chapters.id, id));
  }

  // Characters
  async getCharacters(): Promise<Character[]> {
    const result = await db.select().from(characters).orderBy(characters.order);
    return result;
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const [character] = await db
      .insert(characters)
      .values(insertCharacter)
      .returning();
    return character;
  }

  async updateCharacter(id: string, updateData: Partial<InsertCharacter>): Promise<Character> {
    const [character] = await db
      .update(characters)
      .set(updateData)
      .where(eq(characters.id, id))
      .returning();
    if (!character) {
      throw new Error("Character not found");
    }
    return character;
  }

  async deleteCharacter(id: string): Promise<void> {
    await this.deleteCardsByCharacter(id);
    await db.delete(characters).where(eq(characters.id, id));
  }

  // Cards
  async getCards(): Promise<Card[]> {
    const result = await db.select().from(cards);
    return result;
  }

  async getCard(characterId: string, chapterId: string): Promise<Card | undefined> {
    const [card] = await db
      .select()
      .from(cards)
      .where(
        and(eq(cards.characterId, characterId), eq(cards.chapterId, chapterId))
      );
    return card || undefined;
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const [card] = await db
      .insert(cards)
      .values(insertCard)
      .returning();
    return card;
  }

  async updateCard(id: string, updateData: Partial<InsertCard>): Promise<Card> {
    const [card] = await db
      .update(cards)
      .set(updateData)
      .where(eq(cards.id, id))
      .returning();
    if (!card) {
      throw new Error("Card not found");
    }
    return card;
  }

  async deleteCard(id: string): Promise<void> {
    await db.delete(cards).where(eq(cards.id, id));
  }

  async deleteCardsByCharacter(characterId: string): Promise<void> {
    await db.delete(cards).where(eq(cards.characterId, characterId));
  }

  async deleteCardsByChapter(chapterId: string): Promise<void> {
    await db.delete(cards).where(eq(cards.chapterId, chapterId));
  }
}

export const storage = new DatabaseStorage();
