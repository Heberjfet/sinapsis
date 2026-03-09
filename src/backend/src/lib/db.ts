import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export { prisma };

export const notesDb = {
  async getAllPages() {
    return prisma.page.findMany({
      include: { blocks: true },
      orderBy: { updatedAt: 'desc' },
    });
  },

  async getPageById(id: string) {
    return prisma.page.findUnique({
      where: { id },
      include: { blocks: true },
    });
  },

  async createPage(data: { title?: string; icon?: string; subjectId?: string; parentId?: string }) {
    const page = await prisma.page.create({
      data: {
        title: data.title || 'Sin título',
        icon: data.icon || '📄',
      },
      include: { blocks: true },
    });

    await prisma.block.create({
      data: {
        id: crypto.randomUUID(),
        type: 'paragraph',
        content: '',
        pageId: page.id,
      },
    });

    return prisma.page.findUnique({
      where: { id: page.id },
      include: { blocks: true },
    });
  },

  async updatePage(id: string, data: { title?: string; icon?: string; subjectId?: string; parentId?: string }) {
    return prisma.page.update({
      where: { id },
      data: {
        title: data.title,
        icon: data.icon,
      },
      include: { blocks: true },
    });
  },

  async deletePage(id: string) {
    await prisma.block.deleteMany({ where: { pageId: id } });
    await prisma.page.delete({ where: { id } });
  },

  async getBlocks(pageId: string) {
    return prisma.block.findMany({
      where: { pageId },
      orderBy: { id: 'asc' },
    });
  },

  async createBlock(pageId: string, data: { type?: string; content?: string; afterBlockId?: string }) {
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: { blocks: true },
    });

    if (!page) throw new Error('Page not found');

    const block = await prisma.block.create({
      data: {
        type: data.type || 'paragraph',
        content: data.content || '',
        pageId,
      },
    });

    await prisma.page.update({
      where: { id: pageId },
      data: { updatedAt: new Date() },
    });

    return block;
  },

  async updateBlock(pageId: string, blockId: string, data: { content?: string; type?: string; properties?: object; checked?: boolean }) {
    const block = await prisma.block.update({
      where: { id: blockId },
      data: {
        content: data.content,
        type: data.type,
        properties: data.properties as any,
        checked: data.checked,
      },
    });

    await prisma.page.update({
      where: { id: pageId },
      data: { updatedAt: new Date() },
    });

    return block;
  },

  async deleteBlock(pageId: string, blockId: string) {
    await prisma.block.delete({ where: { id: blockId } });
    await prisma.page.update({
      where: { id: pageId },
      data: { updatedAt: new Date() },
    });
  },
};
