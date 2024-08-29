import { Component, Input } from '@angular/core';
import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-cart',
  templateUrl: './member-cart.component.html',
  styleUrl: './member-cart.component.css'
})
export class MemberCartComponent {
  @Input() member: Member;

  constructor(private memberService: MembersService,private toastr: ToastrService)
  {

  }

  addLike(member: Member){
    this.memberService.addLike(member.userName).subscribe(()=>{
      this.toastr.success("You have liked " + member.knownAs);
    })
  }
}
