import { Router, Request, Response } from 'express';
import { notesDb } from '../lib/db';

const router = Router();

router.get('/pages', async (req: Request, res: Response) => {
  try {
    const pages = await notesDb.getAllPages();
    res.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

router.get('/pages/:id', async (req: Request, res: Response) => {
  try {
    const page = await notesDb.getPageById(req.params.id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

router.post('/pages', async (req: Request, res: Response) => {
  try {
    const { title, icon, subjectId, parentId } = req.body;
    const newPage = await notesDb.createPage({ title, icon, subjectId, parentId });
    res.status(201).json(newPage);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Failed to create page' });
  }
});

router.put('/pages/:id', async (req: Request, res: Response) => {
  try {
    const { title, icon, subjectId, parentId } = req.body;
    const page = await notesDb.updatePage(req.params.id, { title, icon, subjectId, parentId });
    res.json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ error: 'Failed to update page' });
  }
});

router.delete('/pages/:id', async (req: Request, res: Response) => {
  try {
    await notesDb.deletePage(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

router.get('/pages/:id/blocks', async (req: Request, res: Response) => {
  try {
    const blocks = await notesDb.getBlocks(req.params.id);
    res.json(blocks);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
});

router.post('/pages/:id/blocks', async (req: Request, res: Response) => {
  try {
    const { type, content, afterBlockId } = req.body;
    const block = await notesDb.createBlock(req.params.id, { type, content, afterBlockId });
    res.status(201).json(block);
  } catch (error) {
    console.error('Error creating block:', error);
    res.status(500).json({ error: 'Failed to create block' });
  }
});

router.put('/pages/:pageId/blocks/:blockId', async (req: Request, res: Response) => {
  try {
    const { content, type, properties, checked } = req.body;
    const block = await notesDb.updateBlock(req.params.pageId, req.params.blockId, {
      content,
      type,
      properties,
      checked,
    });
    res.json(block);
  } catch (error) {
    console.error('Error updating block:', error);
    res.status(500).json({ error: 'Failed to update block' });
  }
});

router.delete('/pages/:pageId/blocks/:blockId', async (req: Request, res: Response) => {
  try {
    await notesDb.deleteBlock(req.params.pageId, req.params.blockId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting block:', error);
    res.status(500).json({ error: 'Failed to delete block' });
  }
});

export default router;
