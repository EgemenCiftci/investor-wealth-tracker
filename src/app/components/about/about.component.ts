import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  version = "1.0.0";
}
