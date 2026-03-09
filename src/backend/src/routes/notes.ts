import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

interface Page {
  id: string;
  title: string;
  icon: string;
  blocks: Block[];
  subjectId?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Block {
  id: string;
  type: string;
  content: string;
  properties?: Record<string, any>;
  checked?: boolean;
}

const pages: Page[] = [];

router.get('/pages', (req: Request, res: Response) => {
  res.json(pages);
});

router.get('/pages/:id', (req: Request, res: Response) => {
  const page = pages.find(p => p.id === req.params.id);
  if (!page) {
    return res.status(404).json({ error: 'Page not found' });
  }
  res.json(page);
});

router.post('/pages', (req: Request, res: Response) => {
  const { title, icon = '📄', subjectId, parentId } = req.body;
  
  const newPage: Page = {
    id: uuidv4(),
    title: title || 'Sin título',
    icon,
    blocks: [],
    subjectId,
    parentId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  pages.push(newPage);
  res.status(201).json(newPage);
});

router.put('/pages/:id', (req: Request, res: Response) => {
  const { title, icon, subjectId, parentId } = req.body;
  const pageIndex = pages.findIndex(p => p.id === req.params.id);
  
  if (pageIndex === -1) {
    return res.status(404).json({ error: 'Page not found' });
  }
  
  pages[pageIndex] = {
    ...pages[pageIndex],
    title: title ?? pages[pageIndex].title,
    icon: icon ?? pages[pageIndex].icon,
    subjectId: subjectId ?? pages[pageIndex].subjectId,
    parentId: parentId ?? pages[pageIndex].parentId,
    updatedAt: new Date().toISOString(),
  };
  
  res.json(pages[pageIndex]);
});

router.delete('/pages/:id', (req: Request, res: Response) => {
  const pageIndex = pages.findIndex(p => p.id === req.params.id);
  
  if (pageIndex === -1) {
    return res.status(404).json({ error: 'Page not found' });
  }
  
  pages.splice(pageIndex, 1);
  res.status(204).send();
});

router.get('/pages/:id/blocks', (req: Request, res: Response) => {
  const page = pages.find(p => p.id === req.params.id);
  if (!page) {
    return res.status(404).json({ error: 'Page not found' });
  }
  res.json(page.blocks);
});

router.post('/pages/:id/blocks', (req: Request, res: Response) => {
  const { type = 'paragraph', content = '', afterBlockId } = req.body;
  const page = pages.find(p => p.id === req.params.id);
  
  if (!page) {
    return res.status(404).json({ error: 'Page not found' });
  }
  
  const newBlock: Block = {
    id: uuidv4(),
    type,
    content,
  };
  
  if (afterBlockId) {
    const insertIndex = page.blocks.findIndex(b => b.id === afterBlockId);
    page.blocks.splice(insertIndex + 1, 0, newBlock);
  } else {
    page.blocks.push(newBlock);
  }
  
  page.updatedAt = new Date().toISOString();
  res.status(201).json(newBlock);
});

router.put('/pages/:pageId/blocks/:blockId', (req: Request, res: Response) => {
  const { content, type, properties, checked } = req.body;
  const page = pages.find(p => p.id === req.params.pageId);
  
  if (!page) {
    return res.status(404).json({ error: 'Page not found' });
  }
  
  const block = page.blocks.find(b => b.id === req.params.blockId);
  if (!block) {
    return res.status(404).json({ error: 'Block not found' });
  }
  
  block.content = content ?? block.content;
  block.type = type ?? block.type;
  block.properties = properties ?? block.properties;
  if (checked !== undefined) block.checked = checked;
  
  page.updatedAt = new Date().toISOString();
  res.json(block);
});

router.delete('/pages/:pageId/blocks/:blockId', (req: Request, res: Response) => {
  const page = pages.find(p => p.id === req.params.pageId);
  
  if (!page) {
    return res.status(404).json({ error: 'Page not found' });
  }
  
  const blockIndex = page.blocks.findIndex(b => b.id === req.params.blockId);
  if (blockIndex === -1) {
    return res.status(404).json({ error: 'Block not found' });
  }
  
  page.blocks.splice(blockIndex, 1);
  page.updatedAt = new Date().toISOString();
  res.status(204).send();
});

export default router;
