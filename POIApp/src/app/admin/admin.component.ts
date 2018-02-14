import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service'
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public data: any = [];
  public keys: string[] = [];
  rowsOnPage: number = 5;
  public filterQuery = "";
  constructor(private adminService: AdminService) {
    this.adminService.GetExcelData().subscribe(response => {

      this.data = JSON.parse(response);
      this.keys = Object.keys(this.data[0]);
    })
  }

  ngOnInit() {

  }

  ApproveRequest(item) {
    debugger;
    this.adminService.ApproveRecord(item).subscribe(response => {
    }
    );
  }

  RejectRequest(item) {
    this.adminService.ApproveRecord(item).subscribe(response => {
    }
    );
  }
}
