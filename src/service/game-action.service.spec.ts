import { TestBed, inject } from '@angular/core/testing';

import { GameActionService } from './game-action.service';

describe('GameActionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameActionService]
    });
  });

  it('should be created', inject([GameActionService], (service: GameActionService) => {
    expect(service).toBeTruthy();
  }));
});
