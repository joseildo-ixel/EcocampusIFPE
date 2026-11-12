import { describe, beforeEach, it, expect } from 'vitest';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(() => {
    appController = new AppController(new AppService());
  });

  describe('root', () => {
    it('should return the welcome message', () => {
      expect(appController.getHello()).toBe(
        'Bem-vindo ao backend do EcocampusIFPE, world!',
      );
    });
  });
});