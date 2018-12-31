import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldmapComponent } from './worldmap/worldmap.component';
import { WorldComponent } from './world/world.component';
import { HeatComponent } from './heat/heat.component';
import { HawaiiMapComponent } from './hawaii-map/hawaii-map.component';

@NgModule({
  declarations: [WorldmapComponent, WorldComponent, HeatComponent, HawaiiMapComponent],
  imports: [
    CommonModule
  ],
  exports: [WorldmapComponent, WorldComponent, HeatComponent, HawaiiMapComponent]
})
export class MapModule { }
