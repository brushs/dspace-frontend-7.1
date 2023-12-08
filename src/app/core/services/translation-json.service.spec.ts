import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslationJsonService } from './translation-json.service';

// "Economics and industry": "Économie et industrie",

describe('TranslationJsonService', () => {
  let service: TranslationJsonService;
  let fixture: ComponentFixture<TranslationJsonService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [TranslationJsonService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationJsonService);
    service = fixture.debugElement.injector.get(TranslationJsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load JSON5 file for English', async () => {
    await service.loadJson5File('en');
    expect(service['parsedDataEnglish']).toBeTruthy();
  });

  it('should load JSON5 file for French', async () => {
    await service.loadJson5File('fr');
    expect(service['parsedDataFrench']).toBeTruthy();
  });

  it('should get value by key for English', async () => {
    await service.loadJson5File('en');
    const value = service.getValueByKey('Economics and industry', 'en');
    expect(value).toBeDefined();
  });

  it('should get value by key for French', async () => {
    await service.loadJson5File('fr');
    const value = service.getValueByKey('Economics and industry', 'fr');
    expect(value).toBeDefined();
  });

  it('should get key by value for English', async () => {
    await service.loadJson5File('en');
    const key = service.getKeyByValue('Economics and industry', 'en');
    expect(key).toBeDefined();
  });

  it('should get key by value for French', async () => {
    await service.loadJson5File('fr');
    const key = service.getKeyByValue('Économie et industrie', 'fr');
    expect(key).toBeDefined();
  });

  it('should get keys by value for English', async () => {
    await service.loadJson5File('en');
    const keys = service.getKeysByValue('Economics and industry', 'en');
    expect(keys).toBeDefined();
  });

  it('should get keys by value for French', async () => {
    await service.loadJson5File('fr');
    const keys = service.getKeysByValue('Économie et industrie', 'fr');
    expect(keys).toBeDefined();
  });
});
