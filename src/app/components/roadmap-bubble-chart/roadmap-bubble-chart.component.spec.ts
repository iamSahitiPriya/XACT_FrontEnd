import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadmapBubbleChartComponent } from './roadmap-bubble-chart.component';

describe('RoadmapBubbleChartComponent', () => {
  let component: RoadmapBubbleChartComponent;
  let fixture: ComponentFixture<RoadmapBubbleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoadmapBubbleChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoadmapBubbleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
