import { Component, Input } from '@angular/core';
import { Member } from '../../_models/member';

@Component({
  selector: 'app-member-cart',
  templateUrl: './member-cart.component.html',
  styleUrl: './member-cart.component.css'
})
export class MemberCartComponent {
  @Input() member: Member;

}
