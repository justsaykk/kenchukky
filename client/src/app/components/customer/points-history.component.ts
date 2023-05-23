import { Component, OnInit } from '@angular/core';
import { ServerUser } from 'src/app/models/models';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-points-history',
  templateUrl: './points-history.component.html',
  styleUrls: ['./points-history.component.css'],
})
export class PointsHistoryComponent implements OnInit {
  pointsHistoryTestInput = [
    {
      transaction: 'Redeemed 3000 points for HPB voucher',
      date: '15-04-2023 15:23',
    },
    {
      transaction: 'Redeemed 1500 points for HPB voucher',
      date: '15-04-2023 15:22',
    },
    {
      transaction: 'Recevied 30 points for 1 container(s) saved',
      date: '12-04-2023 13:22',
    },
    {
      transaction: 'Recevied 10 points for 1 cup(s) saved',
      date: '12-04-2023 13:15',
    },
    {
      transaction: 'Recevied 20 points for 2 cup(s) saved',
      date: '11-03-2023 19:22',
    },
  ];

  userPoints!: number; 
  userDollars!: string;
  loggedInUser!: ServerUser | null;
  
  constructor(
    private backendService: BackendService
  ) {
    this.backendService.getLoggedInUser().forEach((user) => this.loggedInUser = user)
  }

  ngOnInit(): void {

    this.userPoints = this.loggedInUser?.totalPoints!; 
    this.userDollars = (this.userPoints/300).toFixed(2);

  }

}
